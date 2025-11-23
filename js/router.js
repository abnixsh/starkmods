class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        // --- 1. Routes Define Karo ---
        this.addRoute('/', 'home');
        this.addRoute('/cart', 'cart');
        this.addRoute('/checkout', 'checkout');
        this.addRoute('/rc20', 'rc20');
        this.addRoute('/wcc3', 'wcc3');
        this.addRoute('/contact', 'contact');
        
        // Handle Back/Forward Buttons
        window.addEventListener('popstate', () => this.handleRoute(location.pathname));
        
        // Handle Clicks (Link se page badalna)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute('href'));
            }
        });

        // Load First Page
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
        const pageName = this.routes[cleanPath] || '404'; // Agar route nahi mila to 404
        this.loadPage(pageName);
    }

    loadPage(pageName) {
        const content = document.getElementById('app-content');
        
        // 1. Loading Dikhayein
        content.innerHTML = `<div class="flex justify-center pt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>`;

        // 2. Agar Script pehle se load hai, to direct render karo
        if (window[`${pageName}PageLoaded`]) {
            this.renderPage(pageName);
            return;
        }

        // 3. Nayi Script Load Karo
        const script = document.createElement('script');
        script.src = `pages/${pageName}.js`; // <--- Check karo ye path sahi ho
        
        script.onload = () => {
            window[`${pageName}PageLoaded`] = true;
            this.renderPage(pageName);
        };
        
        script.onerror = () => {
            console.error(`Error: Could not load pages/${pageName}.js`);
            content.innerHTML = `
                <div class="text-center py-20">
                    <h2 class="text-2xl font-bold text-red-500 mb-2">Error Loading Page</h2>
                    <p class="text-slate-500">Could not find file: <b>pages/${pageName}.js</b></p>
                    <p class="text-sm text-slate-400 mt-2">Please check if the file exists in 'pages' folder.</p>
                    <button onclick="window.location.href='/'" class="mt-4 text-blue-600 underline">Go Home</button>
                </div>`;
        };
        
        document.head.appendChild(script);
    }

    renderPage(pageName) {
        const content = document.getElementById('app-content');
        
        // Function Names Mapping (File Name -> Function Name)
        const funcMap = {
            'home': 'HomePage',
            'cart': 'CartPage',
            'checkout': 'CheckoutPage',
            'rc20': 'Rc20Page',
            'wcc3': 'Wcc3Page',
            'contact': 'ContactPage',
            '404': () => `<div class="text-center py-20 font-bold text-xl">404 - Page Not Found</div>`
        };

        const funcName = funcMap[pageName];
        
        // Function Call Karo
        if (typeof funcName === 'string' && window[funcName]) {
            content.innerHTML = window[funcName]();
            window.scrollTo(0, 0);
        } else if (typeof funcName === 'function') {
            content.innerHTML = funcName();
        } else {
            content.innerHTML = `<div class="text-center py-10 text-red-500">Error: Function <b>${funcName}</b> not found in <b>${pageName}.js</b></div>`;
        }
    }
}

// Start Router
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
