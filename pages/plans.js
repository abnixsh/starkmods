// pages/plans.js

// --- GLOBAL FUNCTIONS (Window par attach kiye taaki Router error na de) ---

// Current state store karne ke liye variables
window.currentPaymentMethod = 'upi';
window.planBasePrice = 250; // Default base price in INR

// Modal Open karne ka function
window.openPaymentModal = function(planName, price) {
    const modal = document.getElementById('payment-modal');
    const planTitle = document.getElementById('modal-plan-title');
    
    // Price ko Number mein convert karte hain calculation ke liye
    // Agar string '₹250' aayi hai to use 250 banayenge
    let numericPrice = price;
    if (typeof price === 'string') {
        numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
    }
    
    // State update
    window.planBasePrice = numericPrice;
    if(planTitle) planTitle.innerText = planName;
    
    // Default UPI tab load karein
    window.updatePaymentDetails('upi');
    
    // Modal dikhayein
    if(modal) modal.classList.remove('hidden');
};

// Modal Close karne ka function
window.closePaymentModal = function() {
    const modal = document.getElementById('payment-modal');
    if(modal) modal.classList.add('hidden');
};

// Tabs switch karne ka logic (Magic yahan hai)
window.updatePaymentDetails = function(method) {
    window.currentPaymentMethod = method;
    const priceDisplay = document.getElementById('modal-plan-price');
    const contentArea = document.getElementById('payment-method-content');
    
    // 1. Buttons ka color reset karein
    const buttons = document.querySelectorAll('.pay-tab-btn');
    buttons.forEach(btn => {
        // Inactive Style
        btn.className = 'pay-tab-btn flex-1 py-2 px-2 rounded-lg text-xs font-bold whitespace-nowrap bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 transition cursor-pointer border border-transparent';
    });
    
    // 2. Active button ko highlight karein
    const activeBtn = document.getElementById(`btn-${method}`);
    if(activeBtn) {
        // Active Style (Blue)
        activeBtn.className = 'pay-tab-btn flex-1 py-2 px-2 rounded-lg text-xs font-bold whitespace-nowrap bg-blue-600 text-white shadow-lg transition cursor-pointer transform scale-105';
    }

    // 3. Price Calculation (Currency Conversion)
    const inr = window.planBasePrice;
    let finalPrice = '';
    let htmlContent = '';
    
    if (method === 'upi') {
        finalPrice = `₹${inr}`;
        htmlContent = `
            <div class="text-center animate-fade-in">
                <div class="bg-white p-2 rounded-lg inline-block mb-3 border border-slate-200 shadow-sm">
                    <img src="assets/img/qrcode.jpg" alt="UPI QR" class="w-40 h-40 object-contain">
                </div>
                <div class="bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <p class="font-mono text-sm font-bold select-all">starkmods@upi</p>
                </div>
                <p class="text-xs text-slate-500 mt-2">Paytm / PhonePe / GPay / Amazon Pay</p>
            </div>`;
            
    } else if (method === 'easypaisa') {
        finalPrice = `PKR ${Math.floor(inr * 3.3)}`; // Approx Rate
        htmlContent = `
            <div class="text-center py-4 animate-fade-in">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-3xl">account_balance_wallet</span>
                </div>
                <p class="text-sm text-slate-500 mb-1">EasyPaisa / JazzCash Number</p>
                <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 mb-2">
                    <p class="font-mono text-xl font-bold select-all">0300-1234567</p>
                </div>
                <p class="text-xs text-slate-400">Account Name: Stark Admin</p>
            </div>`;
            
    } else if (method === 'bkash') {
        finalPrice = `৳${Math.floor(inr * 1.4)}`; // Approx Rate
        htmlContent = `
            <div class="text-center py-4 animate-fade-in">
                <div class="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-3xl">payments</span>
                </div>
                <p class="text-sm text-slate-500 mb-1">bKash / Nagad (Personal)</p>
                <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 mb-2">
                    <p class="font-mono text-xl font-bold select-all">017-12345678</p>
                </div>
                <p class="text-xs text-slate-400">Please use "Send Money" option</p>
            </div>`;
            
    } else if (method === 'paypal') {
        finalPrice = `$${(inr / 85).toFixed(2)}`; // Approx Rate
        htmlContent = `
            <div class="text-center py-4 animate-fade-in">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-3xl">public</span>
                </div>
                <p class="text-sm text-slate-500 mb-1">International Payment</p>
                <p class="font-bold text-lg mb-3">Pay via PayPal</p>
                <a href="https://paypal.me/yourid" target="_blank" class="inline-block bg-[#0070ba] text-white px-6 py-2 rounded-full font-bold hover:bg-[#003087] transition">
                    Click to Pay
                </a>
            </div>`;
    }

    if(priceDisplay) priceDisplay.innerText = finalPrice;
    if(contentArea) contentArea.innerHTML = htmlContent;
};

