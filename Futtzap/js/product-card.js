/**
 * product-card.js – Web Component personalizado para tarjetas de producto
 * Encapsula estructura y estilos con Shadow DOM.
 * Atributos: nombre, precio, descripcion, imagen
 */

class ProductCard extends HTMLElement {
  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'imagen'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const nombre      = this.getAttribute('nombre')      || 'Producto';
    const precio      = this.getAttribute('precio')      || '$0';
    const descripcion = this.getAttribute('descripcion') || '';
    const imagen      = this.getAttribute('imagen')      || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Rajdhani', 'Segoe UI', sans-serif; }

        .wc-card {
          background: #13131a;
          border: 1px solid #2a2a3d;
          border-radius: 8px;
          overflow: hidden;
          transition: transform .25s, border-color .25s, box-shadow .25s;
        }
        .wc-card:hover {
          transform: translateY(-4px);
          border-color: #00e676;
          box-shadow: 0 8px 32px rgba(0,230,118,0.12);
        }

        .wc-img-wrap {
          position: relative;
          background: #1c1c28;
          height: 200px;
          overflow: hidden;
        }
        .wc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .wc-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #7c4dff;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .wc-body { padding: 16px; }

        .wc-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e8e8f0;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .wc-desc {
          font-size: 0.88rem;
          color: #7a7a9a;
          margin-bottom: 14px;
          line-height: 1.5;
        }
        .wc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wc-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #00e676;
        }
        .wc-btn {
          background: #00e676;
          color: #000;
          border: none;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 7px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background .2s;
        }
        .wc-btn:hover { background: #00b85c; }
      </style>

      <div class="wc-card">
        <div class="wc-img-wrap">
          <img class="wc-img" src="${imagen}" alt="${nombre}"/>
          <span class="wc-badge">WEB COMP</span>
        </div>
        <div class="wc-body">
          <div class="wc-name">${nombre}</div>
          <div class="wc-desc">${descripcion}</div>
          <div class="wc-footer">
            <span class="wc-price">${precio}</span>
            <button class="wc-btn">Ver más ⚡</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
