/* ========================================
   TACO HOME - JAVASCRIPT MODULAR MODERNO
   Sistema completo con carrito de compras
   ======================================== */

// ==================== UTILIDADES ====================
const Utils = {
  // Seleccionar elemento
  $(selector) {
    return document.querySelector(selector);
  },

  // Seleccionar múltiples elementos
  $$(selector) {
    return document.querySelectorAll(selector);
  },

  // Agregar evento
  on(element, event, handler) {
    if (element) {
      element.addEventListener(event, handler);
    }
  },

  // Agregar evento a múltiples elementos
  onAll(elements, event, handler) {
    elements.forEach(el => this.on(el, event, handler));
  },

  // Formatear precio
  formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Animación suave de scroll
  smoothScroll(target, offset = 80) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  // Debounce
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ==================== SISTEMA DE CARRITO ====================
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartUI();
    this.attachEventListeners();
  }

  // Cargar carrito desde localStorage
  loadCart() {
    const cart = localStorage.getItem('tacoHomeCart');
    return cart ? JSON.parse(cart) : [];
  }

  // Guardar carrito en localStorage
  saveCart() {
    localStorage.setItem('tacoHomeCart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  // Agregar producto al carrito
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    this.saveCart();
    this.showNotification(`${product.name} añadido al carrito`, 'success');
    this.animateCartIcon();
  }

  // Remover producto del carrito
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.showNotification('Producto eliminado del carrito', 'info');
  }

  // Actualizar cantidad
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  // Limpiar carrito
  clearCart() {
    this.items = [];
    this.saveCart();
    this.showNotification('Carrito vaciado', 'info');
  }

  // Calcular total
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Obtener cantidad de items
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Actualizar UI del carrito
  updateCartUI() {
    const cartCount = Utils.$('.cart-count');
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Animar icono del carrito
  animateCartIcon() {
    const cartBtn = Utils.$('.cart-btn');
    if (cartBtn) {
      cartBtn.classList.add('cart-bounce');
      setTimeout(() => cartBtn.classList.remove('cart-bounce'), 600);
    }
  }

  // Mostrar notificación
  showNotification(message, type = 'success') {
    ToastNotification.show(message, type);
  }

  // Adjuntar event listeners
  attachEventListeners() {
    // Botones de agregar al carrito
    Utils.onAll(Utils.$$('.add-to-cart'), 'click', (e) => {
      const btn = e.currentTarget;
      const productCard = btn.closest('.product-card') || btn.closest('[data-product-id]');

      if (productCard) {
        const product = {
          id: btn.dataset.productId || Utils.generateId(),
          name: productCard.querySelector('.product-name')?.textContent || 'Producto',
          price: this.extractPrice(productCard),
          image: productCard.querySelector('.product-image img')?.src || ''
        };

        this.addItem(product);
        this.animateAddToCart(btn);
      }
    });

    // Click en el carrito
    Utils.on(Utils.$('.cart-btn'), 'click', () => {
      this.openCartModal();
    });
  }

  // Extraer precio del DOM
  extractPrice(element) {
    const priceElement = element.querySelector('.product-price, .modal-price');
    if (priceElement) {
      const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
      return parseFloat(priceText) || 0;
    }
    return 0;
  }

  // Animar botón al agregar
  animateAddToCart(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
    btn.disabled = true;
    btn.style.background = 'var(--success)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.background = '';
    }, 2000);
  }

  // Abrir modal del carrito
  openCartModal() {
    const modal = this.createCartModal();
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
  }

  // Crear modal del carrito
  createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal cart-modal active';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-shopping-cart"></i> Tu Carrito</h2>
          <button class="modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          ${this.items.length > 0 ? this.renderCartItems() : this.renderEmptyCart()}
        </div>
        ${this.items.length > 0 ? this.renderCartFooter() : ''}
      </div>
    `;

    // Event listeners del modal
    Utils.on(modal.querySelector('.modal-overlay'), 'click', () => this.closeCartModal(modal));
    Utils.on(modal.querySelector('.modal-close'), 'click', () => this.closeCartModal(modal));

    if (this.items.length > 0) {
      Utils.on(modal.querySelector('.clear-cart'), 'click', () => {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
          this.clearCart();
          this.closeCartModal(modal);
        }
      });

      Utils.on(modal.querySelector('.checkout-btn'), 'click', () => {
        this.showNotification('Función de checkout en desarrollo', 'info');
      });
    }

    return modal;
  }

  // Renderizar items del carrito
  renderCartItems() {
    return `
      <div class="cart-items">
        ${this.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                <i class="fas fa-minus"></i>
              </button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="qty-btn" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-item-btn" onclick="window.cart.removeItem('${item.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderizar carrito vacío
  renderEmptyCart() {
    return `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega algunos deliciosos productos de nuestro menú</p>
        <a href="/menu/" class="btn btn-primary">Ver Menú</a>
      </div>
    `;
  }

  // Renderizar footer del carrito
  renderCartFooter() {
    return `
      <div class="modal-footer cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount">${Utils.formatPrice(this.getTotal())}</span>
        </div>
        <div class="cart-actions">
          <button class="btn btn-outline clear-cart">Vaciar Carrito</button>
          <button class="btn btn-primary checkout-btn">
            <i class="fas fa-check"></i> Proceder al Pago
          </button>
        </div>
      </div>
    `;
  }

  // Cerrar modal del carrito
  closeCartModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// ==================== SISTEMA DE NOTIFICACIONES TOAST ====================
const ToastNotification = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    }[type] || 'info-circle';

    toast.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ==================== SISTEMA DE MODALES ====================
class ModalSystem {
  static openModal(modalId) {
    const modal = Utils.$(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => modal.classList.add('active'), 10);
    }
  }

  static closeModal(modalId) {
    const modal = typeof modalId === 'string' ? Utils.$(modalId) : modalId;
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }

  static init() {
    // Cerrar modal al hacer clic en overlay
    Utils.onAll(Utils.$$('.modal-overlay'), 'click', (e) => {
      const modal = e.target.closest('.modal');
      this.closeModal(modal);
    });

    // Cerrar modal con botón close
    Utils.onAll(Utils.$$('.modal-close'), 'click', (e) => {
      const modal = e.target.closest('.modal');
      this.closeModal(modal);
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = Utils.$('.modal.active');
        if (openModal) this.closeModal(openModal);
      }
    });
  }
}

