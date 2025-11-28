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

    // Creator routes
    this.addRoute('/creator', 'creator');
    this.addRoute('/creator-player', 'creator');
    this.addRoute('/creator-jersey', 'creator');
    this.addRoute('/creator-team', 'creator');
    this.addRoute('/creator-history', 'creator');
    this.addRoute('/creator-plans', 'creator');

    // Creator admin routes (both use pages/creatorAdmin.js)
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

        // Navigate
        this.navigateTo(href);

        // If the link is inside the mobile menu, close the menu
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && mobileMenu.contains(link)) {
          mobileMenu.classList.add('hidden');
        }
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

    // Show skeleton while we load JS for the page
    content.innerHTML = this.getSkeletonHtml(pageName);

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

  // ---------- SKELETONS ----------

  getSkeletonHtml(pageName) {
    // Home skeleton
    if (pageName === 'home') {
      return `
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
          <div class="mb-8 space-y-3 animate-pulse">
            <div class="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div class="h-4 w-72 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            ${[1,2,3].map(() => `
              <div class="app-card p-6">
                <div class="flex gap-3 mb-4 animate-pulse">
                  <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div class="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div class="flex gap-2 mt-2">
                      <div class="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div class="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div class="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse"></div>
                <div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                <div class="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
                <div class="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Detail pages (mods like rc20, rc24, rcswipe, wcc3, wcc2, rc25)
    const detailPages = ['rc20', 'rc24', 'rcswipe', 'wcc3', 'wcc2', 'rc25'];
    if (detailPages.includes(pageName)) {
      return `
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
          <div class="mb-6 h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>

          <div class="flex items-center gap-4 mb-8 animate-pulse">
            <div class="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex-1 space-y-3">
              <div class="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="flex gap-2 mt-2">
                <div class="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div class="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div class="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>

          <div class="app-card p-4 rounded-2xl mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div class="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
            <div class="h-48 w-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="app-card p-6 rounded-2xl animate-pulse">
              <div class="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div class="space-y-3">
                <div class="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div class="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div class="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>

            <div class="app-card p-6 rounded-2xl flex flex-col justify-between bg-slate-900 text-white animate-pulse">
              <div class="space-y-3">
                <div class="h-5 w-40 bg-slate-700 rounded"></div>
                <div class="h-4 w-5/6 bg-slate-700 rounded"></div>
              </div>
              <div class="mt-6 h-11 w-full bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      `;
    }

    // Generic skeleton for other pages (cart, checkout, profile, admin, etc.)
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <div class="space-y-4 animate-pulse">
          <div class="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div class="mt-8 space-y-4 animate-pulse">
          <div class="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    `;
  }

  // ---------- FUNCTION NAME RESOLUTION ----------

  getFunctionName(pageName) {
    // Special handling for /creator* routes
    if (pageName === 'creator') {
      const path = location.pathname.replace(/\/$/, ''); // remove trailing slash

      if (path === '/creator-player')  return 'CreatorPlayerPage';
      if (path === '/creator-jersey')  return 'CreatorJerseyPage';
      if (path === '/creator-team')    return 'CreatorTeamPage';
      if (path === '/creator-history') return 'CreatorHistoryPage';
      if (path === '/creator-plans')   return 'CreatorPlansPage';

      // default: /creator
      return 'CreatorPage';
    }

    // Special handling for /creator-admin* routes
    if (pageName === 'creatorAdmin') {
      const path = location.pathname.replace(/\/$/, '');

      if (path === '/creator-admin-user') {
        // page that shows a single user's creator requests
        return 'CreatorAdminUserRequestsPage';
      }

      // default: /creator-admin
      return 'CreatorAdminPage';
    }

    // Special handling for /admin* routes
    if (pageName === 'admin') {
      const path = location.pathname.replace(/\/$/, '');

      if (path === '/admin-orders')        return 'AdminOrdersPage';
      if (path === '/admin-sub-orders')    return 'AdminSubOrdersPage';
      if (path === '/admin-user-orders')   return 'AdminUserOrdersPage';
      if (path === '/admin-elite-wallets') return 'AdminEliteWalletsPage';

      // default: /admin
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
      'admin': 'AdminPage',        // fallback if special case not used
      'contact': 'ContactPage',
      'terms': 'TermsPage',
      'privacy': 'PrivacyPage',
      creatorAdmin: 'CreatorAdminPage', // fallback if special case not used
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
        if (window.initializeComponents) window.initializeComponents();
      } catch (e) {
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

  // If auth is already ready (user known), re-render current path
  if (window.authReady) {
    window.router.handleRoute(location.pathname);
  }
});
