// pages/privacy.js

function PrivacyPage() {
  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Privacy Policy</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
        This Privacy Policy explains how Stark Mods collects, uses, and protects your information when you
        use this website and our services.
      </p>

      <div class="space-y-5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">

        <section>
          <h2 class="font-semibold mb-1">1. Information We Collect</h2>
          <p>
            We collect only the information necessary to provide and improve our services, including:
          </p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li><span class="font-semibold">Account information:</span> Your Google account name, email address, and profile photo when you sign in.</li>
            <li><span class="font-semibold">Order information:</span> Chosen mods / subscriptions, payment amount, and your contact details (such as Telegram ID or phone number) that you provide during checkout.</li>
            <li><span class="font-semibold">Mod Creator data:</span> Details you submit in Mod Creator (custom players, jerseys, teams) including any textures you upload.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold mb-1">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Process and manage your orders and subscriptions.</li>
            <li>Create and deliver your requested custom mods (players, jerseys, teams).</li>
            <li>Contact you regarding your order status, support questions, and important updates.</li>
            <li>Maintain security, prevent abuse, and improve our services.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold mb-1">3. Payment Information</h2>
          <p>
            Payments are processed manually via methods such as UPI, EasyPaisa, Binance, or other channels
            displayed on the checkout page. We do <span class="font-semibold">not</span> store your full card
            details or banking passwords. We only store:
          </p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>The amount paid and selected payment method.</li>
            <li>Your transaction ID / UTR that you submit for verification.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold mb-1">4. Data Storage &amp; Security</h2>
          <p>
            We use trusted third-party services such as <span class="font-semibold">Firebase</span> for
            authentication and database storage. Access to your data is restricted to Stark Mods admins
            who need it to process orders and support requests.
          </p>
          <p class="mt-1">
            Custom textures (faces, jerseys, logos) may be sent to our Telegram bot for faster processing.
            These files are used only to complete your request and are not shared publicly.
          </p>
        </section>

        <section>
          <h2 class="font-semibold mb-1">5. Cookies &amp; Local Storage</h2>
          <p>
            We may use browser storage (such as localStorage) and cookies to remember your theme preference,
            login state, and cart items. This information is stored locally on your device and can be cleared
            any time from your browser settings.
          </p>
        </section>

        <section>
          <h2 class="font-semibold mb-1">6. Sharing of Information</h2>
          <p>
            We do <span class="font-semibold">not sell</span> your personal data. Your information may be
            shared only:
          </p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>With service providers (such as Firebase and Telegram) that help us operate the website.</li>
            <li>When required by law or to respond to valid legal requests.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold mb-1">7. Your Choices</h2>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>You can log out of your account at any time.</li>
            <li>You can request removal of specific mod requests or data by contacting us.</li>
            <li>You can change your theme preference and clear local storage from your browser.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold mb-1">8. Children&apos;s Privacy</h2>
          <p>
            Stark Mods is not intended for users under the age of 13. If you are a parent or guardian and
            believe your child has provided us with information, please contact us so we can remove it.
          </p>
        </section>

        <section>
          <h2 class="font-semibold mb-1">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with
            the updated date. Continued use of the site after changes means you accept the new policy.
          </p>
        </section>

        <section>
          <h2 class="font-semibold mb-1">10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please use the
            Contact page or reach out through the support details shown there.
          </p>
        </section>

      </div>
    </div>
  `;
}

window.PrivacyPage = PrivacyPage;
