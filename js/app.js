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
    },
    rc24: {
      name: 'RC24 Patch',
      icon: 'assets/icons/icon_rc24.png',
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

  // --- 2. ADMIN ICON ---
  window.updateAdminIcon = function () {
    const mobileLink = document.getElementById('mobile-admin-link');
    const isAdmin = !!(window.currentUser && window.isAdmin);
    if (mobileLink) mobileLink.style.display = isAdmin ? 'flex' : 'none';
  };

  // --- 3. DOCK ACTIVE STATE ---
  function updateActiveDock() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const navs = {
      '/': 'dock-home',
      '/creator': 'dock-creator',
      '/profile': 'dock-profile'
    };
    Object.values(navs).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    const activeId = navs[path];
    if (activeId) {
      const activeEl = document.getElementById(activeId);
      if (activeEl) activeEl.classList.add('active');
    }
  }

  // --- 4. THEME LOGIC ---
  const THEME_KEY = 'stark_theme_dark';

  function applyTheme(isDark) {
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    // Default to dark mode if not set, or if set to '1'
    const isDark = saved === null || saved === '1'; 
    applyTheme(isDark);
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = !html.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
    // Close mobile menu if open
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.add('hidden');
  }

  // --- 5. DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateCartBadge();
    updateActiveDock();

    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }

    const themeBtn = document.getElementById('theme-toggle-mobile');
    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);

    window.addEventListener('scroll', () => {
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
      }
    });
  });

  window.initializeComponents = function () {
    updateCartBadge();
    updateActiveDock();
    if (window.updateAdminIcon) window.updateAdminIcon();
  };

})();
