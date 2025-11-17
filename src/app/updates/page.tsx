export default function UpdatesPage() {
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
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-8 text-center animate-fadeIn">
        <h2 className="text-5xl font-semibold leading-tight mb-4">Updates</h2>
        <p className="max-w-xl mx-auto text-[#444] text-lg">
          Follow Kaltrium’s development and upcoming AI services.
        </p>
      </section>

      {/* SINGLE UPDATE */}
      <section className="mx-auto max-w-3xl px-6 pb-16 text-[#333] animate-fadeIn">
        <div className="border-l-4 border-[#d6c4a3] pl-6 py-2 bg-white/60 rounded-r-xl">
          <h3 className="text-xl font-semibold mb-1">📸 AI Photo service for professionals — coming soon</h3>
          <p className="text-sm leading-relaxed">
            Upload a simple photo and get a clean, professional-looking portrait in your chosen style:
            formal, semi-formal, or casual — perfect for LinkedIn, CVs, company profiles, or business websites.
          </p>
          <p className="text-xs text-[#777] mt-1">December 2025</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#dcdcdc] bg-[#f3f3f3] py-8 text-center text-sm text-[#555]">
        Smart AI assistant — maintained and improved by real people.
      </footer>

      {/* FADE-IN ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out both;
        }
      `}</style>
    </main>
  );
}
