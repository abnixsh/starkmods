class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        // Routes Definition
        this.addRoute('/', 'home');
        this.addRoute('/cart', 'cart');        // New Cart Page
        this.addRoute('/checkout', 'checkout'); // New Checkout Page
        this.addRoute('/rc20', 'rc20');
        this.addRoute('/wcc3', 'wcc3');
        this.addRoute('/contact', 'contact');
        
        // Fallback
        this.addRoute('/404', '404');

        window.addEventListener('popstate', () => this.handleRoute(location.pathname));
        this.handleRoute(location.pathname);
        
        // Global Click Handler
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute('href'));
            }
        });
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

    async loadPage(pageName) {
        // Show Loader
        const content = document.getElementById('app-content');
        // content.innerHTML = `<div class="flex justify-center pt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>`;

        // Dynamic Script Loading
        if (!window[`${pageName}PageLoaded`]) {
            const script = document.createElement('script');
            script.src = `pages/${pageName}.js`;
            script.onload = () => {
                window[`${pageName}PageLoaded`] = true;
                this.renderPage(pageName);
            };
            script.onerror = () => {
                content.innerHTML = `<div class="text-center py-20"><h2>Page Not Found</h2><button onclick="window.history.back()" class="text-blue-500">Go Back</button></div>`;
            };
            document.head.appendChild(script);
        } else {
            this.renderPage(pageName);
        }
    }

    renderPage(pageName) {
        const content = document.getElementById('app-content');
        
        // Mapping Page Names to Function Names
        const funcMap = {
            'home': 'HomePage',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
            'rc20': 'Rc20Page',
            'wcc3': 'Wcc3Page',
            'contact': 'ContactPage',
            '404': () => `<div class="text-center py-20">404 - Not Found</div>`
        };

        const funcName = funcMap[pageName];
        
        if (typeof funcName === 'string' && window[funcName]) {
            content.innerHTML = window[funcName]();
            window.scrollTo(0, 0);
        } else if (typeof funcName === 'function') {
            content.innerHTML = funcName();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
