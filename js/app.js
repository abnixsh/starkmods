// js/app.js - Main Application
(function() {
    'use strict';

    const THEME_KEY = 'stark_theme_dark';

    // ... (Theme functions same as before) ...
    function updateThemeIcons(isDark) {
        const elements = [{icon: 'theme-icon', text: 'theme-text'}, {icon: 'theme-icon-mobile', text: 'theme-text-mobile'}];
        elements.forEach(({icon, text}) => {
            const iconEl = document.getElementById(icon);
            const textEl = document.getElementById(text);
            if (iconEl && textEl) {
                if (isDark) { iconEl.textContent = 'light_mode'; textEl.textContent = 'Light'; } 
                else { iconEl.textContent = 'dark_mode'; textEl.textContent = 'Dark'; }
            }
        });
    }

    function setTheme(isDark) {
        const body = document.body;
        if (isDark) body.classList.add('dark'); else body.classList.remove('dark');
        updateThemeIcons(isDark);
        try { localStorage.setItem(THEME_KEY, isDark ? '1' : '0'); } catch (e) { console.warn(e); }
    }

    function initializeTheme() {
        let isDark = false;
        try { const saved = localStorage.getItem(THEME_KEY); if (saved !== null) isDark = saved === '1'; } catch (e) { console.warn(e); }
        document.body.classList.remove('dark'); setTheme(isDark);
    }

    function toggleTheme() {
        const body = document.body;
        setTheme(!body.classList.contains('dark'));
    }

    function initializeMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
            document.addEventListener('click', (e) => {
                if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.classList.add('hidden');
            });
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-link') || e.target.closest('[data-link]')) mobileMenu.classList.add('hidden');
            });
        }
    }

    function initializeDropdowns() {
        const moreDropdown = document.getElementById('more-dropdown');
        const moreMenu = document.getElementById('more-menu');
        if (moreDropdown && moreMenu) {
            moreDropdown.addEventListener('click', (e) => { e.preventDefault(); moreMenu.classList.toggle('hidden'); });
            document.addEventListener('click', (e) => {
                if (!moreDropdown.contains(e.target) && !moreMenu.contains(e.target)) moreMenu.classList.add('hidden');
            });
        }
    }

    window.initializeComponents = function() {
        initializeCarousels();
        initializeCardNavigation();
        initializeDownloads();
        initializeForms();
    };

    function initializeCarousels() {
        document.querySelectorAll('.screenshot-carousel').forEach(function(carousel) {
            const track = carousel.querySelector('.screenshot-carousel-track');
            const slides = carousel.querySelectorAll('.screenshot-carousel-slide');
            const prevBtn = carousel.querySelector('.screenshot-carousel-nav.prev');
            const nextBtn = carousel.querySelector('.screenshot-carousel-nav.next');
            
            if (!track || !slides.length) return;
            let currentIndex = 0;

            function updateCarousel() { track.style.transform = `translateX(${-currentIndex * 100}%)`; }
            
            if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(); });
            if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); });
            
            setInterval(() => { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }, 4000);
        });
    }

    // UPDATED: Now points to RC20 instead of Offset Tester
    function initializeCardNavigation() {
        const cardRoutes = {
            'rc20-card': '/rc20',        // New Route
            'wcc3-card': '/wcc3',
            'esp-tester-card': '/esptester'
        };

        Object.keys(cardRoutes).forEach(function(cardId) {
            const card = document.getElementById(cardId);
            if (card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.download-btn')) return; // Let download button handle itself
                    window.router.navigateTo(cardRoutes[cardId]);
                });
            }
        });
    }

    // UPDATED: Removed GitHub Links. Redirects to Plans.
    function initializeDownloads() {
        document.querySelectorAll('.download-btn').forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                // Send everyone to Plans page to buy
                window.router.navigateTo('/plans');
            });
        });
    }

    function initializeForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                // Updated Email
                window.open(`mailto:abnixsh@gmail.com?subject=Contact&body=${encodeURIComponent(formData.get('message'))}`);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
        const desktopToggle = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('theme-toggle-mobile');
        if (desktopToggle) desktopToggle.addEventListener('click', toggleTheme);
        if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
        initializeMobileMenu();
        initializeDropdowns();
        setTimeout(() => { if (window.router) window.initializeComponents(); }, 100);
    });
})();
