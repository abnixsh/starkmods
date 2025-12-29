/* ---------- UPDATED ADMIN STATUS LOGIC ---------- */

// 1. Define your standard links here for easier Admin auto-filling
const ADMIN_GAME_LINKS = {
  'rc20': 'https://link-to-rc20.com/download',
  'rc24': 'https://link-to-rc24.com/download',
  'wcc3': 'https://link-to-wcc3.com/download',
  // Add others...
};

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;

  try {
    const orderRef = db.collection('orders').doc(docId);
    const snap = await orderRef.get();
    if (!snap.exists) throw new Error('Order not found');
    const order = snap.data();

    let updateData = { status };

    // --- NEW: IF APPROVING, ASK FOR DOWNLOAD LINK ---
    if (status === 'approved') {
      // Try to guess the link based on gameId
      const suggestedLink = (order.gameId && ADMIN_GAME_LINKS[order.gameId]) 
                            ? ADMIN_GAME_LINKS[order.gameId] 
                            : '';
      
      const downloadUrl = prompt("Enter Download URL for this user:", suggestedLink);
      
      if (downloadUrl) {
        updateData.downloadUrl = downloadUrl; // Save to DB
      } else {
        if(!confirm("You didn't enter a download link. The user won't be able to download. Continue anyway?")) {
          return; // Cancel
        }
      }
    }
    // ------------------------------------------------

    await orderRef.update(updateData);

    // Credit Elite Wallet logic (Keep your existing logic here)
    if (status === 'approved' && window.isElite && window.currentUser) {
      await window.creditEliteWallet(window.currentUser, order, docId);
    }

    alert('Status updated successfully.');
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};
