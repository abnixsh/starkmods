// js/app.js
(function () {
  'use strict';

  // --- 1. CART SYSTEM ---
  window.cart = [];
  // Existing Hardcoded Products (Kept as requested)
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
    const count = window.cart.length;
    
    // 1. Desktop Header Badge
    const badgeDesktop = document.getElementById('cart-badge');
    if (badgeDesktop) {
      badgeDesktop.innerText = count;
      badgeDesktop.classList.toggle('hidden', count === 0);
    }

    // 2. Mobile Bottom Nav Badge
    const badgeMobile = document.getElementById('mobile-cart-badge');
    if (badgeMobile) {
      badgeMobile.innerText = count;
      if (count > 0) {
        badgeMobile.classList.remove('hidden');
        setTimeout(() => badgeMobile.classList.remove('scale-0'), 50); // Pop animation
      } else {
        badgeMobile.classList.add('scale-0');
        setTimeout(() => badgeMobile.classList.add('hidden'), 300);
      }
    }
  }
  window.updateCartBadge = updateCartBadge;

  // --- 1b. ADMIN ICON TOGGLE ---
  window.updateAdminIcon = function () {
    const btn = document.getElementById('admin-panel-btn');
    const isAdmin = !!(window.currentUser && window.isAdmin);
    if (btn) btn.classList.toggle('hidden', !isAdmin);
  };

  // --- 2. THEME LOGIC ---
  const THEME_KEY = 'stark_theme_dark';

  function applyTheme(isDark) {
    const html = document.documentElement;
    if (!html) return;
    html.classList.toggle('dark', isDark);
    const iconDesktop = document.getElementById('theme-icon');
    if (iconDesktop) iconDesktop.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const isDark = saved === '1'; // Default light if not set
    applyTheme(isDark);
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = !html.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
  }

  // --- 3. CAROUSEL LOGIC ---
  function initializeCarousels() {
    document.querySelectorAll('.screenshot-carousel').forEach((carousel) => {
      if (carousel.dataset.carouselInit === '1') return;
      carousel.dataset.carouselInit = '1';
      // ... (Existing carousel logic remains same, keeping it concise here) ...
      // If you need the full carousel code again, let me know, 
      // otherwise it assumes the code from your previous message is here.
      const track = carousel.querySelector('.screenshot-carousel-track');
      const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
      if (!track || slides.length <= 1) return;
      let index = 0;
      function update() { track.style.transform = `translateX(-${index * 100}%)`; }
      setInterval(() => { index = (index + 1) % slides.length; update(); }, 4000);
    });
  }

  // --- 4. NEW: SCROLL REVEAL ANIMATION ---
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    // Create Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => observer.observe(el));
  }

  // --- 5. NEW: UPDATE BOTTOM NAV ACTIVE STATE ---
  function updateBottomNavHighlight() {
    // Remove active class from all
    document.querySelectorAll('.bottom-nav-link').forEach(el => el.classList.remove('active'));

    const path = window.location.pathname; // Or use window.router.currentRoute if available
    
    // Logic to highlight based on URL
    // Note: This depends on how your router updates the URL
    // If your router uses hash (e.g. #/cart), change to window.location.hash
    if (path === '/' || path.endsWith('index.html')) {
        document.getElementById('nav-home')?.classList.add('active');
    } else if (path.includes('cart') || window.router?.currentRoute === '/cart') {
        document.getElementById('nav-cart')?.classList.add('active');
    } else if (path.includes('profile') || window.router?.currentRoute === '/profile') {
        document.getElementById('nav-profile')?.classList.add('active');
    }
  }

  // --- 6. INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateCartBadge();
    if (window.updateAdminIcon) window.updateAdminIcon();

    document.querySelectorAll('#theme-toggle').forEach(btn => 
      btn.addEventListener('click', toggleTheme)
    );
  });

  // Called by router after each page render
  window.initializeComponents = function () {
    initializeCarousels();
    updateCartBadge();
    
    // NEW FUNCTIONS
    initScrollReveal();
    updateBottomNavHighlight();
  };
})();
