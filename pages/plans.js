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
