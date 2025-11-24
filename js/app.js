(function() {
    'use strict';

    // --- 1. CART SYSTEM ---
    window.cart = [];
    window.products = {
        'rc20': { name: 'RC20 Mod', icon: 'assets/icons/icon_rc20.jpg', plans: { '1month': { name: '1 Month', price: 250 }, 'lifetime': { name: 'Lifetime', price: 1500 } } },
        'wcc3': { name: 'WCC3 Mod', icon: 'assets/icons/icon_wcc3.png', plans: { '1month': { name: '1 Month', price: 350 }, 'lifetime': { name: 'Lifetime', price: 2000 } } },
        'rc25': { name: 'RC25 Mod', icon: 'assets/icons/icon_rc25.jpg', plans: { 'free': { name: 'Free Version', price: 0 } } }
    };

    window.addToCart = function(gameId, planType) {
        const product = window.products[gameId];
        const plan = product.plans[planType];
        
        if(plan.price === 0) { window.open('https://www.mediafire.com/', '_blank'); return; }

        window.cart = [{ gameId, gameName: product.name, planName: plan.name, price: plan.price, image: product.icon }];
        updateCartBadge();
        
        // Redirect to Cart
        if(window.router) window.router.navigateTo('/cart');
    };

    function updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if(badge) {
            badge.innerText = window.cart.length;
            badge.classList.toggle('hidden', window.cart.length === 0);
        }
    }
    // Make global
    window.updateCartBadge = updateCartBadge;

  // --- 2. THEME LOGIC (FIXED) ---
const THEME_KEY = 'stark_theme_dark';

function applyTheme(isDark) {
    // Tailwind expects .dark on <html>, your CSS expects .dark on body
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);

    // Optional: update icons
    const iconDesktop = document.getElementById('theme-icon');
    const iconMobile  = document.querySelector('#theme-toggle-mobile .material-icons');
    if (iconDesktop) iconDesktop.textContent = isDark ? 'light_mode' : 'dark_mode';
    if (iconMobile)  iconMobile.textContent  = isDark ? 'light_mode' : 'dark_mode';
}

function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const isDark = saved === '1';
    applyTheme(isDark);
}

function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
}
    // --- 3. CAROUSEL ---
    function initializeCarousels() {
        document.querySelectorAll('.screenshot-carousel').forEach(c => {
            // Basic carousel logic here if needed
        });
    }

    // --- INIT ---
    document.addEventListener('DOMContentLoaded', () => {
        initializeTheme();
        updateCartBadge();

        // Event Listeners for Theme Buttons
        document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });

        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if(menuBtn && menu) menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    });

    window.initializeComponents = function() {
        initializeCarousels();
        updateCartBadge();
    };
})();
