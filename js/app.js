// js/app.js
(function() {
    'use strict';
    
    // --- GLOBAL CART STATE ---
    window.cart = [];
    window.selectedPlan = null; // Stores currently selected plan on product page

    // --- THEME LOGIC ---
    const THEME_KEY = 'stark_theme_dark';
    
    function updateThemeIcons(isDark) {
        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }

    function setTheme(isDark) {
        if (isDark) document.body.classList.add('dark');
        else document.body.classList.remove('dark');
        updateThemeIcons(isDark);
        localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
    }

    function initializeTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        setTheme(saved === '1');
    }

    // --- CART FUNCTIONS ---
    
    // 1. Select Plan (Visual Only)
    window.selectPlan = function(gameId, planType, price, name) {
        // Reset previous selection visual
        document.querySelectorAll('.plan-option').forEach(el => {
            el.classList.remove('border-blue-600', 'bg-blue-50', 'dark:bg-blue-900/20', 'ring-2', 'ring-blue-600');
            el.classList.add('border-slate-200', 'dark:border-slate-700');
        });

        // Highlight new selection
        const selectedEl = document.getElementById(`plan-${planType}`);
        if(selectedEl) {
            selectedEl.classList.remove('border-slate-200', 'dark:border-slate-700');
            selectedEl.classList.add('border-blue-600', 'bg-blue-50', 'dark:bg-blue-900/20', 'ring-2', 'ring-blue-600');
        }

        // Store selection
        window.selectedPlan = { gameId, planType, price, name };
        
        // Enable Add to Cart Button
        const btn = document.getElementById('add-to-cart-btn');
        if(btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.innerHTML = `<span class="material-icons">shopping_cart</span> Add ${name} to Cart`;
        }
    };

    // 2. Add to Cart (Action)
    window.addToCart = function() {
        if (!window.selectedPlan) return;
        
        // Add to global cart array
        window.cart = [window.selectedPlan]; // Replaces previous item (Single item cart for now)
        
        updateCartBadge();
        
        // Animation feedback
        const btn = document.getElementById('add-to-cart-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-icons">check</span> Added!`;
        btn.classList.add('bg-green-600');
        
        setTimeout(() => {
            window.router.navigateTo('/cart');
        }, 800);
    };

    // 3. Update Badge
    function updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if(!badge) return;
        
        if (window.cart.length > 0) {
            badge.classList.remove('hidden');
            badge.innerText = window.cart.length;
        } else {
            badge.classList.add('hidden');
        }
    }

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
        updateCartBadge();

        // Theme Toggle
        const toggleBtn = document.getElementById('theme-toggle');
        if(toggleBtn) toggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark');
            setTheme(!isDark);
        });

        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if(menuBtn && menu) {
            menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
        }
    });

})();
