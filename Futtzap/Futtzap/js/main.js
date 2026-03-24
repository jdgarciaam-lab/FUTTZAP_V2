/**
 * main.js – Lógica principal de la aplicación Futtzap
 * Carga fragmentos, productos con fetch y renderiza con template + Web Component
 */

// ── Protección de ruta ──────────────────────────────────────
// Redirige al login si no hay sesión activa
if (!sessionStorage.getItem('sesionActiva')) {
  window.location.href = 'login.html';
}

// ── Cargar fragmentos HTML de manera dinámica ────────────────

/**
 * Carga un fragmento HTML desde un archivo y lo inserta en el contenedor indicado.
 * @param {string} url - Ruta del fragmento HTML.
 * @param {string} containerId - ID del elemento donde se insertará.
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

// ── Cargar productos desde JSON con Fetch ────────────────────

/**
 * Obtiene los productos desde el archivo products.json.
 * @returns {Promise<Array>} - Lista de productos.
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

// ── Renderizar productos con <template> ──────────────────────

/**
 * Renderiza los primeros productos usando la etiqueta <template> del HTML.
 * @param {Array} productos - Lista de productos a mostrar.
 */
function renderizarConTemplate(productos) {
  const grid     = document.getElementById('productsGrid');
  const template = document.getElementById('product-template');

  // Mostrar los primeros 3 con <template>
  productos.slice(0, 3).forEach(function (producto) {
    const clon = template.content.cloneNode(true);

    clon.querySelector('.product-emoji').textContent  = producto.emoji;
    clon.querySelector('.product-name').textContent   = producto.nombre;
    clon.querySelector('.product-desc').textContent   = producto.descripcion;
    clon.querySelector('.product-price').textContent  = producto.precio;

    grid.appendChild(clon);
  });
}

// ── Renderizar productos con Web Component ───────────────────

/**
 * Renderiza los productos restantes usando el Web Component <product-card>.
 * @param {Array} productos - Lista de productos a mostrar.
 */
function renderizarConWebComponent(productos) {
  const grid = document.getElementById('productsGrid');

  // Los últimos 3 con Web Component
  productos.slice(3).forEach(function (producto) {
    const tarjeta = document.createElement('product-card');
    tarjeta.setAttribute('nombre',      producto.nombre);
    tarjeta.setAttribute('precio',      producto.precio);
    tarjeta.setAttribute('descripcion', producto.descripcion);
    tarjeta.setAttribute('emoji',       producto.emoji);
    grid.appendChild(tarjeta);
  });
}

// ── Función de cerrar sesión ─────────────────────────────────

/**
 * Elimina la sesión del usuario y redirige al login.
 */
function cerrarSesion() {
  sessionStorage.removeItem('sesionActiva');
  window.location.href = 'login.html';
}

// ── Inicialización principal ─────────────────────────────────

/**
 * Inicializa la aplicación: carga fragmentos y productos.
 */
async function inicializar() {
  // Cargar fragmentos HTML
  await cargarFragmento('components/header.html',  'header-container');
  await cargarFragmento('components/sidebar.html', 'sidebar-container');
  await cargarFragmento('components/footer.html',  'footer-container');

  // Obtener productos desde JSON
  const productos = await obtenerProductos();

  // Renderizar con <template> (primeros 3)
  renderizarConTemplate(productos);

  // Renderizar con Web Component (últimos 3)
  renderizarConWebComponent(productos);
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', inicializar);
