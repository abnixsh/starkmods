function CheckoutPage() {
    if (!window.cart || window.cart.length === 0) {
        window.router.navigateTo('/cart');
        return '';
    }

    const item = window.cart[0];
    
    
    setTimeout(() => window.updatePaymentMethod('upi'), 50);

    return `
    <div class="max-w-4xl mx-auto animate-fade-in">
        
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold">Secure Checkout</h1>
            <p class="text-slate-500 mt-2">Complete your purchase safely.</p>
        </div>

        <div class="grid md:grid-cols-12 gap-8">
            
            <!-- LEFT: Payment Methods -->
            <div class="md:col-span-7">
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 class="font-bold text-lg mb-4">Select Payment Method</h3>
                    
                    <!-- LOGO GRID (Images from assets/icons/) -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        
                        <!-- UPI Button -->
                        <button id="pay-upi" onclick="window.updatePaymentMethod('upi')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-500 transition flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800">
                            <img src="assets/icons/pay_upi.png" class="h-8 object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                            <span class="material-icons text-green-600 text-3xl hidden">qr_code_2</span> <!-- Fallback Icon -->
                            <span class="text-xs font-bold mt-1">UPI / QR</span>
                        </button>

                        <!-- EasyPaisa Button -->
                        <button id="pay-ep" onclick="window.updatePaymentMethod('ep')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-green-500 transition flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800">
                            <img src="assets/icons/pay_easypaisa.png" class="h-8 object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                            <span class="material-icons text-green-600 text-3xl hidden">account_balance_wallet</span>
                            <span class="text-xs font-bold mt-1">EasyPaisa</span>
                        </button>

                        <!-- PayPal Button -->
                        <button id="pay-paypal" onclick="window.updatePaymentMethod('paypal')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-600 transition flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800">
                            <img src="assets/icons/pay_paypal.png" class="h-8 object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                            <span class="material-icons text-blue-600 text-3xl hidden">public</span>
                            <span class="text-xs font-bold mt-1">PayPal</span>
                        </button>

                        <!-- bKash Button -->
                        <button id="pay-bkash" onclick="window.updatePaymentMethod('bkash')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-pink-500 transition flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800">
                            <img src="assets/icons/pay_bkash.png" class="h-8 object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                            <span class="material-icons text-pink-500 text-3xl hidden">payments</span>
                            <span class="text-xs font-bold mt-1">bKash</span>
                        </button>
                    </div>

                    <!-- Dynamic Details Box -->
                    <div id="payment-details" class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700 min-h-[200px] flex flex-col items-center justify-center">
                        <!-- Javascript will fill this -->
                    </div>
                </div>
            </div>

            <!-- RIGHT: Summary -->
            <div class="md:col-span-5">
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg sticky top-24">
                    <h3 class="font-bold text-lg mb-4">Order Summary</h3>
                    
                    <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                        <span class="text-slate-500">Item</span>
                        <span class="font-medium">${item.gameId.toUpperCase()} Mod</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                        <span class="text-slate-500">Plan</span>
                        <span class="font-medium">${item.name}</span>
                    </div>
                    
                    <div class="flex justify-between py-4 text-xl font-bold">
                        <span>Total</span>
                        <span class="text-blue-600">₹${item.price}</span>
                    </div>

                    <button onclick="window.confirmOrder()" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
                        <span class="material-icons">check_circle</span> I Have Paid
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-3">Clicking button will open Telegram.</p>
                </div>
            </div>

        </div>
    </div>
    `;
}

window.updatePaymentMethod = function(method) {
    window.selectedMethod = method;
    const item = window.cart[0];
    const box = document.getElementById('payment-details');
    
  
    document.querySelectorAll('.payment-tab').forEach(el => {
        el.classList.remove('border-blue-600', 'ring-2', 'bg-blue-50', 'dark:bg-slate-700');
        el.classList.add('border-slate-200', 'dark:border-slate-700');
    });
    
    
    const active = document.getElementById(`pay-${method}`);
    if(active) {
        active.classList.remove('border-slate-200', 'dark:border-slate-700');
        active.classList.add('border-blue-600', 'ring-2', 'bg-blue-50', 'dark:bg-slate-700');
    }

    
    if(method === 'upi') {
        box.innerHTML = `
            <div class="bg-white p-2 rounded-lg mb-3 shadow-sm border inline-block">
                <!-- QR Code Image Path Fixed -->
                <img src="assets/icons/qrcode.jpg" class="w-40 h-40 object-contain" onerror="this.src='https://placehold.co/150?text=QR+Missing'">
            </div>
            <div class="font-mono font-bold bg-white dark:bg-black/30 border px-4 py-2 rounded-lg select-all mb-2 text-lg">
                starkmods@upi
            </div>
            <p class="text-xs text-slate-500">Scan via Paytm, PhonePe, GPay</p>
            <p class="text-sm font-bold text-blue-600 mt-1">Pay: ₹${item.price}</p>
        `;
    } else if(method === 'paypal') {
        const usd = (item.price / 85).toFixed(2);
        box.innerHTML = `
            <img src="assets/icons/pay_paypal.png" class="h-12 mb-3 object-contain">
            <h4 class="font-bold text-lg">PayPal International</h4>
            <div class="font-mono font-bold bg-slate-100 dark:bg-black/30 px-4 py-2 rounded-lg mt-3 select-all border">
                pay@starkmods.store
            </div>
            <p class="text-sm text-slate-500 mt-3">Amount to pay: <strong class="text-blue-600">$${usd}</strong></p>
            <a href="#" class="text-xs text-blue-500 underline mt-1">Click to Pay Directly</a>
        `;
    } else if(method === 'ep') {
        const pkr = Math.floor(item.price * 3.3);
        box.innerHTML = `
            <img src="assets/icons/pay_easypaisa.png" class="h-12 mb-3 object-contain">
            <h4 class="font-bold text-lg text-green-600">EasyPaisa / JazzCash</h4>
            <div class="font-mono text-2xl font-bold bg-slate-100 dark:bg-black/30 px-4 py-2 rounded-lg mt-3 select-all border tracking-wider">
                0300-1234567
            </div>
            <p class="text-sm text-slate-500 mt-2">Account Title: <strong>Stark Admin</strong></p>
            <p class="text-sm font-bold text-green-600 mt-1">Amount: PKR ${pkr}</p>
        `;
    } else {
        const taka = Math.floor(item.price * 1.4);
        box.innerHTML = `
            <img src="assets/icons/pay_bkash.png" class="h-12 mb-3 object-contain">
            <h4 class="font-bold text-lg text-pink-600">bKash Personal</h4>
            <div class="font-mono text-2xl font-bold bg-slate-100 dark:bg-black/30 px-4 py-2 rounded-lg mt-3 select-all border tracking-wider">
                017-12345678
            </div>
            <p class="text-xs text-slate-500 mt-2">Use "Send Money" Option</p>
            <p class="text-sm font-bold text-pink-600 mt-1">Amount: ৳${taka}</p>
        `;
    }
};

window.confirmOrder = function() {
    const item = window.cart[0];
    const method = window.selectedMethod.toUpperCase();
    const msg = `ORDER VERIFICATION:\nProduct: ${item.gameId.toUpperCase()} Mod\nPlan: ${item.name}\nPrice: ${item.price}\nMethod: ${method}\n\nI have completed the payment. Sending proof now.`;
    window.open(`https://t.me/AbnixSH?text=${encodeURIComponent(msg)}`, '_blank');
};
