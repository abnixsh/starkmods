// pages/plans.js
function PlansPage() {
    // Logic to handle UPI Modal
    window.openPaymentModal = function(planName, price) {
        const modal = document.getElementById('payment-modal');
        const planTitle = document.getElementById('modal-plan-title');
        const planPrice = document.getElementById('modal-plan-price');
        
        // Set details
        planTitle.innerText = planName;
        planPrice.innerText = price;
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Start Timer (5 Minutes)
        let timeLeft = 300; // seconds
        const timerDisplay = document.getElementById('payment-timer');
        
        if(window.paymentTimer) clearInterval(window.paymentTimer);
        
        window.paymentTimer = setInterval(() => {
            if(timeLeft <= 0) {
                clearInterval(window.paymentTimer);
                timerDisplay.innerText = "Time Expired";
                return;
            }
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            timeLeft--;
        }, 1000);
    };

    window.closePaymentModal = function() {
        document.getElementById('payment-modal').classList.add('hidden');
        if(window.paymentTimer) clearInterval(window.paymentTimer);
    };

    window.confirmPayment = function() {
        const plan = document.getElementById('modal-plan-title').innerText;
        // Replace 'AbnixSH' with your actual Telegram Username
        const telegramUser = "AbnixSH"; 
        const text = encodeURIComponent(`Hello, I have paid for ${plan}. Please provide access.`);
        window.open(`https://t.me/${telegramUser}?text=${text}`, '_blank');
    };

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
          <button onclick="openPaymentModal('1 Month Plan', '₹250')" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Get Started</button>
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
          <button onclick="openPaymentModal('3 Months Plan', '₹600')" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Get Started</button>
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
          <button onclick="openPaymentModal('Lifetime Plan', '₹1500')" class="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition">Get Lifetime</button>
        </div>

      </div>
    </div>

    <div id="payment-modal" class="fixed inset-0 bg-black/80 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-bounce-in">
            <div class="p-6 text-center">
                <h3 class="text-2xl font-bold mb-2">Complete Payment</h3>
                <p class="text-slate-500 mb-4">Scan UPI QR to Pay <span id="modal-plan-price" class="font-bold text-blue-600"></span></p>
                
                <div class="bg-white p-2 rounded-lg inline-block mb-4 border border-slate-200">
                    <img src="assets/img/qrcode.jpg" alt="UPI QR Code" class="w-48 h-48 object-contain">
                </div>

                <div class="text-red-500 font-mono font-bold text-xl mb-4" id="payment-timer">05:00</div>
                
                <p class="text-xs text-slate-400 mb-6">
                    1. Scan QR with any UPI App.<br>
                    2. Complete payment.<br>
                    3. Click button below to send screenshot/confirm on Telegram.
                </p>

                <div class="flex gap-3">
                    <button onclick="closePaymentModal()" class="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition">Cancel</button>
                    <button onclick="confirmPayment()" class="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition">Confirm Payment</button>
                </div>
            </div>
        </div>
    </div>
  `;
}
