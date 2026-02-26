console.log("🙏 Sitio Iglesia Sinai - Versión Mejorada cargada correctamente");

// =========================================
// CONFIGURACIÓN GENERAL
// =========================================
const config = {
  heroSlideInterval: 6000,
  noticiasSlideInterval: 5000,
  animationThreshold: 0.15
};

// =========================================
// HEADER - SCROLL & MOBILE MENU
// =========================================
const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Header transparente al hacer scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Menú hamburguesa móvil
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

// =========================================
// HERO VIDEO - Carga diferida para mejor rendimiento
// =========================================
const heroVideo = document.querySelector('.hero-video-bg');
if (heroVideo) {
  // En mobile no reproducir video para ahorrar datos y mejorar rendimiento
  if (window.matchMedia('(max-width: 768px)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
    heroVideo.load();
  } else {
    // En desktop cargar el video después de que la página esté lista
    window.addEventListener('load', () => {
      heroVideo.play().catch(() => {});
    });
  }
}

// =========================================
// CARRUSEL DE NOTICIAS
// =========================================
class NoticiasCarousel {
  constructor() {
    this.track = document.querySelector('.carousel-track');
    this.items = document.querySelectorAll('.noticia-card');
    this.prevBtn = document.querySelector('.carousel-control.prev');
    this.nextBtn = document.querySelector('.carousel-control.next');
    this.indicators = document.querySelectorAll('.carousel-indicators .indicator');
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;

    if (this.items.length > 0) {
      this.init();
    }
  }

  init() {
    // Botones
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });

    // Autoplay
    this.startAutoplay();

    // Pausar en hover
    const carousel = document.querySelector('.noticias-carousel');
    carousel?.addEventListener('mouseenter', () => this.stopAutoplay());
    carousel?.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch/Swipe support
    this.initSwipe();
  }

  goTo(index) {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.isTransitioning = true;

    // Actualizar posición
    const offset = -index * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // Actualizar indicadores
    this.indicators[this.currentIndex]?.classList.remove('active');
    this.indicators[index]?.classList.add('active');

    this.currentIndex = index;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.goTo(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.goTo(prevIndex);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), config.noticiasSlideInterval);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  initSwipe() {
    let startX = 0;
    let isDragging = false;

    this.track?.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });

    this.track?.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    });

    this.track?.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      isDragging = false;
      this.startAutoplay();
    });
  }
}

// Inicializar Carrusel de Noticias
const noticiasCarousel = new NoticiasCarousel();

// =========================================
// GALERÍA LIGHTBOX
// =========================================
class GaleriaLightbox {
  constructor() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.querySelector('.lightbox-img');
    this.closeBtn = document.querySelector('.lightbox-close');
    this.prevBtn = document.querySelector('.lightbox-prev');
    this.nextBtn = document.querySelector('.lightbox-next');
    this.galeriaItems = document.querySelectorAll('.galeria-item');
    this.currentImageIndex = 0;
    this.images = [];

    if (this.galeriaItems.length > 0) {
      this.init();
    }
  }

  init() {
    // Recopilar todas las imágenes
    this.galeriaItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.images.push({
          src: img.src,
          alt: img.alt
        });

        // Click en item para abrir lightbox
        item.addEventListener('click', () => this.open(index));
      }
    });

    // Botones de control
    this.closeBtn?.addEventListener('click', () => this.close());
    this.prevBtn?.addEventListener('click', () => this.showPrev());
    this.nextBtn?.addEventListener('click', () => this.showNext());

    // Click en fondo para cerrar
    this.lightbox?.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox?.classList.contains('active')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.showPrev();
      if (e.key === 'ArrowRight') this.showNext();
    });
  }

  open(index) {
    this.currentImageIndex = index;
    this.showImage(index);
    this.lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  showImage(index) {
    const image = this.images[index];
    if (image && this.lightboxImg) {
      this.lightboxImg.src = image.src;
      this.lightboxImg.alt = image.alt;
    }
  }

  showNext() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.showImage(this.currentImageIndex);
  }

  showPrev() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.showImage(this.currentImageIndex);
  }
}

