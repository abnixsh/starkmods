<button id="btn-paypal" onclick="updatePaymentDetails('paypal')" class="pay-tab-btn flex-1 py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">🌎 PayPal</button>
                </div>
                
                <div id="payment-method-content" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 min-h-[180px] flex items-center justify-center">
                    </div>

                <div class="flex gap-3">
                    <button onclick="closePaymentModal()" class="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition">Cancel</button>
                    <button onclick="confirmPayment()" class="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition">Sent Proof</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// CRITICAL LINE: Isse function 'Window' par register hota hai
window.PlansPage = PlansPage;
