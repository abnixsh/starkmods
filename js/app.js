(function() {
    'use strict';

    
    window.cart = [];
    
    
    window.products = {
        'rc20': { 
            name: 'RC20 Mod', 
            icon: 'assets/icons/icon_rc20.jpg', 
            plans: {
                '1month': { name: '1 Month', price: 300 },
                'lifetime': { name: 'Lifetime', price: 900 }
            }
        },
        'wcc3': { 
            name: 'WCC3 Mod', 
            icon: 'assets/icons/icon_wcc3.jpg', 
            plans: {
                '1month': { name: '1 Month', price: 300 },
                'lifetime': { name: 'Lifetime', price: 1200 }
            }
        }
    };

   
    window.addToCart = function(gameId, planType) {
        const product = window.products[gameId];
        if (!product) return;
        
        const plan = product.plans[planType];
        
        
        window.cart = [{
            gameId: gameId,
            gameName: product.name,
            planName: plan.name,
            price: plan.price,
            image: product.icon
        }];
        
        updateCartBadge();
        alert("Added to Cart!");
        
        
        if(window.router) window.router.navigateTo('/cart');
    };

    function updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            if (window.cart.length > 0) {
                badge.classList.remove('hidden');
                badge.innerText = window.cart.length;
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    
    function initializeCarousels() {
        document.querySelectorAll('.screenshot-carousel').forEach(function(carousel) {
            const track = carousel.querySelector('.screenshot-carousel-track');
            const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
            const prevBtn = carousel.querySelector('.screenshot-carousel-nav.prev');
            const nextBtn = carousel.querySelector('.screenshot-carousel-nav.next');
            
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
            
            
            let interval = setInterval(() => { 
                currentIndex = (currentIndex + 1) % slides.length; 
                updateCarousel(); 
            }, 4000);
            
            
            carousel.addEventListener('mouseenter', () => clearInterval(interval));
            carousel.addEventListener('mouseleave', () => { 
                interval = setInterval(() => { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }, 4000); 
            });
        });
    }

    
    const THEME_KEY = 'stark_theme_dark';

    function initializeTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === '1') document.body.classList.add('dark');
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const isDark = document.body.classList.contains('dark');
        const icon = document.getElementById('theme-icon');
        if(icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }

    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
        
        const toggle = document.getElementById('theme-toggle');
        if(toggle) toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem(THEME_KEY, document.body.classList.contains('dark') ? '1' : '0');
            updateThemeIcon();
        });

        const menuBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if(menuBtn && menu) menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    });

    window.initializeComponents = function() {
        initializeCarousels();
        updateCartBadge();
    };

})();