// Funciones globales para modales (para compatibilidad con HTML)
window.openModal = (id) => ModalSystem.openModal(id);
window.closeModal = (id) => ModalSystem.closeModal(id);

// ==================== HEADER SCROLL ====================
class HeaderManager {
  constructor() {
    this.header = Utils.$('.header');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener('scroll', Utils.debounce(() => {
      this.handleScroll();
    }, 100));
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;

    // Agregar clase scrolled
    if (currentScroll > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Ocultar/mostrar header al hacer scroll
    if (currentScroll > this.lastScroll && currentScroll > 200) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }

    this.lastScroll = currentScroll;
  }
}

// ==================== MENÚ MÓVIL ====================
class MobileMenu {
  constructor() {
    this.menuBtn = Utils.$('#menu-btn, .menu-toggle');
    this.navbar = Utils.$('.navbar');
    this.init();
  }

  init() {
    if (!this.menuBtn || !this.navbar) return;

    Utils.on(this.menuBtn, 'click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Cerrar al hacer clic en un enlace
    Utils.onAll(this.navbar.querySelectorAll('a'), 'click', () => {
      this.close();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && !this.menuBtn.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.navbar.classList.toggle('active');
    this.menuBtn.classList.toggle('active');

    const icon = this.menuBtn.querySelector('i');
    if (icon) {
      icon.className = this.navbar.classList.contains('active') ?
        'fas fa-times' : 'fas fa-bars';
    }
  }

  close() {
    this.navbar.classList.remove('active');
    this.menuBtn.classList.remove('active');

    const icon = this.menuBtn.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
  }
}

// ==================== SISTEMA DE MENSAJES ====================
class AlertSystem {
  static init() {
    const alerts = Utils.$$('.alert');

    alerts.forEach((alert, index) => {
      // Animación escalonada
      alert.style.animationDelay = `${index * 0.1}s`;

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        this.closeAlert(alert);
      }, 5000);

      // Botón de cerrar
      const closeBtn = alert.querySelector('.close');
      if (closeBtn) {
        Utils.on(closeBtn, 'click', () => this.closeAlert(alert));
      }
    });
  }

  static closeAlert(alert) {
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => alert.remove(), 300);
  }
}

// ==================== SMOOTH SCROLL ====================
class SmoothScroll {
  static init() {
    Utils.onAll(Utils.$$('a[href^="#"]'), 'click', (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        Utils.smoothScroll(href);
      }
    });
  }
}

// ==================== VALIDACIÓN DE FORMULARIOS ====================
class FormValidator {
  static init() {
    const forms = Utils.$$('form');

    forms.forEach(form => {
      Utils.on(form, 'submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Validación en tiempo real
      const inputs = form.querySelectorAll('input, textarea');
      Utils.onAll(inputs, 'blur', (e) => {
        this.validateField(e.target);
      });
    });
  }

  static validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  static validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es requerido';
    } else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Email inválido';
    }

    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static showFieldError(field, message) {
    field.classList.toggle('is-invalid', !!message);

    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }
}

// ==================== LOADING SPINNER ====================
class LoadingManager {
  static hide() {
    const spinner = Utils.$('#loading-spinner, .loading-spinner');
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 500);
    }
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistemas
  window.cart = new ShoppingCart();
  new HeaderManager();
  new MobileMenu();

  ModalSystem.init();
  AlertSystem.init();
  SmoothScroll.init();
  FormValidator.init();

  // Ocultar loading spinner
  setTimeout(() => LoadingManager.hide(), 1000);

  // Inicializar AOS si está disponible
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }

  console.log('🌮 Taco Home - Sistema cargado correctamente');
});

// Exportar para uso global si es necesario
window.TacoHome = {
  Utils,
  ShoppingCart,
  ToastNotification,
  ModalSystem
};