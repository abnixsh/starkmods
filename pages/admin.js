/* ---------- UPDATED ADMIN STATUS LOGIC ---------- */

// 1. Define your standard links here for easier Admin auto-filling
const ADMIN_GAME_LINKS = {
  'rc20': 'https://link-to-rc20.com/download',
  'rc24': 'https://link-to-rc24.com/download',
  'wcc3': 'https://link-to-wcc3.com/download',
  // Add others...
};

/* ---------- UPDATED ADMIN STATUS LOGIC (For pages/admin.js) ---------- */

// Optional: Pre-fill links to save time
const STANDARD_LINKS = {
  'rc24': 'https://drive.google.com/your-rc24-link',
  'rc20': 'https://drive.google.com/your-rc20-link',
  // add others...
};

/* ---------- UPDATED ADMIN STATUS LOGIC (For pages/admin.js) ---------- */

// Optional: Pre-fill links to save time
const STANDARD_LINKS = {
  'rc24': 'https://drive.google.com/your-rc24-link',
  'rc20': 'https://drive.google.com/your-rc20-link',
  // add others...
};

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;

  try {
    const orderRef = db.collection('orders').doc(docId);
    const snap = await orderRef.get();
    if (!snap.exists) throw new Error('Order not found');
    const order = snap.data();

    let updateData = { status };

    // --- NEW LOGIC: Ask for Download Link when Approving ---
    if (status === 'approved') {
      const suggested = (order.gameId && STANDARD_LINKS[order.gameId]) || '';
      const link = prompt("Enter Download Link for this user:", suggested);
      
      if (link) {
        updateData.downloadUrl = link; // Saves to DB securely
      } else {
        if(!confirm("No link entered. User won't be able to download. Continue?")) return;
      }
    }
    // -------------------------------------------------------

    await orderRef.update(updateData);

    // Credit Elite Wallet (Your existing logic)
    if (status === 'approved' && window.isElite && window.currentUser) {
      await window.creditEliteWallet(window.currentUser, order, docId);
    }

    alert('Order updated.');
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};
    // -------------------------------------------------------


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
