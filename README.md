# ⚽ Futtzap – Tienda de Zapatillas de Fútbol

Proyecto web modularizado desarrollado como actividad académica para la asignatura de **Desarrollo Web**.

---

## 📁 Estructura del proyecto

```
├── components/
│   ├── header.html         # Fragmento de encabezado (con botón carrito)
│   ├── sidebar.html        # Fragmento de barra lateral
│   └── footer.html         # Fragmento de pie de página
├── css/
│   ├── styles.css          # Estilos globales (variables CSS, paleta de colores)
│   └── login.css           # Estilos específicos del login
├── data/
│   └── products.json       # Datos de productos en COP (moneda colombiana)
├── img/
│   └── productos.png       # Imágenes de productos
├── js/
│   ├── login.js            # Lógica de autenticación
│   ├── main.js             # Lógica principal (fragmentos, fetch, template, eventos)
│   ├── product-card.js     # Web Component personalizado <product-card>
│   └── cart.js             # 🛒 Lógica del carrito de compras
├── index.html              # Página principal de la tienda
├── login.html              # Página de inicio de sesión
└── README.md
```

---

## 🧩 ¿Qué es la modularización y por qué es importante?

La **modularización** en desarrollo web es la práctica de dividir una aplicación en partes pequeñas, independientes y reutilizables (módulos), en lugar de concentrar todo el código en un solo archivo.

### Ventajas:
- **Mantenimiento más sencillo**: si hay un error en el header, solo se edita `header.html`.
- **Reutilización de código**: el mismo fragmento se puede usar en múltiples páginas.
- **Trabajo en equipo**: diferentes integrantes pueden trabajar en distintos módulos sin conflictos.
- **Escalabilidad**: agregar nuevas funcionalidades no implica modificar todo el proyecto.

---

## 🔐 Formulario de inicio de sesión

El login valida las credenciales directamente en JavaScript:

```javascript
const USUARIO_VALIDO    = 'futtzap';
const CONTRASENA_VALIDA = '1234';
```

Si las credenciales coinciden, se guarda una sesión simulada en `sessionStorage` y se redirige a `index.html`. En caso contrario, se muestra un mensaje de error.

> ⚠️ **Aviso importante**: Este método de autenticación es **solo con fines educativos**. Almacenar credenciales en el código JavaScript del cliente **no es seguro** en aplicaciones reales. En producción, la autenticación debe realizarse en el servidor con contraseñas encriptadas y tokens seguros.

---

## 🧱 Fragmentos reutilizables

Los fragmentos son archivos HTML independientes que representan secciones comunes de la interfaz:

| Fragmento          | Archivo                    | Descripción                            |
|--------------------|----------------------------|----------------------------------------|
| Encabezado         | `components/header.html`   | Nombre del negocio y navegación        |
| Barra lateral      | `components/sidebar.html`  | Menú con categorías y marcas           |
| Pie de página      | `components/footer.html`   | Derechos reservados                    |

Se cargan dinámicamente con JavaScript usando `fetch`:

```javascript
async function cargarFragmento(url, containerId) {
  const respuesta = await fetch(url);
  const html = await respuesta.text();
  document.getElementById(containerId).innerHTML = html;
}
```

---

## 📋 Plantillas con `<template>`

La etiqueta HTML `<template>` define bloques de código que **no se renderizan hasta que JavaScript los clona y los inserta**.

En `index.html` se define la plantilla de producto:

```html
<template id="product-template">
  <div class="product-card"> ... </div>
</template>
```

Y en `main.js` se clonan dinámicamente:

```javascript
const clon = template.content.cloneNode(true);
// Se modifican los datos del clon
grid.appendChild(clon);
```

---

## 📦 Datos externos con Fetch API y formato COP

Los productos se almacenan en `data/products.json` y se cargan dinámicamente. **Todos los precios están en Pesos Colombianos (COP)**:

```json
{
  "id": 1,
  "nombre": "Nike Mercurial Vapor",
  "precio": "$580.000",
  "descripcion": "Botines ultraligeros para velocidad",
  "categoria": "botines",
  "marca": "Nike"
}
```

Se cargan con `fetch`:

```javascript
async function obtenerProductos() {
  const respuesta = await fetch('data/products.json');
  return await respuesta.json();
}
```

El formato `$580.000` (usado en Colombia) se convierte a número para cálculos:

```javascript
// Entrada: "$580.000"
const numero = limpiarPrecio("$580.000"); // → 580000
// Salida: "$580.000"
const formatted = formatearMoneda(580000);  // → Format de moneda
```

Esto reemplaza el uso de arrays estáticos, separando **datos** de **lógica**.

---

## 🧬 Web Components y Componentes personalizados

### Product Card (`<product-card>`)

Se creó el componente personalizado `<product-card>` en `js/product-card.js`, que:

- Extiende `HTMLElement` para crear un elemento HTML personalizado.
- Usa **Shadow DOM** para encapsular su estructura y estilos, evitando conflictos CSS.
- Recibe atributos: `nombre`, `precio`, `descripcion`, `emoji`.
- Emite evento personalizado `agregar-producto` cuando se hace clic en el botón.

```javascript
class ProductCard extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    // Crear estructura interna con Shadow DOM
  }
}
customElements.define('product-card', ProductCard);
```

