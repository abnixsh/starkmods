function CheckoutPage() {
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

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20" id="checkout-container">
      <!-- ... (UI unchanged; keep your existing steps 1–3 HTML here) ... -->
      <!-- I’m omitting for brevity; you can keep your own markup between here and the script section -->
    </div>

    <style>
      .step-dot { width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; z-index: 10; transition: all 0.3s; }
      .dark .step-dot { background: #1e293b; color: #94a3b8; }
      .step-dot.active { background: #2563eb; color: white; transform: scale(1.1); box-shadow: 0 0 15px rgba(37,99,235,0.5); }
      .pay-card.selected { border-color: #2563eb; background-color: rgba(37,99,235,0.05); }
      .dark .pay-card.selected { background-color: rgba(37,99,235,0.2); }
    </style>
  `;
}

/* --- NAVIGATION LOGIC (unchanged) --- */
window.goToStep2 = function () {
  const name = document.getElementById('user-name').value.trim();
  const contact = document.getElementById('user-contact').value.trim();
  if (!name) { alert("⚠️ Please enter your name"); return; }
  if (!contact) { alert("⚠️ Please enter your contact info (Telegram/Email)"); return; }

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

/* --- SMART QR LOGIC & TIMER (keep your existing implementation) --- */
/* ... renderSmartPaymentDetails(), startTimer() unchanged ... */

/* --- SUBMIT ORDER --- */
window.submitOrder = async function () {
  const transId = document.getElementById('final-trans-id').value.trim();
  const btn = document.getElementById('btn-final-submit');

  if (transId.length < 6) { alert("⚠️ Please enter Transaction ID"); return; }
  if (!window.selectedMethod) { alert("⚠️ Please select payment method"); return; }

  btn.disabled = true;
  btn.innerHTML = "Verifying...";

  const cartItem = window.cart[0];

  const orderData = {
    orderId: window.currentOrderId,
    userId: window.currentUser.uid,
    userName: window.userDetails?.name || window.currentUser.displayName || '',
    contact: window.userDetails?.contact || '',
    email: window.currentUser.email,
    item: cartItem,
    amount: cartItem.price,
    method: window.selectedMethod.toUpperCase(),
    transId: transId,
    status: 'pending',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    // 1. Save to Firestore
    await db.collection('orders').add(orderData);

    // 2. Call Vercel backend to send Telegram notification
    await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    alert("✅ Order Submitted! Check 'My Profile' for updates.");
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

window.CheckoutPage = CheckoutPage
      
