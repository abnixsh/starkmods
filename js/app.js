(function() {
    'use strict';
    
    // --- GLOBAL VARIABLES ---
    window.cart = [];
    window.selectedPlan = null;
    const THEME_KEY = 'stark_theme_dark';

    // --- CAROUSEL LOGIC (Fixed: No Autoplay if restricted) ---
    function initializeCarousels() {
        document.querySelectorAll('.screenshot-carousel').forEach(function(carousel) {
            const track = carousel.querySelector('.screenshot-carousel-track');
            const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
            const prevBtn = carousel.querySelector('.screenshot-carousel-nav.prev');
            const nextBtn = carousel.querySelector('.screenshot-carousel-nav.next');
            
            // CHECK FOR AUTOPLAY ATTRIBUTE
            const shouldAutoPlay = carousel.getAttribute('data-autoplay') !== 'false';

            if (!track || !slides.length) return;
            let currentIndex = 0;

            function updateCarousel() { 
                track.style.transform = `translateX(${-currentIndex * 100}%)`; 
            }
            
            if (prevBtn) prevBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                currentIndex = (currentIndex - 1 + slides.length) % slides.length; 
                updateCarousel(); 
            });
            
            if (nextBtn) nextBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                currentIndex = (currentIndex + 1) % slides.length; 
                updateCarousel(); 
            });
            
            // Only start interval if autoplay is allowed
            if (shouldAutoPlay) {
                let interval = setInterval(() => { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }, 4000);
                carousel.addEventListener('mouseenter', () => clearInterval(interval));
                carousel.addEventListener('mouseleave', () => { interval = setInterval(() => { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }, 4000); });
            }
        });
    }

    // --- CART & PLAN SELECTION LOGIC ---
    window.selectPlan = function(gameId, planType, price, name) {
        // Visual Reset
        document.querySelectorAll('.plan-option').forEach(el => {
            // Remove highlighting classes
            el.classList.remove('border-blue-500', 'ring-2', 'ring-blue-500', 'bg-slate-700'); 
            // Add default classes (Dark theme specific)
            el.classList.add('border-slate-700', 'bg-slate-800');
        });

        // Highlight Selected
        const selectedEl = document.getElementById(`plan-${planType}`);
        if(selectedEl) {
            selectedEl.classList.remove('border-slate-700', 'bg-slate-800');
            selectedEl.classList.add('border-blue-500', 'ring-2', 'ring-blue-500', 'bg-slate-700');
        }

        window.selectedPlan = { gameId, planType, price, name };
        
        // Enable Button
        const btn = document.getElementById('add-to-cart-btn');
        if(btn) {
            btn.disabled = false;
            btn.classList.remove('bg-slate-700', 'text-slate-400', 'cursor-not-allowed');
            btn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'shadow-lg');
            btn.innerHTML = `<span class="material-icons">shopping_cart</span> Add to Cart - ₹${price}`;
        }
    };

    window.addToCart = function() {
        if (!window.selectedPlan) return;
        window.cart = [window.selectedPlan];
        updateCartBadge();
        
        // Feedback
        const btn = document.getElementById('add-to-cart-btn');
        btn.innerHTML = `<span class="material-icons">check</span> Added!`;
        btn.classList.replace('bg-blue-600', 'bg-green-600');
        setTimeout(() => window.router.navigateTo('/cart'), 500);
    };

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

    // --- THEME & INIT ---
    function initializeTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === '1') {
            document.body.classList.add('dark');
            const icon = document.getElementById('theme-icon');
            if(icon) icon.textContent = 'light_mode';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
        
        // Theme Toggle
        const toggleBtn = document.getElementById('theme-toggle');
        if(toggleBtn) toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
            document.getElementById('theme-icon').textContent = isDark ? 'light_mode' : 'dark_mode';
        });

        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if(menuBtn && menu) menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    });

    // Make init function global so Router can call it
    window.initializeComponents = function() {
        initializeCarousels();
        updateCartBadge();
    };

})();
