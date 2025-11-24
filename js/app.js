(function() {
    'use strict';

    // --- 1. CART & PRODUCT SYSTEM ---
    window.cart = [];
    
    // Products Database
    window.products = {
        'rc20': { 
            name: 'RC20 Mod', 
            icon: 'assets/icons/icon_rc20.jpg', 
            plans: {
                '1month': { name: '1 Month', price: 250 },
                'lifetime': { name: 'Lifetime', price: 1500 }
            }
        },
        'wcc3': { 
            name: 'WCC3 Mod', 
            icon: 'assets/icons/icon_wcc3.jpg', 
            plans: {
                '1month': { name: '1 Month', price: 350 },
                'lifetime': { name: 'Lifetime', price: 2000 }
            }
        },
        'rc25': { 
            name: 'RC25 Mod', 
            icon: 'assets/icons/icon_rc25.jpg', 
            plans: {
                'free': { name: 'Free Version', price: 0 }
            }
        }
    };

    // Add to Cart Function
    window.addToCart = function(gameId, planType) {
        const product = window.products[gameId];
        if (!product) return;

        const plan = product.plans[planType];
        
        // Logic: Free Mod
        if (plan.price === 0) {
            window.open('https://www.mediafire.com/', '_blank'); 
            return;
        }

        // Paid Mod: Cart mein add karo
        window.cart = [{
            gameId: gameId,
            gameName: product.name,
            planName: plan.name,
            price: plan.price,
            image: product.icon
        }];
        
        window.updateCartBadge(); // Call global function
        
        // Notification Animation
        const badge = document.getElementById('cart-badge');
        if(badge) {
            badge.classList.add('animate-bounce');
            setTimeout(() => badge.classList.remove('animate-bounce'), 1000);
        }
        
        if(window.router) window.router.navigateTo('/cart');
    };

    // FIX: Make this GLOBAL so other files can use it
    window.updateCartBadge = function() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            if (window.cart && window.cart.length > 0) {
                badge.classList.remove('hidden');
                badge.innerText = window.cart.length;
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // --- 2. CAROUSEL LOGIC ---
    function initializeCarousels() {
        document.querySelectorAll('.screenshot-carousel').forEach(function(carousel) {
            const track = carousel.querySelector('.screenshot-carousel-track');
            const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
            const prevBtn = carousel.querySelector('.screenshot-carousel-nav.prev');
            const nextBtn = carousel.querySelector('.screenshot-carousel-nav.next');
            
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
            
            if (shouldAutoPlay) {
                let interval = setInterval(() => { 
                    currentIndex = (currentIndex + 1) % slides.length; 
                    updateCarousel(); 
                }, 4000);
                
                carousel.addEventListener('mouseenter', () => clearInterval(interval));
                carousel.addEventListener('mouseleave', () => { 
                    interval = setInterval(() => { 
                        currentIndex = (currentIndex + 1) % slides.length; 
                        updateCarousel(); 
                    }, 4000); 
                });
            }
        });
    }

    // --- 3. THEME LOGIC ---
    const THEME_KEY = 'stark_theme_dark';

    function initializeTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === '1') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        const icons = document.querySelectorAll('#theme-icon');
        icons.forEach(icon => {
            icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
        window.updateCartBadge(); // Run on load

        const toggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
        toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem(THEME_KEY, isDark ? '1' : '0');
                updateThemeIcon();
            });
        });

        const menuBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if(menuBtn && menu) {
            menuBtn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
        }
    });

    window.initializeComponents = function() {
        initializeCarousels();
        window.updateCartBadge();
    };

})();
