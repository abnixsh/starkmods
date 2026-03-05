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
        'lifetime': { name: 'Lifetime', price: 1000 }
      }
    },
    wcc3: {
      name: 'WCC3 Mod',
      icon: 'assets/icons/icon_wcc3.png',
      plans: {
        '1month': { name: '1 Month', price: 250 },
        'lifetime': { name: 'Lifetime', price: 800 }
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
  window.updateAdminIcon = function () {
    const btn = document.getElementById('admin-panel-btn');
    const mobileLink = document.getElementById('mobile-admin-link');
    const isAdmin = !!(window.currentUser && window.isAdmin);

    if (btn) {
      btn.classList.toggle('hidden', !isAdmin);
    }
    if (mobileLink) {
      mobileLink.style.display = isAdmin ? 'flex' : 'none';
    }
  };

  // --- 2. THEME LOGIC ---
  const THEME_KEY = 'stark_theme_dark';

  function applyTheme(isDark) {
    const html = document.documentElement;
    if (!html) return;

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

  function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  }
  window.closeMobileMenu = closeMobileMenu;

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = !html.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
    closeMobileMenu();
  }

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

// --- 4. DOCK ACTIVE STATE ---
function updateDockActive() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const dockMap = {
    '/': 'home',
    '/creator': 'creator',
    '/profile': 'profile'
  };

  document.querySelectorAll('.ios-dock-item').forEach(btn => {
    btn.classList.remove('dock-active');
  });

  const activeKey = dockMap[path];
  if (activeKey) {
    const activeBtn = document.querySelector(`.ios-dock-item[data-dock="${activeKey}"]`);
    if (activeBtn) {
      activeBtn.classList.add('dock-active');
    }
  }
}
window.updateDockActive = updateDockActive;

  // --- 5. INIT ON DOM LOAD ---
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateCartBadge();
    updateDockActive();
    if (window.updateAdminIcon) window.updateAdminIcon();

    // Theme toggles
    document
      .querySelectorAll('#theme-toggle, #theme-toggle-mobile')
      .forEach(btn => btn.addEventListener('click', toggleTheme));

    // Menu button (now works on all screens)
    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }

    // Close menu on scroll
    window.addEventListener('scroll', () => {
      closeMobileMenu();
    });

    // Close menu when clicking a link inside it
    if (menu) {
      menu.querySelectorAll('a[data-link]').forEach(link => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }
  });

  // Called by router after each page render
  window.initializeComponents = function () {
    initializeCarousels();
    updateCartBadge();
    updateDockActive();
  };
})();
