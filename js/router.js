class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        this.addRoute('/', 'home');
        this.addRoute('/cart', 'cart');
        this.addRoute('/checkout', 'checkout');
        this.addRoute('/rc20', 'rc20');
        this.addRoute('/wcc3', 'wcc3');
        this.addRoute('/rc25', 'rc25');
        this.addRoute('/contact', 'contact');
        this.addRoute('/profile', 'profile');
        this.addRoute('/admin', 'admin');
        this.addRoute('/creator', 'creator');
        this.addRoute('/creator-admin', 'creatorAdmin');
        this.addRoute('/terms', 'terms');
        
        // Redirects
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
        const pageName = this.routes[cleanPath] || '404'; // Default to '404'
        this.loadPage(pageName);
    }

    loadPage(pageName) {
        const content = document.getElementById('app-content');
        
        // Special Case for 404 (Don't look for file)
        if (pageName === '404') {
            this.renderPage('404');
            return;
        }

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
            // Fallback if file fails to load
            this.renderPage('404');
        };
        
        document.head.appendChild(script);
    }

    getFunctionName(pageName) {
        const map = {
            'home': 'HomePage',
            'rc20': 'Rc20Page',
            'wcc3': 'Wcc3Page',
            'rc25': 'Rc25Page',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
            'profile': 'ProfilePage',
            'admin': 'AdminPage',
            'contact': 'ContactPage',
            'terms': 'TermsPage',
            creator: 'CreatorPage',
            creatorAdmin: 'CreatorAdminPage',
            '404': 'NotFoundPage' // Virtual function
            
        };
        return map[pageName];
    }

    renderPage(funcName) {
        const content = document.getElementById('app-content');
        
        // Handle 404 explicitly
        if (funcName === '404' || funcName === 'NotFoundPage') {
            content.innerHTML = `
                <div class="text-center py-20 animate-fade-in">
                    <div class="text-6xl mb-4">😕</div>
                    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h2>
                    <p class="text-slate-500 mb-6">The page you are looking for doesn't exist.</p>
                    <a href="/" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition" data-link>Go Home</a>
                </div>`;
            return;
        }

        // Render Normal Page
        if (typeof funcName === 'string' && window[funcName]) {
            try {
                content.innerHTML = window[funcName]();
                window.scrollTo(0, 0);
                if(window.initializeComponents) window.initializeComponents();
            } catch(e) {
                console.error(e);
                content.innerHTML = `<div class="text-center py-20 text-red-500">Render Error: ${e.message}</div>`;
            }
        } else {
            content.innerHTML = `<div class="text-center py-20 text-red-500">Error: Function <b>${funcName}</b> not found.</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
