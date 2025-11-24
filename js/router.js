class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        this.addRoute('/', 'home');
        this.addRoute('/rc20', 'rc20');
        this.addRoute('/wcc3', 'wcc3');
        this.addRoute('/cart', 'cart');
        this.addRoute('/checkout', 'checkout');
        this.addRoute('/contact', 'contact');
        
        this.addRoute('/plans', 'cart'); 

        window.addEventListener('popstate', () => this.handleRoute(location.pathname));
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute('href'));
            }
        });

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
        content.innerHTML = `<div class="flex justify-center pt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>`;

        const funcName = this.getFunctionName(pageName);
        if (window[funcName]) {
            this.renderPage(funcName);
            return;
        }

        const script = document.createElement('script');
        script.src = `pages/${pageName}.js`;
        
        script.onload = () => {
            this.renderPage(funcName);
        };
        
        script.onerror = () => {
            content.innerHTML = `<div class="text-center py-20">Error: File <b>pages/${pageName}.js</b> not found.</div>`;
        };
        
        document.head.appendChild(script);
    }

    getFunctionName(pageName) {
        const map = {
            'home': 'HomePage',
            'rc20': 'Rc20Page',
            'wcc3': 'Wcc3Page',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
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
            if(window.initializeComponents) window.initializeComponents();
        } else {
            content.innerHTML = `<div class="text-center py-20">Error: Function <b>${funcName}</b> not found.</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
