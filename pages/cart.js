function CartPage() {
    const cart = window.cart || [];

    if (cart.length === 0) {
        return `
        <div class="max-w-md mx-auto text-center py-20 animate-fade-in">
            <div class="bg-slate-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-icons text-4xl text-slate-400">shopping_bag</span>
            </div>
            <h2 class="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p class="text-slate-500 mb-8">Looks like you haven't added any mods yet.</p>
            <button onclick="window.router.navigateTo('/')" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition">
                Browse Mods
            </button>
        </div>`;
    }

    const item = cart[0]; // Single item logic for now

    return `
    <div class="max-w-3xl mx-auto animate-fade-in">
        <h1 class="text-3xl font-bold mb-8">Your Cart</h1>

        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="bg-blue-50 dark:bg-slate-900 p-3 rounded-xl">
                        <span class="material-icons text-blue-600">extension</span>
                    </div>
                    <div>
                        <div class="font-bold text-lg capitalize">${item.gameId} Mod Menu</div>
                        <div class="text-slate-500 text-sm">${item.name}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-xl">₹${item.price}</div>
                    <button onclick="window.cart = []; window.router.navigateTo('/cart'); updateCartBadge();" class="text-red-500 text-xs hover:underline mt-1">Remove</button>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
                <div class="text-slate-500 text-sm">Total Amount</div>
                <div class="text-3xl font-bold">₹${item.price}</div>
            </div>
            <button onclick="window.router.navigateTo('/checkout')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-600/20 transition transform hover:-translate-y-1 flex items-center gap-2">
                Proceed to Checkout <span class="material-icons">arrow_forward</span>
            </button>
        </div>
    </div>
    `;
}