// Payment Confirm Logic
window.confirmPayment = function() {
    const titleEl = document.getElementById('modal-plan-title');
    const plan = titleEl ? titleEl.innerText : 'Plan';
    const method = window.currentPaymentMethod.toUpperCase();
    
    // Telegram Message
    const telegramUser = "AbnixSH"; 
    const message = `Hello Stark, I have paid via ${method} for ${plan}. Here is the proof.`;
    window.open(`https://t.me/${telegramUser}?text=${encodeURIComponent(message)}`, '_blank');
};


// --- MAIN COMPONENT FUNCTION ---
function PlansPage() {
    return `
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-3xl font-bold mb-4">Premium Plans</h1>
      <p class="text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
        Unlock advanced features like ESP, Aimbot, and Mod Menus. Choose the plan that suits you best.
      </p>

      <div class="grid md:grid-cols-3 gap-6">
        
        <div class="app-card p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition relative overflow-hidden">
          <div class="text-lg font-semibold mb-2">1 Month</div>
          <div class="text-4xl font-bold text-blue-600 mb-4">₹250</div>
          <p class="text-sm text-slate-500 mb-6">Perfect for trying out premium features.</p>
          <ul class="text-left space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> All Features Access</li>
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> 24/7 Support</li>
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> Instant Updates</li>
          </ul>
          <button onclick="openPaymentModal('1 Month Plan', 250)" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Get Started</button>
        </div>

        <div class="app-card p-8 rounded-2xl border-2 border-blue-600 relative transform md:-translate-y-4 shadow-xl">
          <div class="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <div class="text-lg font-semibold mb-2">3 Months</div>
          <div class="text-4xl font-bold text-blue-600 mb-4">₹600</div>
          <p class="text-sm text-slate-500 mb-6">Save money with quarterly billing.</p>
          <ul class="text-left space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
             <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> Everything in 1 Month</li>
             <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> Priority Support</li>
             <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> Early Access to Betas</li>
          </ul>
          <button onclick="openPaymentModal('3 Months Plan', 600)" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Get Started</button>
        </div>

        <div class="app-card p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition">
          <div class="text-lg font-semibold mb-2">Lifetime</div>
          <div class="text-4xl font-bold text-purple-600 mb-4">₹1500</div>
          <p class="text-sm text-slate-500 mb-6">Pay once, own it forever.</p>
          <ul class="text-left space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> Lifetime Access</li>
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> VIP Developer Access</li>
            <li class="flex gap-2"><span class="material-icons text-green-500 text-sm">check_circle</span> No Recurring Fees</li>
          </ul>
          <button onclick="openPaymentModal('Lifetime Plan', 1500)" class="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition">Get Lifetime</button>
        </div>

      </div>
    </div>

    <div id="payment-modal" class="fixed inset-0 bg-black/80 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-bounce-in">
            <div class="p-6">
                
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h3 class="text-xl font-bold" id="modal-plan-title">Plan</h3>
                        <p class="text-xs text-slate-500">Select Payment Method</p>
                    </div>
                    <div class="text-2xl font-bold text-blue-600" id="modal-plan-price">...</div>
                </div>

                <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button id="btn-upi" onclick="updatePaymentDetails('upi')" class="pay-tab-btn">🇮🇳 UPI</button>
                    <button id="btn-easypaisa" onclick="updatePaymentDetails('easypaisa')" class="pay-tab-btn">🇵🇰 EasyPaisa</button>
                    <button id="btn-bkash" onclick="updatePaymentDetails('bkash')" class="pay-tab-btn">🇧🇩 Taka</button>
                    <button id="btn-paypal" onclick="updatePaymentDetails('paypal')" class="pay-tab-btn">🌎 PayPal</button>
                </div>
                
                <div id="payment-method-content" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 min-h-[200px] flex flex-col items-center justify-center">
                    </div>

                <div class="flex gap-3">
                    <button onclick="closePaymentModal()" class="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium">Cancel</button>
                    <button onclick="confirmPayment()" class="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition flex items-center justify-center gap-2">
                        <span class="material-icons text-sm">send</span> Send Proof
                    </button>
                </div>
            </div>
        </div>
    </div>
  `;
}

// CRITICAL FIX: Ye line error hatayegi
window.PlansPage = PlansPage;
