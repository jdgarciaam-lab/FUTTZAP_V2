class ProductCard extends HTMLElement {
  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'imagen'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { 
    this.render(); 
  }

  attributeChangedCallback() { 
    this.render(); 
  }

  render() {
    const nombre = this.getAttribute('nombre') || 'Producto';
    const precio = this.getAttribute('precio') || '$0';
    const descripcion = this.getAttribute('descripcion') || '';
    const imagen = this.getAttribute('imagen') || '';

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
        }

        .wc-body { 
          padding: 16px; 
        }

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
        
        .btn-add {
          background: transparent;
          border: 1px solid var(--color-accent, #00e676);
          color: var(--color-accent, #00e676);
          font-family: var(--font-body, Arial, sans-serif);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 6px 14px;
          border-radius: var(--radius, 4px);
          cursor: pointer;
          transition: background .2s, color .2s;
        }
        
        .btn-add:hover {
          background: var(--color-accent, #00e676);
          color: #000;
        }
      </style>

      <div class="wc-card">
        <div class="wc-img-wrap">
          <img class="wc-img" src="${imagen}" alt="${nombre}"/>
        </div>
        <div class="wc-body">
          <div class="wc-name">${nombre}</div>
          <div class="wc-desc">${descripcion}</div>
          <div class="wc-footer">
            <span class="wc-price">${precio}</span>
            <button class="btn-add">Agregar ⚡</button>
          </div>
        </div>
      </div>
    `;

    const btn = this.shadowRoot.querySelector('.btn-add');
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('agregar-producto', {
          detail: { nombre, precio, descripcion, imagen },
          bubbles: true,
          composed: true
        }));
      };
    }
  }
}

customElements.define('product-card', ProductCard);
