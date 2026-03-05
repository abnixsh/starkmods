// pages/checkout.js

function CheckoutPage() {
  // --- CONFIGURATION: EXCHANGE RATES ---
  // 1 INR = How much PKR? (e.g. 3.3) | 1 INR = How much USD? (e.g. 0.012)
  // Adjust these rates based on current market + a little buffer for fees
  const CURRENCY_RATES = {
    PKR: 3.0,  // Example: 1000 INR * 3.4 = 3400 PKR
    USD: 0.012 // Example: 1000 INR * 0.012 = $12.00 USD (Approx 1$ = 83 INR)
  };

  // 1. Cart Check
  if (!window.cart || window.cart.length === 0) {
    window.router.navigateTo('/cart');
    return '';
  }

  // 2. Login Check
  if (!window.currentUser) {
    return `
      <div class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-icons text-4xl text-blue-600 dark:text-blue-400">lock</span>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Login Required</h2>
        <p class="text-slate-500 mb-6">Please login with Google to secure your order.</p>
        <button onclick="window.googleLogin()" class="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mx-auto hover:bg-slate-50 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6">
          Login with Google
        </button>
      </div>`;
  }

  const item = window.cart[0];
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  window.currentOrderId = orderId;

  // Make rates available globally for the render function
  window.currentRates = CURRENCY_RATES; 

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20" id="checkout-container">
      
      <!-- PROGRESS STEPS -->
      <div class="flex justify-between mb-8 relative px-4">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
        <div class="step-dot active" id="dot-1"><span class="material-icons text-sm">person</span></div>
        <div class="step-dot" id="dot-2"><span class="material-icons text-sm">payments</span></div>
        <div class="step-dot" id="dot-3"><span class="material-icons text-sm">qr_code_scanner</span></div>
      </div>

      <!-- STEP 1: CONTACT DETAILS -->
      <div id="step-1" class="step-content">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">1. Confirm Details</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-500 mb-1">Name</label>
              <input type="text" id="user-name"
                     value="${window.currentUser.displayName || ''}"
                     class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 outline-none text-slate-900 dark:text-white font-bold">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-slate-500 mb-1">Telegram Username / WhatsApp</label>
              <input type="text" id="user-contact" placeholder="@username or Phone Number"
                     class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-blue-500 transition text-slate-900 dark:text-white">
              <p class="text-xs text-slate-400 mt-1">We will send your key here.</p>
            </div>
          </div>

          <button onclick="window.goToStep2()" class="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
            Next Step <span class="material-icons">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- STEP 2: SELECT METHOD -->
      <div id="step-2" class="step-content hidden">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">2. Select Method</h2>
          
          <div class="grid grid-cols-2 gap-4 mb-8">
            <button onclick="window.selectMethod('upi')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-500 transition flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900">
              <img src="assets/icons/pay_upi.png" class="h-8 object-contain" onerror="this.style.display='none'">
              <span class="font-bold text-sm text-slate-700 dark:text-slate-200">UPI / QR (India)</span>
            </button>
            <button onclick="window.selectMethod('ep')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-green-500 transition flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900">
              <img src="assets/icons/pay_easypaisa.png" class="h-8 object-contain" onerror="this.style.display='none'">
              <span class="font-bold text-sm text-slate-700 dark:text-slate-200">EasyPaisa (PK)</span>
            </button>
            <button onclick="window.selectMethod('binance')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-yellow-500 transition flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900">
              <img src="assets/icons/pay_binance.png" class="h-8 object-contain" onerror="this.style.display='none'">
              <span class="font-bold text-sm text-slate-700 dark:text-slate-200">Binance Pay</span>
            </button>
            <button onclick="window.selectMethod('paypal')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-600 transition flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900">
              <img src="assets/icons/pay_paypal.png" class="h-8 object-contain" onerror="this.style.display='none'">
              <span class="font-bold text-sm text-slate-700 dark:text-slate-200">PayPal</span>
            </button>
          </div>

          <div class="flex gap-4">
            <button onclick="window.goBackToStep1()" class="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition">
              Back
            </button>
            <button onclick="window.goToStep3()" id="step2-next" disabled
                    class="flex-1 py-4 bg-slate-400 text-white rounded-xl font-bold transition cursor-not-allowed">
              Proceed
            </button>
          </div>
        </div>
      </div>

      <!-- STEP 3: PAYMENT SCREEN -->
      <div id="step-3" class="step-content hidden">
        <div class="glass border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden text-center rounded-2xl bg-white dark:bg-slate-800">
          
          <div class="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <p class="text-xs text-slate-500 font-bold uppercase">Original Price</p>
            <h1 class="text-2xl font-bold text-slate-400">₹${item.price} <span class="text-xs">INR</span></h1>
            <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">
              Order #${orderId}
            </span>
          </div>

          <!-- DYNAMIC CONTENT AREA -->
          <div id="final-payment-display" class="mb-8">
            <!-- JS will inject QR/Details here -->
          </div>

          <!-- Timer -->
          <div class="flex justify-center mb-6">
            <div class="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-full font-mono font-bold flex items-center gap-2">
              <span class="material-icons text-sm animate-pulse">timer</span>
              <span id="countdown-timer">05:00</span>
            </div>
          </div>

          <!-- Transaction ID Input -->
          <div class="text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">Paste Transaction ID / UTR</label>
            <div class="flex gap-2">
              <input type="text" id="final-trans-id" placeholder="e.g. 123456789012"
                     class="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-lg p-3 font-mono text-sm outline-none focus:border-green-500 transition text-slate-900 dark:text-white">
              <button onclick="window.submitOrder()" id="btn-final-submit"
                      class="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg font-bold shadow-lg transition">
                Verify
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <style>
      .step-dot { width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; z-index: 10; transition: all 0.3s; }
      .dark .step-dot { background: #1e293b; color: #94a3b8; }
      .step-dot.active { background: #2563eb; color: white; transform: scale(1.1); box-shadow: 0 0 15px rgba(37, 99, 235, 0.5); }
      .pay-card.selected { border-color: #2563eb; background-color: rgba(37,99,235,0.05); }
      .dark .pay-card.selected { background-color: rgba(37,99,235,0.2); }
    </style>
  `;
}

/* ---------------- NAVIGATION LOGIC ---------------- */
window.goToStep2 = function () {
  const name = document.getElementById('user-name').value.trim();
  const contact = document.getElementById('user-contact').value.trim();
  if (!name || !contact) { alert("⚠️ Please enter name and contact info"); return; }
  window.userDetails = { name, contact };
  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');
  document.getElementById('dot-2').classList.add('active');
};

window.goBackToStep1 = function () {
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-1').classList.remove('hidden');
  document.getElementById('dot-2').classList.remove('active');
};

window.selectMethod = function (method) {
  window.selectedMethod = method;
  document.querySelectorAll('.pay-card').forEach(el => el.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  const btn = document.getElementById('step2-next');
  btn.disabled = false;
  btn.classList.remove('bg-slate-400', 'cursor-not-allowed');
  btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-lg');
};

window.goToStep3 = function () {
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.remove('hidden');
  document.getElementById('dot-3').classList.add('active');
  renderSmartPaymentDetails();
  startTimer();
};

/* ---------------- SMART PAYMENT LOGIC (FIXED) ---------------- */

function renderSmartPaymentDetails() {
  const box = document.getElementById('final-payment-display');
  const method = window.selectedMethod;
  const item = window.cart[0];
  const rates = window.currentRates; // Get rates defined at top

  // 1. UPI (INR)
  if (method === 'upi') {
    const upiID = "abnixsh@ptyes"; 
    const name = "StarkStore";
    const link = `upi://pay?pa=${upiID}&pn=${name}&am=${item.price}&cu=INR`;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;

    box.innerHTML = `
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
        <div class="text-3xl font-black text-blue-600 dark:text-blue-400">₹${item.price}</div>
        <div class="text-xs font-bold text-blue-400 uppercase">Total Amount (INR)</div>
      </div>
      <div class="relative inline-block group">
        <div class="relative bg-white p-3 rounded-xl">
          <img src="${qr}" class="w-48 h-48 object-contain mx-auto">
        </div>
      </div>
      <div class="mt-4 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition"
           onclick="navigator.clipboard.writeText('${upiID}')">
        <span class="font-mono font-bold text-slate-700 dark:text-slate-300">${upiID}</span>
        <span class="material-icons text-xs text-slate-400">content_copy</span>
      </div>
    `;
  }

  // 2. EASYPAISA (PKR Conversion)
  else if (method === 'ep') {
    const epNumber = "03045381058";
    const epName = "Ghulam shabir";
    
    // CONVERSION LOGIC: Round up to nearest whole number
    const pkrAmount = Math.ceil(item.price * rates.PKR);

    box.innerHTML = `
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4 border border-green-200 dark:border-green-800">
        <div class="text-4xl font-black text-green-600 dark:text-green-400">Rs ${pkrAmount}</div>
        <div class="text-xs font-bold text-green-500 uppercase">Total Amount (PKR)</div>
      </div>

      <img src="assets/icons/pay_easypaisa.png" class="h-10 mx-auto mb-4 object-contain" onerror="this.style.display='none'">

      <div class="text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-xl space-y-3">
        <div>
           <div class="text-[10px] text-slate-500 uppercase font-bold">Account Name</div>
           <div class="font-semibold text-slate-900 dark:text-white">${epName}</div>
        </div>
        <div>
           <div class="text-[10px] text-slate-500 uppercase font-bold">EasyPaisa Number</div>
           <div class="flex justify-between items-center bg-white dark:bg-slate-950 p-2 rounded-lg mt-1 border border-slate-200 dark:border-slate-700">
             <span class="font-mono text-lg font-bold text-slate-900 dark:text-white">${epNumber}</span>
             <button class="text-green-500 hover:text-green-600" onclick="navigator.clipboard.writeText('${epNumber}')">
               <span class="material-icons">content_copy</span>
             </button>
           </div>
        </div>
      </div>
    `;
  }

  // 3. BINANCE (USDT Conversion)
  else if (method === 'binance') {
    const usdtAmount = (item.price * rates.USD).toFixed(2);
    const binanceId = "998477777";

    box.innerHTML = `
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-4 border border-yellow-200 dark:border-yellow-800">
        <div class="text-4xl font-black text-yellow-600 dark:text-yellow-400">${usdtAmount} <span class="text-sm">USDT</span></div>
        <div class="text-xs font-bold text-yellow-500 uppercase">Total Amount</div>
      </div>

      <img src="assets/icons/pay_binance.png" class="h-10 mx-auto mb-4 object-contain">
      
      <div class="text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
        <p class="text-xs text-slate-500 uppercase font-bold mb-1">Binance Pay ID</p>
        <div class="flex justify-between items-center bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <span class="font-mono text-xl font-bold text-slate-900 dark:text-white">${binanceId}</span>
          <button class="text-yellow-500 hover:text-yellow-600" onclick="navigator.clipboard.writeText('${binanceId}')">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
      </div>
    `;
  }

  // 4. PAYPAL (USD Conversion)
  else if (method === 'paypal') {
    const usdAmount = (item.price * rates.USD).toFixed(2);
    const paypalEmail = "yourpaypal@email.com"; // REPLACE THIS

    box.innerHTML = `
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 border border-blue-200 dark:border-blue-800">
        <div class="text-4xl font-black text-blue-600 dark:text-blue-400">$${usdAmount} <span class="text-sm">USD</span></div>
        <div class="text-xs font-bold text-blue-500 uppercase">Total Amount</div>
      </div>
      
      <img src="assets/icons/pay_paypal.png" class="h-8 mx-auto mb-4 object-contain">

      <div class="text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
        <p class="text-xs text-slate-500 uppercase font-bold mb-1">PayPal Email (Friends & Family)</p>
        <div class="flex justify-between items-center bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <span class="font-mono text-sm font-bold text-slate-900 dark:text-white">${paypalEmail}</span>
          <button class="text-blue-500 hover:text-blue-600" onclick="navigator.clipboard.writeText('${paypalEmail}')">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
      </div>
    `;
  }
}

function startTimer() {
  let time = 300;
  const display = document.getElementById('countdown-timer');
  const interval = setInterval(() => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    if(display) display.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    if (time-- <= 0) {
      clearInterval(interval);
      if(display) display.innerText = "Expired";
    }
  }, 1000);
}

/* ---------------- SUBMIT ORDER ---------------- */
window.submitOrder = async function () {
  const transId = document.getElementById('final-trans-id').value.trim();
  const btn = document.getElementById('btn-final-submit');
  
  if (transId.length < 4) { alert("⚠️ Please enter valid Transaction ID"); return; }
  
  btn.disabled = true;
  btn.innerHTML = "Verifying...";
  
  // Get converted amount for DB record (Optional: save exact sent amount)
  const item = window.cart[0];
  const rates = window.currentRates;
  let finalCurrency = 'INR';
  let finalAmount = item.price;
  
  if(window.selectedMethod === 'ep') { finalCurrency = 'PKR'; finalAmount = Math.ceil(item.price * rates.PKR); }
  if(window.selectedMethod === 'binance') { finalCurrency = 'USDT'; finalAmount = (item.price * rates.USD).toFixed(2); }
  if(window.selectedMethod === 'paypal') { finalCurrency = 'USD'; finalAmount = (item.price * rates.USD).toFixed(2); }

  const orderData = {
    orderId: window.currentOrderId,
    userId: window.currentUser.uid,
    userName: window.userDetails.name,
    contact: window.userDetails.contact,
    email: window.currentUser.email,
    item: item,
    basePriceINR: item.price,
    paidAmount: finalAmount,      // New field
    paidCurrency: finalCurrency,  // New field
    method: window.selectedMethod.toUpperCase(),
    transId: transId,
    status: 'pending',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    // Save to Firestore
    await db.collection('orders').add(orderData);
    
    // Subscription Logic (If needed)
    if (item.gameId && String(item.gameId).startsWith('sub_')) {
        // ... (Keep your existing subscription logic here) ...
    }

    // Send Telegram Notification (Ensure your API handles the currency fields)
    try {
        await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
    } catch(e) { console.log('API Error', e); }

    alert("✅ Order Submitted! Please wait for admin approval.");
    window.cart = [];
    updateCartBadge();
    window.router.navigateTo('/profile');

  } catch (e) {
    console.error(e);
    alert("Error: " + e.message);
    btn.disabled = false;
    btn.innerHTML = "Retry";
  }
};

window.CheckoutPage = CheckoutPage;
