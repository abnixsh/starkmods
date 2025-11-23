class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        // 1. Routes List (Yahan check karo /rc20 hai ya nahi)
        this.addRoute('/', 'home');
        this.addRoute('/cart', 'cart');
        this.addRoute('/checkout', 'checkout');
        
        this.addRoute('/rc20', 'rc20'); // <-- YE LINE ZAROORI HAI
        this.addRoute('/wcc3', 'wcc3');
        
        this.addRoute('/contact', 'contact');
        this.addRoute('/plans', 'cart'); // Plans click karne par bhi cart dikhaye

        // Back Button Handle
        window.addEventListener('popstate', () => this.handleRoute(location.pathname));
        
        // Link Click Handle
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute('href'));
            }
        });

        // Initial Load
        this.handleRoute(location.pathname);
    }

    addRoute(path, pageName) {
        this.routes[path] = pageName;
    }

    navigateTo(path) {
        history.pushState(null, null, path);
        this.handleRoute(path);
    }

    handleRoute(path) {
        const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
        const pageName = this.routes[cleanPath] || '404';
        this.loadPage(pageName);
    }

    loadPage(pageName) {
        const content = document.getElementById('app-content');
        
        // Loading Spinner
        content.innerHTML = `<div class="flex justify-center pt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>`;

        // Agar function pehle se memory mein hai, toh load karo
        const funcName = this.getFunctionName(pageName);
        if (window[funcName]) {
            this.renderPage(funcName);
            return;
        }

        // Agar nahi hai, toh file fetch karo
        const script = document.createElement('script');
        script.src = `pages/${pageName}.js`;
        
        script.onload = () => {
            this.renderPage(funcName);
        };
        
        script.onerror = () => {
            content.innerHTML = `<div class="text-center py-10">Error: File <b>pages/${pageName}.js</b> not found.</div>`;
        };
        
        document.head.appendChild(script);
    }

    getFunctionName(pageName) {
        const map = {
            'home': 'HomePage',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
            'rc20': 'Rc20Page', // <-- Ye match hona chahiye
            'wcc3': 'Wcc3Page',
            'contact': 'ContactPage',
            '404': 'NotFoundPage'
        };
        return map[pageName];
    }

    renderPage(funcName) {
        const content = document.getElementById('app-content');
        if (window[funcName]) {
            content.innerHTML = window[funcName]();
            window.scrollTo(0, 0);
        } else {
            content.innerHTML = `<div class="text-center py-10">Error: Function <b>${funcName}</b> not found. Check your JS file.</div>`;
        }
    }
}

// Router Start
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
