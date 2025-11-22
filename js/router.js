// js/router.js
class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        this.addRoute('/', () => this.loadPageComponent('home'));
        this.addRoute('/plans', () => this.loadPageComponent('plans'));
        this.addRoute('/contact', () => this.loadPageComponent('contact'));
        this.addRoute('/help', () => this.loadPageComponent('help'));
        this.addRoute('/about', () => this.loadPageComponent('about'));
        this.addRoute('/privacy', () => this.loadPageComponent('privacy'));
        this.addRoute('/terms', () => this.loadPageComponent('terms'));
        
        // CHANGED THIS LINE
        this.addRoute('/rc20', () => this.loadPageComponent('rc20'));
        this.addRoute('/wcc3', () => this.loadPageComponent('wcc3'));
        
        this.addRoute('/chamsmenu', () => this.loadPageComponent('chamsmenu'));
        this.addRoute('/esptester', () => this.loadPageComponent('esptester'));
        this.addRoute('/404', () => Promise.resolve(`<div class='text-center py-20'>404 Not Found</div>`));

        window.addEventListener('popstate', () => this.handleRoute(location.pathname));
        this.handleRoute(location.pathname);
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
                this.navigateTo(link.getAttribute('href'));
            }
        });
    }

    addRoute(path, loader) { this.routes[path] = loader; }

    navigateTo(path) {
        history.pushState(null, null, path);
        this.handleRoute(path);
    }

    handleRoute(path) {
        const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
        const routeLoader = this.routes[normalizedPath] || this.routes['/404'];
        routeLoader().then(content => {
            const container = document.getElementById('app-content');
            container.innerHTML = content;
            window.scrollTo(0,0);
            if(window.initializeComponents) window.initializeComponents();
        });
    }

    async loadPageComponent(pageName) {
        // Simple loader mapping
        const script = document.createElement('script');
        script.src = `pages/${pageName}.js`;
        
        return new Promise((resolve, reject) => {
            script.onload = () => {
                let functionName;
                // Add mapping for RC20
                if (pageName === 'rc20') functionName = 'Rc20Page';
                else if (pageName === 'wcc3') functionName = 'Wcc3Page';


                else if (pageName === 'home') functionName = 'HomePage';
                else functionName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
                
                if (window[functionName]) resolve(window[functionName]());
                else resolve("Error: Page function not found");
            };
            document.head.appendChild(script);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { window.router = new Router(); });