Uso en JavaScript:

```javascript
const tarjeta = document.createElement('product-card');
tarjeta.setAttribute('nombre', 'Nike Mercurial');
tarjeta.setAttribute('precio', '$580.000');
document.body.appendChild(tarjeta);
```

**Ventaja**: El componente es **reutilizable, independiente y sus estilos no interfieren** con el resto del sitio.

---

## 🛒 Carrito de Compras

El carrito es un **panel deslizable** ubicado en la esquina superior derecha que permite:

- ✅ Agregar/eliminar productos sin abandonar la tienda
- ✅ Actualizar cantidades de artículos
- ✅ Visualizar precios en **moneda colombiana (COP)**
- ✅ Persistencia con `localStorage` (los productos se guardan entre sesiones)

### Arquitectura del carrito

#### 1. **Clase `CarritoCompras`** (js/cart.js)

Gestiona toda la lógica del carrito:

```javascript
class CarritoCompras {
  constructor() {
    this.items = [];
    this.cargarLocal();
  }
  
  agregarProducto(id, nombre, precio) {
    // Suma a existente o agrega nuevo
  }
  
  obtenerTotal() {
    // Calcula el total sin envío
  }
}
```

#### 2. **Panel lateral con CSS**

El carrito se muestra como un panel que **se desliza desde la derecha** en `index.html`:

```html
<div id="cartPanel" class="cart-panel">
  <div class="cart-header">Carrito</div>
  <div id="cartPanelItems"></div>
  <div class="cart-footer">Total: $0</div>
</div>
```

Se controla con JavaScript:
- `abrirCarrito()` – Muestra el panel con transición suave
- `cerrarCarrito()` – Oculta el panel

#### 3. **Integración con productos**

Cuando se hace clic en "Agregar al carrito" en cualquier producto:

```javascript
// En main.js
carrito.agregarProducto(id, nombre, limpiarPrecio(precio));
abrirCarrito(); // Abre el panel automáticamente
```

### Formato de moneda: COP (Pesos Colombianos)

Los precios se almacenan en `data/products.json` en formato colombiano: `$580.000`

#### Parsing (entrada → número):

```javascript
function limpiarPrecio(precioString) {
  // "$580.000" → "580000" (número)
  return parseFloat(precioString.replace('$', '').replace(/\./g, ''));
}
```

#### Formateo (número → salida):

```javascript
function formatearMoneda(numero) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(numero);
}
// 580000 → "$580.000"
```

### Persistencia con localStorage

El carrito se guarda automáticamente:

```javascript
this.guardarLocal();    // Guarda items en localStorage
this.cargarLocal();     // Los recupera al recargar la página
```

Esto asegura que los productos en el carrito **persistan entre sesiones del navegador**.

---

## ✅ Patrones de arquitectura aplicados

| Patrón                       | Archivo                    | Descripción                                       |
|------------------------------|----------------------------|---------------------------------------------------|
| **Modularización**           | `components/*.html`        | Fragmentos HTML reutilizables (header, sidebar)  |
| **Plantillas dinámicas**     | `index.html` + `main.js`   | `<template>` clonado para renderizar productos   |
| **Web Components**           | `js/product-card.js`       | Componente `<product-card>` con Shadow DOM       |
| **MVC (lógica/vista)**       | `js/cart.js`               | Clase `CarritoCompras` + `renderizarPanel()`     |
| **Persistencia de datos**    | `localStorage` + `cart.js` | Guarda carrito entre sesiones                    |
| **Eventos personalizados**   | `product-card.js`          | Evento `agregar-producto` comunica con main.js   |
| **Fetch API**                | `main.js`                  | Carga fragmentos HTML y datos JSON remotamente   |

---

## 📝 Buenas prácticas en el código

| Práctica                     | Aplicación en el proyecto                                     |
|------------------------------|---------------------------------------------------------------|
| `camelCase` en JS            | `cargarFragmento`, `obtenerProductos`, `limpiarPrecio`       |
| `kebab-case` en CSS          | `.product-card`, `.btn-logout`, `.cart-panel`                 |
| Separación de responsabilidades | Archivos separados: `login.js`, `main.js`, `product-card.js`, `cart.js` |
| Comentarios en el código     | Funciones documentadas y código legible                       |
| Indentación consistente      | 2 espacios en todo el proyecto                                |
| Variables CSS                | Paleta de colores centralizada en `:root` (temas oscuros)    |
| Manejo de errores            | Try-catch en Fetch, validaciones de entrada                  |

---

## 👥 Integrantes del grupo

| Nombre | GitHub |
|--------|--------|
| Estudiante 1 | @usuario1 |
| Estudiante 2 | @usuario2 |

---

## 🚀 Cómo ejecutar el proyecto

> El proyecto usa `fetch` para cargar fragmentos y JSON, por lo que **no puede abrirse directamente con doble clic** en el navegador (restricciones CORS). Se necesita un servidor local:

**Opción 1 – VS Code Live Server:**
Instalar la extensión "Live Server" y hacer clic en "Go Live".

**Opción 2 – Python:**
```bash
python -m http.server 5500
```
Luego abrir `http://localhost:5500/login.html`

**Credenciales de prueba:**
- Usuario: `futtzap`
- Contraseña: `1234`
