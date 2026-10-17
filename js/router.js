// js/router.js

class Router {
  constructor() {
    this.routes = {};
    this.init();
  }

  init() {
    this.addRoute('/', 'home');
    this.addRoute('/cart', 'cart');
    this.addRoute('/checkout', 'checkout');
    this.addRoute('/order-details', 'orderDetails');
    this.addRoute('/rc20', 'rc20');
    this.addRoute('/rc24', 'rc24');
    this.addRoute('/rcswipe', 'rcswipe');
    this.addRoute('/wcc3', 'wcc3');
    this.addRoute('/wcc2', 'wcc2');
    this.addRoute('/rc25', 'rc25');

    this.addRoute('/contact', 'contact');
    this.addRoute('/profile', 'profile');

    // Admin routes
    this.addRoute('/admin', 'admin');
    this.addRoute('/admin-orders', 'admin');
    this.addRoute('/admin-sub-orders', 'admin');
    this.addRoute('/admin-user-orders', 'admin');
    this.addRoute('/admin-elite-wallets', 'admin');
    this.addRoute('/admin-mods', 'admin');
    this.addRoute('/admin-payments', 'admin');

    // Creator routes
    this.addRoute('/creator', 'creator');
    this.addRoute('/creator-player', 'creator');
    this.addRoute('/creator-jersey', 'creator');
    this.addRoute('/creator-team', 'creator');
    this.addRoute('/creator-history', 'creator');
    this.addRoute('/creator-plans', 'creator');

    // Creator admin routes
    this.addRoute('/creator-admin', 'creatorAdmin');
    this.addRoute('/creator-admin-user', 'creatorAdmin');

    this.addRoute('/privacy', 'privacy');
    this.addRoute('/terms', 'terms');

    // Redirects
    this.addRoute('/plans', 'cart');

    window.addEventListener('popstate', () => this.handleRoute(location.pathname));

    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigateTo(href);

        // If mobile menu open, close it
        if (window.closeMobileMenu) window.closeMobileMenu();
      }
    });

    this.handleRoute(location.pathname);
  }

  addRoute(path, pageName) {
    this.routes[path] = pageName;
  }

  navigateTo(path) {
    if (location.pathname === path) return;
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

    // Special Case for 404
    if (pageName === '404') {
      this.renderPage('404');
      return;
    }

    const funcName = this.getFunctionName(pageName);

    // ZERO-LAG IN-MEMORY CACHE:
    // If the page function is already loaded into window, render immediately without flashing skeleton!
    if (typeof window[funcName] === 'function') {
      if (window.startPageLoad) window.startPageLoad();
      this.renderPage(funcName);
      return;
    }

    // Only show skeleton on cold-load when script needs to be fetched from network
    if (window.startPageLoad) window.startPageLoad();
    if (content) {
      content.innerHTML = this.getSkeletonHtml(pageName);
    }

    // Prevent duplicate script tag downloads
    const scriptId = `script-page-${pageName}`;
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener('load', () => this.renderPage(funcName), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `pages/${pageName}.js`;

    script.onload = () => {
      this.renderPage(funcName);
    };

    script.onerror = () => {
      this.renderPage('404');
    };

    document.head.appendChild(script);
  }

  // ---------- SKELETONS ----------
  getSkeletonHtml(pageName) {
    if (pageName === 'home') {
      return `
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
          <div class="flex flex-col items-center mb-10 space-y-4">
            <div class="h-8 w-44 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
            <div class="h-10 w-72 sm:w-96 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl"></div>
            <div class="h-4 w-60 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            ${[1, 2, 3].map(() => `
              <div class="apple-glass-card p-6 space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 w-28 bg-slate-200/80 dark:bg-slate-800/80 rounded"></div>
                    <div class="h-3 w-36 bg-slate-200/80 dark:bg-slate-800/80 rounded"></div>
                  </div>
                </div>
                <div class="h-36 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
                <div class="h-3 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded"></div>
                <div class="h-10 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div class="apple-glass-card p-8 space-y-6">
          <div class="h-7 w-48 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
          <div class="h-4 w-72 bg-slate-200/80 dark:bg-slate-800/80 rounded"></div>
          <div class="space-y-3 pt-4">
            <div class="h-12 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
            <div class="h-12 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- FUNCTION NAME RESOLUTION ----------
  getFunctionName(pageName) {
    if (pageName === 'creator') {
      const path = location.pathname.replace(/\/$/, '');
      if (path === '/creator-player')  return 'CreatorPlayerPage';
      if (path === '/creator-jersey')  return 'CreatorJerseyPage';
      if (path === '/creator-team')    return 'CreatorTeamPage';
      if (path === '/creator-history') return 'CreatorHistoryPage';
      if (path === '/creator-plans')   return 'CreatorPlansPage';
      return 'CreatorPage';
    }

    if (pageName === 'creatorAdmin') {
      const path = location.pathname.replace(/\/$/, '');
      if (path === '/creator-admin-user') return 'CreatorAdminUserRequestsPage';
      return 'CreatorAdminPage';
    }

    if (pageName === 'admin') {
      const path = location.pathname.replace(/\/$/, '');
      if (path === '/admin-orders')        return 'AdminOrdersPage';
      if (path === '/admin-sub-orders')    return 'AdminSubOrdersPage';
      if (path === '/admin-user-orders')   return 'AdminUserOrdersPage';
      if (path === '/admin-elite-wallets') return 'AdminEliteWalletsPage';
      if (path === '/admin-mods')          return 'AdminModsPage';
      if (path === '/admin-payments')      return 'AdminPaymentsPage';
      return 'AdminPage';
    }

    const map = {
      'home': 'HomePage',
      'rc20': 'Rc20Page',
      'rc24': 'Rc24Page',
      'rcswipe': 'RcSWIPEPage',
      'wcc3': 'Wcc3Page',
      'wcc2': 'Wcc2Page',
      'rc25': 'Rc25Page',
      'cart': 'CartPage',
      'checkout': 'CheckoutPage',
      'profile': 'ProfilePage',
      'orderDetails': 'OrderDetailsPage',
      'admin': 'AdminPage',
      'contact': 'ContactPage',
      'terms': 'TermsPage',
      'privacy': 'PrivacyPage',
      'creatorAdmin': 'CreatorAdminPage',
      '404': 'NotFoundPage'
    };
    return map[pageName];
  }

  renderPage(funcName) {
    const content = document.getElementById('app-content');
    if (!content) return;

    // Handle 404
    if (funcName === '404' || funcName === 'NotFoundPage') {
      content.innerHTML = `
        <div class="apple-page-enter text-center py-20">
          <div class="text-6xl mb-4">🏏</div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-2">Page Not Found</h2>
          <p class="text-slate-500 mb-6">The requested page doesn't exist.</p>
          <a href="/" class="btn bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20" data-link>Back to Home</a>
        </div>`;
      if (window.finishPageLoad) window.finishPageLoad();
      return;
    }

    if (typeof funcName === 'string' && typeof window[funcName] === 'function') {
      try {
        const pageHtml = window[funcName]();
        content.innerHTML = `<div class="apple-page-enter">${pageHtml}</div>`;
        window.scrollTo({ top: 0, behavior: 'instant' });

        if (window.initializeComponents) {
          window.initializeComponents();
        }
      } catch (e) {
        console.error("Page render error:", e);
        content.innerHTML = `<div class="text-center py-20 text-red-500 font-bold">Render error: ${e.message}</div>`;
      }
    } else {
      content.innerHTML = `<div class="text-center py-20 text-red-500 font-bold">Error: Page handler <b>${funcName}</b> not found.</div>`;
    }

    if (window.finishPageLoad) {
      window.finishPageLoad();
    }
  }
}

// Router initialization
document.addEventListener('DOMContentLoaded', () => {
  window.router = new Router();
});
