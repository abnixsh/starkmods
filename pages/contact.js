// pages/contact.js
function ContactPage() {
    return `
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold mb-4">Contact Us</h1>
        <p class="text-slate-500 dark:text-slate-400">
          Get in touch for support, subscriptions, or any questions about our tools.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        
        <div class="app-card p-6 rounded-2xl">
          <h2 class="text-xl font-semibold mb-6">Send us a Message</h2>
          <form id="contact-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name *</label>
              <input type="text" name="name" required class="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Subject *</label>
              <select name="subject" class="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none">
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Business</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Message *</label>
              <textarea name="message" rows="4" required class="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Please provide details..."></textarea>
            </div>
            <button type="submit" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2">
              <span class="material-icons text-sm">send</span> Send Message
            </button>
          </form>
        </div>

        <div class="space-y-6">
          <div class="app-card p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-6">Get in Touch</h2>
            
            <div class="space-y-6">
              <a href="mailto:abnixsh@gmail.com" class="flex items-start gap-4 hover:opacity-80 transition">
                <div class="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <span class="material-icons">email</span>
                </div>
                <div>
                  <div class="font-semibold">Email</div>
                  <div class="text-sm text-slate-500 mb-1">Primary contact method</div>
                  <div class="text-blue-500">abnixsh@gmail.com</div>
                </div>
              </a>

              <a href="https://t.me/imsergiomoreio" target="_blank" class="flex items-start gap-4 hover:opacity-80 transition">
                <div class="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-lg">
                  <span class="material-icons">send</span>
                </div>
                <div>
                  <div class="font-semibold">Telegram</div>
                  <div class="text-sm text-slate-500 mb-1">Fast response</div>
                  <div class="text-blue-500">@ImSergioMoreio</div>
                </div>
              </a>

              <a href="#" class="flex items-start gap-4 hover:opacity-80 transition">
                <div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg">
                  <span class="material-icons">play_arrow</span>
                </div>
                <div>
                  <div class="font-semibold">YouTube</div>
                  <div class="text-sm text-slate-500 mb-1">Tutorials and updates</div>
                  <div class="text-blue-500">@starkofficial18</div>
                </div>
              </a>
            </div>

            <div class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg flex gap-3">
              <span class="material-icons text-green-600">schedule</span>
              <div>
                <div class="font-semibold text-green-700 dark:text-green-400">Response Time</div>
                <p class="text-sm text-green-600 dark:text-green-500 mt-1">
                  We typically respond within 24 hours. For urgent subscription issues, use Telegram.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
