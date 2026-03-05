(function () {
  'use strict';

  // =========================================
  // 1. DATA & CONFIGURATION
  // =========================================
  
  // Cart State
  window.cart = [];

  // Product Database (Hardcoded as requested)
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

  // =========================================
  // 2. CART LOGIC
  // =========================================

  window.addToCart = function (gameId, planType) {
    const product = window.products[gameId];
    if (!product) return;

    const plan = product.plans[planType];
    if (!plan) return;

    // External Link Check (Free Versions)
    if (plan.price === 0) {
      window.open('https://www.mediafire.com/', '_blank');
      return;
    }

    // Single Item Cart Logic (Replaces existing item)
    window.cart = [{
      gameId,
      gameName: product.name,
      planName: plan.name,
      price: plan.price,
      image: product.icon
    }];

    updateCartBadge();
    
    // Navigate to Cart Page
    if (window.router) window.router.navigateTo('/cart');
  };

  function updateCartBadge() {
    const count = window.cart.length;
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
      badge.innerText = count;
      if (count > 0) {
        badge.classList.remove('hidden');
        badge.classList.add('flex'); // Ensure it displays
      } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
      }
    }
  }
  
  // Export for other files to use
  window.updateCartBadge = updateCartBadge;

  // =========================================
  // 3. THEME LOGIC (Dark/Light Mode)
  // =========================================
  const THEME_KEY = 'stark_theme_dark';

  function applyTheme(isDark) {
    const html = document.documentElement;
    if (!html) return;

    // Toggle Class
    html.classList.toggle('dark', isDark);

    // Update Desktop Icon
    const iconDesktop = document.getElementById('theme-icon'); // The span inside the button
    if (iconDesktop) {
        iconDesktop.textContent = isDark ? 'light_mode' : 'dark_mode';
    }

    // Update Mobile Menu Icon (if exists)
    const iconMobile = document.getElementById('mobile-theme-icon');
    if (iconMobile) {
        iconMobile.textContent = isDark ? 'toggle_on' : 'toggle_off';
        iconMobile.classList.toggle('text-blue-500', isDark);
    }
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    // Default to light (false) if null, or true if '1'
    const isDark = saved === '1'; 
    applyTheme(isDark);
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = !html.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
  }

  // =========================================
  // 4. NAVIGATION & DOCK LOGIC
  // =========================================

  // Updates the Glass Dock to show which page is active
  window.updateActiveDock = function() {
    // 1. Get current path (works with Hash router or History API)
    const path = window.location.hash || window.location.pathname;

    // 2. Define IDs
    const dockIds = {
      'home': document.getElementById('dock-home'),
      'creator': document.getElementById('dock-creator'),
      'profile': document.getElementById('dock-profile')
    };

    // 3. Reset all
    Object.values(dockIds).forEach(el => {
      if(el) el.classList.remove('active');
    });

    // 4. Set Active based on path logic
    if (path.includes('creator')) {
      dockIds['creator']?.classList.add('active');
    } else if (path.includes('profile') || path.includes('order')) {
      dockIds['profile']?.classList.add('active');
    } else {
      // Default to Home for '/' or empty
      dockIds['home']?.classList.add('active');
    }
  };

  // Closes the mobile dropdown menu
  window.closeMobileMenu = function() {
    const dropdown = document.getElementById('mobile-menu-dropdown');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      document.body.style.overflow = ''; // Enable scroll
      
      // Reset Icon
      if(menuBtn) {
        const icon = menuBtn.querySelector('.material-icons');
        if(icon) icon.innerText = 'menu';
      }
    }
  };

  // =========================================
  // 5. ANIMATIONS (Scroll Reveal)
  // =========================================
  
  function initScrollReveal() {
    // Select all elements with class 'reveal'
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  }

  // =========================================
  // 6. CAROUSEL LOGIC (Screenshots)
  // =========================================
  function initializeCarousels() {
    document.querySelectorAll('.screenshot-carousel').forEach((carousel) => {
      // Prevent double init
      if (carousel.dataset.carouselInit === '1') return;
      carousel.dataset.carouselInit = '1';

      const track = carousel.querySelector('.screenshot-carousel-track');
      const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
      
      if (!track || slides.length <= 1) return;

      let index = 0;
      
      // Auto Scroll
      const interval = setInterval(() => {
        index = (index + 1) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
      }, 4000);
      
      // Optional: Pause on hover could be added here
    });
  }

  // =========================================
  // 7. INITIALIZATION (On Load)
  // =========================================
  
  document.addEventListener('DOMContentLoaded', () => {
    // A. Init Theme
    initializeTheme();
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-toggle')?.addEventListener('click', toggleTheme);

    // B. Init Cart Badge
    updateCartBadge();

    // C. Header Menu Logic (EventListener)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');

    if (menuBtn && dropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        
        if (isHidden) {
          dropdown.classList.remove('hidden');
          menuBtn.querySelector('.material-icons').innerText = 'close';
          document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
          window.closeMobileMenu();
        }
      });

      // Close if clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
          window.closeMobileMenu();
        }
      });
    }
  });

  // =========================================
  // 8. ROUTER HOOK (Global Function)
  // =========================================
  
  // This function is called by router.js AFTER a page is rendered.
  // It re-initializes dynamic components.
  window.initializeComponents = function () {
    initializeCarousels();
    updateCartBadge();
    initScrollReveal();
    updateActiveDock(); // Update the glass dock visuals
    
    // Ensure mobile menu is closed after navigation
    window.closeMobileMenu();
  };

})();
