class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        // --- Routes List ---
        this.addRoute('/', 'home');
        this.addRoute('/cart', 'cart');
        this.addRoute('/checkout', 'checkout');
        this.addRoute('/rc20', 'rc20');
        this.addRoute('/wcc3', 'wcc3');
        this.addRoute('/rc25', 'rc25');
        this.addRoute('/contact', 'contact');
        this.addRoute('/profile', 'profile');
        this.addRoute('/admin', 'admin');
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
        
        // Show Loading Animation
        content.innerHTML = `<div class="flex justify-center pt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>`;

        // 1. Function Name Map
        const funcMap = {
            'home': 'HomePage',
            'rc20': 'Rc20Page',
            'wcc3': 'Wcc3Page',
            'rc25': 'Rc25Page',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
            'profile': 'ProfilePage',
            'admin': 'AdminPage',
            'contact': 'ContactPage',
            '404': 'NotFoundPage'
        };

        const funcName = funcMap[pageName];

        // 2. Agar Function Pehle se Loaded hai
        if (window[funcName]) {
            this.renderPage(funcName);
            return;
        }

        // 3. Agar nahi hai, toh File Load karo
        const script = document.createElement('script');
        script.src = `pages/${pageName}.js`;
        
        script.onload = () => {
            // Script load hone ke baad check karo
            if (window[funcName]) {
                this.renderPage(funcName);
            } else {
                content.innerHTML = `<div class="text-center py-20 text-red-500">Error: Function <b>${funcName}</b> not found in file.</div>`;
            }
        };
        
        script.onerror = () => {
            content.innerHTML = `
                <div class="text-center py-20">
                    <h2 class="text-xl font-bold text-red-500">Page Not Found</h2>
                    <p class="text-slate-500">Could not load: <b>pages/${pageName}.js</b></p>
                    <a href="/" class="text-blue-600 underline mt-4 block" data-link>Go Home</a>
                </div>`;
        };
        
        document.head.appendChild(script);
    }

    renderPage(funcName) {
        const content = document.getElementById('app-content');
        try {
            content.innerHTML = window[funcName]();
            window.scrollTo(0, 0);
            if(window.initializeComponents) window.initializeComponents();
        } catch (e) {
            console.error(e);
            content.innerHTML = `<div class="text-center py-10 text-red-500">Render Error: ${e.message}</div>`;
        }
    }
}

// Start Router
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