// Inicializar Lightbox
const galeriaLightbox = new GaleriaLightbox();

// =========================================
// ANIMACIONES FADE-IN AL SCROLL
// =========================================
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in');
    this.observer = null;

    if (this.elements.length > 0) {
      this.init();
    }
  }

  init() {
    const options = {
      threshold: config.animationThreshold,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opcional: dejar de observar después de animar
          // this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }
}

// Inicializar animaciones de scroll
const scrollAnimations = new ScrollAnimations();

// =========================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Ignorar enlaces que solo son "#"
    if (href === '#' || href === '#ministerios') {
      return;
    }

    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// =========================================
// LAZY LOADING PARA IMÁGENES
// =========================================
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback para navegadores que no soportan lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
  document.body.appendChild(script);
  
  script.onload = () => {
    const observer = lozad();
    observer.observe();
  };
}

// =========================================
// PERFORMANCE: REDUCIR ANIMACIONES EN MOTION REDUCED
// =========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Deshabilitar autoplay si el usuario prefiere menos animaciones
  noticiasCarousel.stopAutoplay();
}

// =========================================
// GALERÍA CARRUSEL (INDEX + MINISTERIOS)
// =========================================
class GaleriaCarousel {
  constructor(carouselEl, dotsEl) {
    this.carousel = carouselEl;
    this.track = carouselEl.querySelector('.galeria-track');
    this.slides = carouselEl.querySelectorAll('.galeria-slide');
    this.prevBtn = carouselEl.querySelector('.galeria-prev');
    this.nextBtn = carouselEl.querySelector('.galeria-next');
    this.dotsContainer = dotsEl;
    this.currentIndex = 0;
    this.autoplayInterval = null;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  get slidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  get totalPages() {
    return Math.ceil(this.slides.length / this.slidesPerView);
  }

  init() {
    this.createDots();
    this.updateCarousel();

    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Autoplay
    this.startAutoplay();
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch/Swipe
    let startX = 0;
    this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    this.track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    });

