// js/app.js
(function () {
  'use strict';

  // --- 1. CART SYSTEM ---
  window.cart = [];
  window.products = {
    rc20: {
      name: 'RC20 Mod',
      icon: 'assets/icons/icon_rc20.jpg',
      plans: {
        '1month': { name: '1 Month', price: 250 },
        'lifetime': { name: 'Lifetime', price: 1500 }
      }
    },
    wcc3: {
      name: 'WCC3 Mod',
      icon: 'assets/icons/icon_wcc3.png',
      plans: {
        '1month': { name: '1 Month', price: 350 },
        'lifetime': { name: 'Lifetime', price: 2000 }
      }
    },
    rc25: {
      name: 'RC25 Mod',
      icon: 'assets/icons/icon_rc25.jpg',
      plans: {
        free: { name: 'Free Version', price: 0 }
      }
    }
  };

  window.addToCart = function (gameId, planType) {
    const product = window.products[gameId];
    if (!product) return;

    const plan = product.plans[planType];
    if (!plan) return;

    // Free version: just redirect
    if (plan.price === 0) {
      window.open('https://www.mediafire.com/', '_blank');
      return;
    }

    window.cart = [{
      gameId,
      gameName: product.name,
      planName: plan.name,
      price: plan.price,
      image: product.icon
    }];

    updateCartBadge();

    if (window.router) window.router.navigateTo('/cart');
  };

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.innerText = window.cart.length;
      badge.classList.toggle('hidden', window.cart.length === 0);
    }
  }
  window.updateCartBadge = updateCartBadge;

  // --- 1b. ADMIN ICON TOGGLE ---
  // Shows the admin panel icon only when current user is admin
  window.updateAdminIcon = function () {
    const btn = document.getElementById('admin-panel-btn');
    if (!btn) return;

    const isAdmin = !!(window.currentUser && window.isAdmin);
    btn.classList.toggle('hidden', !isAdmin);
  };

  // --- 2. THEME LOGIC ---
  const THEME_KEY = 'stark_theme_dark';

  function applyTheme(isDark) {
    const html = document.documentElement;
    if (!html) return;

    // Put .dark on <html> so Tailwind + CSS both work
    html.classList.toggle('dark', isDark);

    const iconDesktop = document.getElementById('theme-icon');
    const iconMobile = document.querySelector('#theme-toggle-mobile .material-icons');
    if (iconDesktop) iconDesktop.textContent = isDark ? 'light_mode' : 'dark_mode';
    if (iconMobile) iconMobile.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    let isDark;
    if (saved === '1') isDark = true;
    else if (saved === '0') isDark = false;
    else isDark = false; // default light

    applyTheme(isDark);
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = !html.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
  }

  // (First) DOMContentLoaded: theme only
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    document
      .querySelectorAll('#theme-toggle, #theme-toggle-mobile')
      .forEach(btn => btn.addEventListener('click', toggleTheme));
  });

  // --- 3. CAROUSEL LOGIC ---
  function initializeCarousels() {
    document.querySelectorAll('.screenshot-carousel').forEach((carousel) => {
      if (carousel.dataset.carouselInit === '1') return;
      carousel.dataset.carouselInit = '1';

      const track = carousel.querySelector('.screenshot-carousel-track');
      const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
      if (!track || slides.length <= 1) return;

      let index = 0;
      const total = slides.length;

      const prevBtn = carousel.querySelector('.screenshot-carousel-nav.prev');
      const nextBtn = carousel.querySelector('.screenshot-carousel-nav.next');

      const indicatorsContainer = carousel.querySelector('.screenshot-carousel-indicators');
      const indicators = [];
      if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, i) => {
          const dot = document.createElement('div');
          dot.className = 'screenshot-carousel-indicator' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            index = i;
            update();
            resetAutoplay();
          });
          indicatorsContainer.appendChild(dot);
          indicators.push(dot);
        });
      }

      function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((dot, i) => dot.classList.toggle('active', i === index));
      }

      function goNext() {
        index = (index + 1) % total;
        update();
      }

      function goPrev() {
        index = (index - 1 + total) % total;
        update();
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          goPrev();
          resetAutoplay();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          goNext();
          resetAutoplay();
        });
      }

      let autoplayId = null;

      function startAutoplay() {
        if (autoplayId) return;
        autoplayId = setInterval(goNext, 4000);
      }

      function stopAutoplay() {
        if (!autoplayId) return;
        clearInterval(autoplayId);
        autoplayId = null;
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);

      update();
      startAutoplay();
    });
  }

  // --- INIT (second DOMContentLoaded) ---
  document.addEventListener('DOMContentLoaded', () => {
    // Theme again (harmless but can be removed if you want)
    initializeTheme();
    updateCartBadge();

    document
      .querySelectorAll('#theme-toggle, #theme-toggle-mobile')
      .forEach(btn => btn.addEventListener('click', toggleTheme));

    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }

    // Initialize admin icon once DOM is ready (will hide if not admin)
    if (window.updateAdminIcon) window.updateAdminIcon();
  });

  // Called by router after each page render
  window.initializeComponents = function () {
    initializeCarousels();
    updateCartBadge();
  };
})();
