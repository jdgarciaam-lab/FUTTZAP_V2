/**
 * main.js – Lógica principal Futtzap
 */

if (!sessionStorage.getItem('sesionActiva')) {
  window.location.href = 'login.html';
}

let todosLosProductos = [];

function configurarBotonesDeTienda() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  grid.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add') && e.target.closest('.product-card')) {
      const card = e.target.closest('.product-card');
      const nombre = card.querySelector('.product-name')?.textContent || '';
      const precio = card.querySelector('.product-price')?.textContent || '$0';
      const imagen = card.querySelector('.product-img')?.src || '';
      const descripcion = card.querySelector('.product-desc')?.textContent || '';
      
      const producto = todosLosProductos.find(p => p.nombre === nombre);
      if (carrito) {
        carrito.agregarProducto({
          id: producto ? producto.id : Date.now(),
          nombre,
          precio,
          imagen,
          descripcion
        });
        abrirCarrito();
      }
    }
  });

  grid.addEventListener('agregar-producto', function(e) {
    const { nombre, precio, imagen, descripcion } = e.detail;
    const producto = todosLosProductos.find(p => p.nombre === nombre);
    if (carrito) {
      carrito.agregarProducto({
        id: producto ? producto.id : Date.now(),
        nombre,
        precio,
        imagen,
        descripcion
      });
      abrirCarrito();
    }
  });
}

async function cargarFragmento(url, containerId) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error al cargar ${url}`);
    const html = await respuesta.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error('Error cargando fragmento:', error);
  }
}

async function obtenerProductos() {
  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar products.json');
    return await respuesta.json();
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

function renderizarConTemplate(productos) {
  const grid = document.getElementById('productsGrid');
  const template = document.getElementById('product-template');

  productos.forEach(function (producto) {
    const clon = template.content.cloneNode(true);
    const card = clon.querySelector('.product-card');
    card.dataset.productId = producto.id;

    const imgEl = clon.querySelector('.product-img');
    imgEl.src = producto.imagen;
    imgEl.alt = producto.nombre;

    clon.querySelector('.product-name').textContent = producto.nombre;
    clon.querySelector('.product-desc').textContent = producto.descripcion;
    clon.querySelector('.product-price').textContent = producto.precio;

    grid.appendChild(clon);
  });
}

function renderizarConWebComponent(productos) {
  const grid = document.getElementById('productsGrid');
  productos.forEach(function (producto) {
    const tarjeta = document.createElement('product-card');
    tarjeta.setAttribute('nombre', producto.nombre);
    tarjeta.setAttribute('precio', producto.precio);
    tarjeta.setAttribute('descripcion', producto.descripcion);
    tarjeta.setAttribute('imagen', producto.imagen);
    grid.appendChild(tarjeta);
  });
}

function mostrarProductos(categoria) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const filtrados = categoria === 'todo'
    ? todosLosProductos
    : todosLosProductos.filter(function (p) { return p.categoria === categoria; });

  const conTemplate = filtrados.slice(0, 5);
  const conWebComponent = filtrados.slice(5);

  renderizarConTemplate(conTemplate);
  renderizarConWebComponent(conWebComponent);
}

function configurarFiltros() {
  const links = document.querySelectorAll('.sidebar-link[data-cat]');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      links.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      mostrarProductos(link.getAttribute('data-cat'));
    });
  });
}

function cerrarSesion() {
  sessionStorage.removeItem('sesionActiva');
  window.location.href = 'login.html';
}

async function inicializar() {
  await cargarFragmento('components/header.html', 'header-container');
  
  setTimeout(() => {
    if (typeof inicializarCarrito === 'function') {
      inicializarCarrito();
    }
  }, 50);
  
  await cargarFragmento('components/sidebar.html', 'sidebar-container');
  await cargarFragmento('components/footer.html', 'footer-container');

  configurarFiltros();
  todosLosProductos = await obtenerProductos();
  mostrarProductos('todo');
  configurarBotonesDeTienda();
}

document.addEventListener('DOMContentLoaded', inicializar);
