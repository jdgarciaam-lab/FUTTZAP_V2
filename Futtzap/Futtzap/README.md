# ⚽ Futtzap – Tienda de Zapatillas de Fútbol

Proyecto web modularizado desarrollado como actividad académica para la asignatura de **Desarrollo Web**.

---

## 📁 Estructura del proyecto

```
Futtzap/
├── login.html              # Página de inicio de sesión
├── index.html              # Página principal de la tienda
├── css/
│   ├── styles.css          # Estilos globales
│   └── login.css           # Estilos específicos del login
├── js/
│   ├── login.js            # Lógica de autenticación
│   ├── main.js             # Lógica principal (fragmentos, fetch, template)
│   └── product-card.js     # Web Component personalizado
├── components/
│   ├── header.html         # Fragmento de encabezado
│   ├── sidebar.html        # Fragmento de barra lateral
│   └── footer.html         # Fragmento de pie de página
├── data/
│   └── products.json       # Datos de productos (usado con Fetch API)
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

## 📦 Datos externos con Fetch API

Los productos se almacenan en `data/products.json` y se cargan dinámicamente:

```javascript
async function obtenerProductos() {
  const respuesta = await fetch('data/products.json');
  return await respuesta.json();
}
```

Esto reemplaza el uso de arrays estáticos en el código, separando los **datos** de la **lógica**.

---

## 🧬 Web Components

Se creó el componente personalizado `<product-card>` en `js/product-card.js`, que:

- Extiende `HTMLElement`.
- Usa **Shadow DOM** para encapsular su estructura y estilos.
- Recibe atributos: `nombre`, `precio`, `descripcion`, `emoji`.

```javascript
class ProductCard extends HTMLElement {
  attachShadow({ mode: 'open' });
  // ...
}
customElements.define('product-card', ProductCard);
```

Uso en HTML o JS:

```javascript
const tarjeta = document.createElement('product-card');
tarjeta.setAttribute('nombre', 'Nike Mercurial');
```

---

## ✅ Buenas prácticas aplicadas

| Práctica                     | Aplicación en el proyecto                                   |
|------------------------------|-------------------------------------------------------------|
| `camelCase` en JS            | `cargarFragmento`, `obtenerProductos`, `renderizarConTemplate` |
| `kebab-case` en CSS          | `.product-card`, `.btn-logout`, `.sidebar-link`             |
| Separación de responsabilidades | Archivos separados: `login.js`, `main.js`, `product-card.js` |
| Comentarios en el código     | Todas las funciones documentadas con JSDoc                  |
| Indentación consistente      | 2 espacios en todo el proyecto                              |
| Variables CSS                | Paleta de colores centralizada en `:root`                   |

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
