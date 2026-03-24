class CarritoCompras {
  constructor() {
    this.items = this.cargarDelLocal();
  }

  cargarDelLocal() {
    const carrito = localStorage.getItem('futtzap_carrito');
    return carrito ? JSON.parse(carrito) : [];
  }

  guardarEnLocal() {
    localStorage.setItem('futtzap_carrito', JSON.stringify(this.items));
  }

  agregarProducto(producto, cantidad = 1) {
    const itemExistente = this.items.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: this.limpiarPrecio(producto.precio),
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        cantidad: cantidad
      });
    }

    this.guardarEnLocal();
    this.actualizarBadge();
    this.renderizarPanel();
  }

  eliminarProducto(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.guardarEnLocal();
    this.actualizarBadge();
    this.renderizarPanel();
  }

  actualizarCantidad(id, cantidad) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.cantidad = Math.max(1, parseInt(cantidad) || 1);
      this.guardarEnLocal();
      this.actualizarBadge();
      this.renderizarPanel();
    }
  }

  obtenerTotal() {
    return this.items.reduce((total, item) => {
      let precio = typeof item.precio === 'string' 
        ? parseFloat(item.precio.replace(/[^0-9.-]+/g, '')) || 0
        : item.precio;
      return total + (precio * item.cantidad);
    }, 0);
  }

  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  limpiarPrecio(precioStr) {
    if (typeof precioStr === 'number') return precioStr;
    // Remover "$" y espacios
    let cleaned = precioStr.replace(/[\$\s]/g, '');
    // Remover puntos (separador de miles colombiano)
    cleaned = cleaned.replace(/\./g, '');
    // Convertir a número
    return parseFloat(cleaned) || 0;
  }

  actualizarBadge() {
    const badge = document.getElementById('cart-badge');
    const cantidad = this.obtenerCantidadTotal();
    if (badge) {
      badge.textContent = cantidad;
      badge.style.display = cantidad > 0 ? 'flex' : 'none';
    }
  }

  renderizarPanel() {
    const itemsContainer = document.getElementById('cartPanelItems');
    const emptyContainer = document.getElementById('cartPanelEmpty');
    
    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyContainer) emptyContainer.style.display = 'block';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    itemsContainer.innerHTML = '';

    this.items.forEach(item => {
      const precio = typeof item.precio === 'string' 
        ? parseFloat(item.precio.replace(/[^0-9.-]+/g, '')) || 0
        : item.precio;

      itemsContainer.insertAdjacentHTML('beforeend', `
        <div class="cart-panel-item">
          <div class="cart-panel-item-img">
            <img src="${item.imagen}" alt="${item.nombre}" />
          </div>
          <div class="cart-panel-item-info">
            <div class="cart-panel-item-name">${item.nombre}</div>
            <div class="cart-panel-item-price">${formatearMoneda(precio)}</div>
            <div class="cart-panel-item-controls">
              <button onclick="carrito.actualizarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
              <input type="number" min="1" value="${item.cantidad}" onchange="carrito.actualizarCantidad(${item.id}, this.value)">
              <button onclick="carrito.actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
            </div>
          </div>
          <button class="cart-panel-item-remove" onclick="carrito.eliminarProducto(${item.id})">❌</button>
        </div>
      `);
    });

    this.actualizarResumen();
  }

  actualizarResumen() {
    const total = this.obtenerTotal() || 0;

    const elements = {
      subtotal: document.getElementById('panelSubtotal'),
      total: document.getElementById('panelTotal')
    };

    if (elements.subtotal) elements.subtotal.textContent = formatearMoneda(total);
    if (elements.total) elements.total.textContent = formatearMoneda(total);
  }
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

const carrito = new CarritoCompras();

function abrirCarrito() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.add('active');
  if (overlay) overlay.classList.add('active');
  carrito.renderizarPanel();
}

function cerrarCarrito() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function procesarPago() {
  if (carrito.items.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  const total = carrito.obtenerTotal() || 0;
  alert('Gracias por tu compra! 🎉\n\nTotal: ' + formatearMoneda(total));
  carrito.vaciarCarrito();
  cerrarCarrito();
}

function inicializarCarrito() {
  const badge = document.getElementById('cart-badge');
  const botonCarrito = document.getElementById('btn-cart');
  const closeBtn = document.getElementById('cartCloseBtn');
  const overlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (badge) carrito.actualizarBadge();

  if (botonCarrito) {
    botonCarrito.onclick = abrirCarrito;
  }

  if (closeBtn) {
    closeBtn.onclick = cerrarCarrito;
  }

  if (overlay) {
    overlay.onclick = cerrarCarrito;
  }

  if (checkoutBtn) {
    checkoutBtn.onclick = procesarPago;
  }
}
