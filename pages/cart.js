function CartPage() {
  const cart = window.cart || [];

  // Helper for animations
  const styles = `
    <style>
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-cart { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .stagger-1 { animation-delay: 0.1s; opacity: 0; }
      .stagger-2 { animation-delay: 0.2s; opacity: 0; }
    </style>
  `;

  if (cart.length === 0) {
    return `
      ${styles}
      <div class="max-w-md mx-auto text-center py-24 animate-cart">
        <div class="relative w-32 h-32 mx-auto mb-8">
          <div class="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div class="relative bg-white dark:bg-slate-800 w-32 h-32 rounded-full flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
            <span class="material-icons text-6xl text-slate-300 dark:text-slate-600">shopping_cart</span>
          </div>
        </div>
        <h2 class="text-3xl font-extrabold mb-3 text-slate-800 dark:text-white">Your cart is empty</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Looks like you haven't picked a mod yet. <br>Upgrade your gameplay today!
        </p>
        <button onclick="window.router.navigateTo('/')" 
                class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
          <span class="material-icons text-sm">explore</span>
          Browse All Mods
        </button>
      </div>`;
  }

  const item = cart[0];

  return `
    ${styles}
    <div class="max-w-3xl mx-auto px-4 pb-20">
      <div class="flex items-center justify-between mb-8 animate-cart">
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Your Cart</h1>
        <span class="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
          1 ITEM
        </span>
      </div>

      <div class="animate-cart stagger-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="relative group">
            <div class="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <img src="${item.image}"
                 alt="${item.gameName}"
                 class="relative w-20 h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-600 z-10"
                 onerror="this.src='https://placehold.co/80x80?text=MOD'">
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h3 class="text-xl font-bold text-slate-800 dark:text-white">${item.gameName}</h3>
            <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">${item.planName} License</span>
                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span class="text-xs font-bold text-green-500 uppercase tracking-wider">Instant Access</span>
            </div>
            
            <button onclick="window.cart = []; updateCartBadge(); window.router.navigateTo('/cart');"
                    class="mt-4 text-red-400 hover:text-red-500 text-xs font-bold flex items-center justify-center sm:justify-start gap-1 transition-colors mx-auto sm:mx-0">
              <span class="material-icons text-sm">delete_outline</span>
              Remove from cart
            </button>
          </div>

          <div class="text-center sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto">
            <div class="text-2xl font-black text-slate-900 dark:text-white">₹${item.price}</div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Inclusive of GST</div>
          </div>
        </div>
      </div>

      <div class="animate-cart stagger-2 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
        <div class="space-y-4 mb-8">
            <div class="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Subtotal</span>
                <span>₹${item.price}</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Platform Fee</span>
                <span class="text-green-500 font-bold">FREE</span>
            </div>
            <div class="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>
            <div class="flex justify-between items-end">
                <div>
                    <div class="text-sm font-bold text-slate-400 uppercase tracking-tighter">Grand Total</div>
                    <div class="text-4xl font-black text-slate-900 dark:text-white">₹${item.price}</div>
                </div>
                
                <button onclick="window.router.navigateTo('/checkout')"
                        class="relative group overflow-hidden bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-600/30 transition-all transform hover:-translate-y-1 active:translate-y-0">
                    <span class="relative z-10 flex items-center gap-2">
                        Checkout <span class="material-icons">arrow_forward</span>
                    </span>
                    <div class="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </button>
            </div>
        </div>
        
        <div class="flex flex-wrap justify-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2 text-slate-400">
                <span class="material-icons text-sm">verified_user</span>
                <span class="text-[10px] font-bold uppercase">Secure Payment</span>
            </div>
            <div class="flex items-center gap-2 text-slate-400">
                <span class="material-icons text-sm">bolt</span>
                <span class="text-[10px] font-bold uppercase">Instant Delivery</span>
            </div>
        </div>
      </div>
    </div>
  `;
}

window.CartPage = CartPage;

