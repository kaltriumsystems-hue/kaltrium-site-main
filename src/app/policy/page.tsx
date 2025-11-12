export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f8f7] to-[#eaeaea] text-[#111]">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-8 pt-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#d6c4a3] via-[#e5dcc7] to-[#b8b8b8] bg-clip-text text-transparent">
          Kaltrium
        </h1>
        <a
          href="/"
          className="rounded-xl border border-[#d6c4a3] px-4 py-2 text-sm hover:bg-[#fdfaf5] hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98] transition"
        >
          ← Back to Home
        </a>
      </header>

      {/* TITLE */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-8 text-center">
        <h2 className="text-5xl font-semibold leading-tight mb-4">Privacy & Refund Policy</h2>
        <p className="max-w-xl mx-auto text-[#444] text-lg">
          We respect your privacy and value your trust. Below you’ll find details on how your data is handled and refund conditions.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-3xl px-6 pb-16 space-y-12 text-[#333]">
        <div className="border-l-4 border-[#d6c4a3] pl-6 py-2">
          <h3 className="text-xl font-semibold mb-2">🔒 Privacy</h3>
          <p className="text-sm leading-relaxed">
            All uploaded texts are processed securely and are <span className="font-medium">immediately deleted</span> after analysis.
            We do not store, share, or use your files for any purpose other than processing your request.
          </p>
        </div>

        <div className="border-l-4 border-[#b8b8b8] pl-6 py-2">
          <h3 className="text-xl font-semibold mb-2">💳 Refunds</h3>
          <p className="text-sm leading-relaxed">
            Refunds are available only in case of technical failure or incomplete delivery. Since our service provides instant AI-generated
            results, completed tasks cannot be refunded once processed.
          </p>
        </div>

        <div className="border-l-4 border-[#e5dcc7] pl-6 py-2">
          <h3 className="text-xl font-semibold mb-2">🛡️ Security</h3>
          <p className="text-sm leading-relaxed">
            All communications are encrypted via HTTPS. Sensitive data is never logged or stored on our servers. Your privacy and content
            integrity are our highest priorities.
          </p>
        </div>

        <div className="border-l-4 border-[#d6c4a3] pl-6 py-2">
          <h3 className="text-xl font-semibold mb-2">📩 Contact</h3>
          <p className="text-sm leading-relaxed">
            If you have questions about our privacy or refund policy, please reach out at{" "}
            <a href="mailto:kaltrium.systems@gmail.com" className="underline hover:text-[#b89f74] transition">
              kaltrium.systems@gmail.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#dcdcdc] bg-[#f3f3f3] py-8 text-center text-sm text-[#555]">
        Smart AI assistant — maintained and improved by real people.
      </footer>
    </main>
  );
}
