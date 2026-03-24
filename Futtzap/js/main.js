/**
 * main.js – Lógica principal de la aplicación Futtzap
 * Carga fragmentos, productos con fetch, filtra por categoría,
 * renderiza con <template> y Web Component.
 */

// ── Protección de ruta ──────────────────────────────────────
if (!sessionStorage.getItem('sesionActiva')) {
  window.location.href = 'login.html';
}

// Guarda todos los productos en memoria para filtrar sin re-fetch
let todosLosProductos = [];

// ── Cargar fragmento HTML dinámicamente ──────────────────────
/**
 * Inserta el contenido de un archivo HTML en el contenedor indicado.
 * @param {string} url - Ruta del fragmento.
 * @param {string} containerId - ID del elemento destino.
 */
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

// ── Obtener productos desde JSON ─────────────────────────────
/**
 * Carga los productos desde data/products.json usando Fetch API.
 * @returns {Promise<Array>} Lista de productos.
 */
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

// ── Renderizar productos con <template> (primeros 5) ─────────
/**
 * Clona la plantilla <template> del HTML para cada producto.
 * @param {Array} productos - Lista de productos a mostrar.
 */
function renderizarConTemplate(productos) {
  const grid     = document.getElementById('productsGrid');
  const template = document.getElementById('product-template');

  productos.forEach(function (producto) {
    const clon = template.content.cloneNode(true);

    const imgEl = clon.querySelector('.product-img');
    imgEl.src = producto.imagen;
    imgEl.alt = producto.nombre;

    clon.querySelector('.product-name').textContent  = producto.nombre;
    clon.querySelector('.product-desc').textContent  = producto.descripcion;
    clon.querySelector('.product-price').textContent = producto.precio;

    grid.appendChild(clon);
  });
}

// ── Renderizar productos con Web Component (últimos 4) ───────
/**
 * Crea elementos <product-card> y les asigna atributos.
 * @param {Array} productos - Lista de productos a mostrar.
 */
function renderizarConWebComponent(productos) {
  const grid = document.getElementById('productsGrid');

  productos.forEach(function (producto) {
    const tarjeta = document.createElement('product-card');
    tarjeta.setAttribute('nombre',      producto.nombre);
    tarjeta.setAttribute('precio',      producto.precio);
    tarjeta.setAttribute('descripcion', producto.descripcion);
    tarjeta.setAttribute('imagen',      producto.imagen);
    grid.appendChild(tarjeta);
  });
}

// ── Mostrar productos según categoría seleccionada ───────────
/**
 * Filtra los productos por categoría y los renderiza.
 * @param {string} categoria - 'todo' | 'cesped' | 'sintetico' | 'microfutbol'
 */
function mostrarProductos(categoria) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = ''; // limpiar grilla

  const filtrados = categoria === 'todo'
    ? todosLosProductos
    : todosLosProductos.filter(function (p) { return p.categoria === categoria; });

  // Primeros 5 con <template>, resto con Web Component
  const conTemplate      = filtrados.slice(0, 5);
  const conWebComponent  = filtrados.slice(5);

  renderizarConTemplate(conTemplate);
  renderizarConWebComponent(conWebComponent);
}

// ── Activar filtro al hacer clic en el sidebar ───────────────
/**
 * Configura los listeners de las categorías del sidebar.
 * Se llama después de cargar el fragmento sidebar.html.
 */
function configurarFiltros() {
  const links = document.querySelectorAll('.sidebar-link[data-cat]');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      // Quitar clase activa de todos
      links.forEach(function (l) { l.classList.remove('active'); });
      // Activar el seleccionado
      link.classList.add('active');
      // Mostrar productos de esa categoría
      mostrarProductos(link.getAttribute('data-cat'));
    });
  });
}

// ── Cerrar sesión ────────────────────────────────────────────
/**
 * Elimina la sesión y redirige al login.
 */
function cerrarSesion() {
  sessionStorage.removeItem('sesionActiva');
  window.location.href = 'login.html';
}

// ── Inicialización ───────────────────────────────────────────
async function inicializar() {
  // Cargar fragmentos dinámicos
  await cargarFragmento('components/header.html',  'header-container');
  await cargarFragmento('components/sidebar.html', 'sidebar-container');
  await cargarFragmento('components/footer.html',  'footer-container');

  // Configurar filtros del sidebar (después de cargarlo)
  configurarFiltros();

  // Cargar productos desde JSON
  todosLosProductos = await obtenerProductos();

  // Mostrar todos al inicio
  mostrarProductos('todo');
}

document.addEventListener('DOMContentLoaded', inicializar);