    // Responsive
    window.addEventListener('resize', () => {
      this.createDots();
      this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
      this.updateCarousel();
    });
  }

  createDots() {
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('galeria-dot');
      if (i === this.currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => { this.currentIndex = i; this.updateCarousel(); });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    const slideWidth = 100 / this.slidesPerView;
    const offset = this.currentIndex * this.slidesPerView * slideWidth;
    this.track.style.transform = `translateX(-${offset}%)`;

    this.slides.forEach(slide => {
      slide.style.minWidth = `${slideWidth}%`;
    });

    const dots = this.dotsContainer.querySelectorAll('.galeria-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalPages;
    this.updateCarousel();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalPages) % this.totalPages;
    this.updateCarousel();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 4000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Inicializar todos los carruseles de galería
const galeriaCarousels = [];
document.querySelectorAll('.galeria-carousel').forEach(carouselEl => {
  // Buscar el contenedor de dots que sea hermano del carousel
  const dotsEl = carouselEl.parentElement.querySelector('.galeria-dots');
  if (dotsEl) {
    galeriaCarousels.push(new GaleriaCarousel(carouselEl, dotsEl));
  }
});

// =========================================
// GALERÍA FULL WIDTH (MINISTERIOS)
// =========================================
class GaleriaFullWidth {
  constructor(sectionEl) {
    this.section = sectionEl;
    this.carousel = sectionEl.querySelector('.galeria-fullwidth-carousel');
    this.track = sectionEl.querySelector('.galeria-fw-track');
    this.slides = sectionEl.querySelectorAll('.galeria-fw-slide');
    this.prevBtn = sectionEl.querySelector('.galeria-fw-prev');
    this.nextBtn = sectionEl.querySelector('.galeria-fw-next');
    this.dotsContainer = sectionEl.querySelector('.galeria-fw-dots');
    this.currentIndex = 0;
    this.autoplayInterval = null;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.createDots();
    this.updateCarousel();

    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Autoplay
    this.startAutoplay();
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch/Swipe
    let startX = 0;
    this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    this.track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    });
  }

  createDots() {
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement('button');
      dot.classList.add('galeria-fw-dot');
      if (i === this.currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => { this.currentIndex = i; this.updateCarousel(); });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    const offset = this.currentIndex * 100;
    this.track.style.transform = `translateX(-${offset}%)`;

    const dots = this.dotsContainer.querySelectorAll('.galeria-fw-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Inicializar galerías full width
document.querySelectorAll('.galeria-fullwidth').forEach(sectionEl => {
  new GaleriaFullWidth(sectionEl);
});

// =========================================
// LIGHTBOX GALERÍA (INDEX + MINISTERIOS)
// =========================================
class GaleriaLightboxMin {
  constructor(lightboxEl) {
    this.lightbox = lightboxEl;
    this.img = lightboxEl.querySelector('img');
    this.closeBtn = lightboxEl.querySelector('.galeria-lightbox-close');
    this.prevBtn = lightboxEl.querySelector('.galeria-lightbox-prev');
    this.nextBtn = lightboxEl.querySelector('.galeria-lightbox-next');
    this.counter = lightboxEl.querySelector('.galeria-lightbox-counter');
    this.images = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Recopilar imágenes de los carruseles
    const slides = document.querySelectorAll('.galeria-slide img');
    slides.forEach((img, index) => {
      this.images.push({ src: img.src, alt: img.alt });
      img.addEventListener('click', () => this.open(index));
    });

    if (this.images.length === 0) return;

    // Controles
    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Cerrar al hacer clic en fondo
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  open(index) {
    this.currentIndex = index;
    this.showImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  showImage() {
    const image = this.images[this.currentIndex];
    this.img.src = image.src;
    this.img.alt = image.alt;
    this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showImage();
  }
}

// Inicializar el primer lightbox que se encuentre
const lightboxEl = document.querySelector('.galeria-lightbox');
const galeriaLightboxMin = lightboxEl ? new GaleriaLightboxMin(lightboxEl) : null;

// =========================================
// LOG DE INICIALIZACIÓN
// =========================================
// =========================================
// MODAL DE INFORMACIÓN RÁPIDA (INDEX)
// =========================================
const infoModal = document.getElementById('infoModal');
const infoModalBody = document.getElementById('infoModalBody');

// Contenido expandido para cada tarjeta
const infoContent = {
  horarios: `
    <div class="modal-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>
    <h3>Horarios de Reuniones</h3>
    <div class="info-detail">
      <div class="info-detail-icon">⛪</div>
      <div class="info-detail-content">
        <h4>Domingo - Culto General</h4>
        <p>10:00 AM </p>
        <p>Adoración, predicación y comunión</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">📖</div>
      <div class="info-detail-content">
        <h4>Miercoles - Culto entre semana</h4>
        <p>19:00 PM </p>
        <p>Estudio bíblico y oración</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">🔥</div>
      <div class="info-detail-content">
        <h4>Sábado - Reunión de Jóvenes</h4>
        <p>18:00 PM </p>
        <p>Encuentro especial para jóvenes</p>
      </div>
    </div>
    <a href="contacto.html" class="modal-btn">Ver todos los horarios</a>
  `,
  ubicacion: `
    <div class="modal-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
    <h3>Nuestra Ubicación</h3>
    <div class="info-detail">
      <div class="info-detail-icon">📍</div>
      <div class="info-detail-content">
        <h4>Dirección</h4>
        <p>Cam. Benito Berges 4347</p>
        <p>12300 Montevideo, Uruguay</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">🚗</div>
      <div class="info-detail-content">
        <h4>Estacionamiento</h4>
        <p>Estacionamiento gratuito disponible para todos los asistentes</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">🚌</div>
      <div class="info-detail-content">
        <h4>Transporte Público</h4>
        <p>Líneas de ómnibus cercanas con parada a pocos metros</p>
      </div>
    </div>
    <a href="https://maps.google.com/?q=Cam.+Benito+Berges+4347,+Montevideo,+Uruguay" target="_blank" class="modal-btn">Abrir en Google Maps</a>
  `,
  contacto: `
    <div class="modal-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    </div>
    <h3>Contáctanos</h3>
    <div class="info-detail">
      <div class="info-detail-icon">📞</div>
      <div class="info-detail-content">
        <h4>Teléfono</h4>
        <p><a href="tel:+59812345678">+598 1234 5678</a></p>
        <p>Lunes a Viernes 9:00 - 18:00</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">✉️</div>
      <div class="info-detail-content">
        <h4>Email</h4>
        <p><a href="mailto:soportesinai4347@gmail.com">soportesinai4347@gmail.com</a></p>
        <p>Respondemos en 24-48 horas</p>
      </div>
    </div>
    <div class="info-detail">
      <div class="info-detail-icon">💬</div>
      <div class="info-detail-content">
        <h4>WhatsApp</h4>
        <p><a href="https://wa.me/59812345678">+598 1234 5678</a></p>
        <p>Escríbenos directamente</p>
      </div>
    </div>
    <a href="contacto.html" class="modal-btn">Ir a página de contacto</a>
  `
};

// Inicializar tarjetas expandibles
if (infoModal && infoModalBody) {
  const expandibleCards = document.querySelectorAll('.card-expandible');
  const modalClose = infoModal.querySelector('.info-modal-close');

  expandibleCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardType = card.dataset.card;
      if (infoContent[cardType]) {
        infoModalBody.innerHTML = infoContent[cardType];
        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Cerrar modal
  modalClose.addEventListener('click', () => {
    infoModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Cerrar al hacer clic en fondo
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal.classList.contains('active')) {
      infoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// =========================================
// FORMULARIOS - ENVÍO AJAX + NOTIFICACIÓN
// =========================================
function mostrarNotificacion(exito) {
  const notif = document.createElement('div');
  notif.className = 'form-notificacion' + (exito ? ' form-notificacion--exito' : ' form-notificacion--error');
  notif.innerHTML = exito
    ? '<span class="form-notif-icono">✓</span><div><strong>¡Mensaje enviado!</strong><p>Gracias por contactarte con nosotros. Te respondemos a la brevedad.</p></div>'
    : '<span class="form-notif-icono">✕</span><div><strong>Error al enviar</strong><p>Por favor intentá de nuevo o escribinos directamente al correo.</p></div>';
  document.body.appendChild(notif);

  requestAnimationFrame(() => notif.classList.add('form-notificacion--visible'));

  setTimeout(() => {
    notif.classList.remove('form-notificacion--visible');
    notif.addEventListener('transitionend', () => notif.remove(), { once: true });
  }, 5000);
}

document.querySelectorAll('form[action*="formspree"]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true; }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        mostrarNotificacion(true);
      } else {
        mostrarNotificacion(false);
      }
    } catch {
      mostrarNotificacion(false);
    } finally {
      if (btn) { btn.textContent = textoOriginal; btn.disabled = false; }
    }
  });
});

// =========================================
// LOG DE INICIALIZACIÓN
// =========================================
console.log('✅ Módulos cargados:');
console.log('  - Hero Video: Activo');
console.log('  - Carrusel Noticias:', noticiasCarousel.items.length > 0 ? 'Activo' : 'No encontrado');
console.log('  - Galería Carrusel:', galeriaCarousels.length > 0 ? `${galeriaCarousels.length} carrusel(es)` : 'No encontrado');
console.log('  - Galería Lightbox:', galeriaLightboxMin && galeriaLightboxMin.images.length > 0 ? `${galeriaLightboxMin.images.length} imágenes` : 'No encontrado');
console.log('  - Animaciones Scroll:', scrollAnimations.elements.length > 0 ? `${scrollAnimations.elements.length} elementos` : 'No encontrado');
console.log('  - Info Modal:', infoModal ? 'Activo' : 'No encontrado');
console.log('🚀 Sistema listo!');
