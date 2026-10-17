// pages/cart.js

function CartPage() {
  const cart = window.cart || [];

  const headerHtml = `
    <div class="flex items-center justify-between mb-8 pt-4">
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Cart</h1>
      
      <button onclick="window.router.navigateTo('/profile')" 
              class="apple-glass-pill py-2 px-4 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-xs font-bold shadow-sm active:scale-95">
        <span class="material-icons text-sm">history</span>
        <span>Order History</span>
      </button>
    </div>
  `;

  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return `
      <div class="max-w-2xl mx-auto px-4 pb-20">
        ${headerHtml}

        <div class="apple-glass-card text-center py-20 px-6">
          <div class="w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <span class="material-icons text-5xl text-blue-600 dark:text-blue-400">shopping_bag</span>
          </div>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Your cart is empty</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
            You haven't added any mods to your cart yet. Browse our verified mods to upgrade your game today.
          </p>
          <button onclick="window.router.navigateTo('/')" 
                  class="apple-btn-primary px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 inline-flex items-center gap-2">
            <span class="material-icons text-sm">explore</span>
            <span>Browse All Mods</span>
          </button>
        </div>
      </div>`;
  }

  const item = cart[0];

  // --- FILLED STATE ---
  return `
    <div class="max-w-2xl mx-auto px-4 pb-20">
      ${headerHtml}

      <div class="apple-glass-card p-6 mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center gap-5">
          <div class="relative flex-shrink-0">
            <img src="${item.image}"
                 alt="${item.gameName}"
                 class="w-20 h-20 rounded-2xl object-cover border border-white/30 dark:border-slate-700 shadow-sm"
                 onerror="this.src='/assets/icons/stark-32.png'">
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">${item.gameName}</h3>
            <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${item.planName} License</span>
              <span class="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span class="text-xs font-bold text-emerald-500 uppercase tracking-wider">Instant Access</span>
            </div>
            
            <button onclick="window.cart = []; updateCartBadge(); window.router.navigateTo('/cart');"
                    class="mt-3 text-red-500 hover:text-red-600 text-xs font-bold inline-flex items-center gap-1 transition-colors">
              <span class="material-icons text-sm">delete_outline</span>
              <span>Remove</span>
            </button>
          </div>

          <div class="text-center sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 w-full sm:w-auto">
            <div class="text-2xl font-black text-slate-900 dark:text-white">₹${item.price}</div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Inclusive of GST</div>
          </div>
        </div>
      </div>

      <div class="apple-glass-card p-6 sm:p-8">
        <div class="space-y-3 mb-6">
          <div class="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span>Subtotal</span>
            <span class="font-bold text-slate-900 dark:text-white">₹${item.price}</span>
          </div>
          <div class="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span>Platform Fee</span>
            <span class="text-emerald-500 font-bold">FREE</span>
          </div>
          <div class="h-px bg-black/5 dark:bg-white/10 my-3"></div>
          <div class="flex justify-between items-end">
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</div>
              <div class="text-3xl font-black text-slate-900 dark:text-white">₹${item.price}</div>
            </div>
            
            <button onclick="window.router.navigateTo('/checkout')"
                    class="apple-btn-primary px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <span>Checkout</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div class="flex flex-wrap justify-center gap-6 pt-4 border-t border-black/5 dark:border-white/10 text-slate-400">
          <div class="flex items-center gap-1.5">
            <span class="material-icons text-sm text-blue-500">verified_user</span>
            <span class="text-[11px] font-semibold">100% Secure Payment</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-icons text-sm text-amber-500">bolt</span>
            <span class="text-[11px] font-semibold">Instant Key Delivery</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.CartPage = CartPage;
