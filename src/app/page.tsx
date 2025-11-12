export const metadata = {
  title: "Kaltrium — AI Proofreader & Editor for Business & Marketing Texts",
  description:
    "Kaltrium instantly edits and proofreads business and marketing texts. Get a polished, marketing-ready PDF with refined tone, clarity and style in minutes.",
  keywords:
    "AI proofreader, business editing, marketing text correction, PDF proofreading, AI editor, professional writing, style improvement",
  openGraph: {
    title: "Kaltrium — Smart AI Proofreader & Editor",
    description:
      "AI-powered editing for business and marketing professionals. Upload your text and get a refined, branded PDF instantly.",
    url: "https://kaltrium.com",
    siteName: "Kaltrium",
    images: [
      {
        url: "https://kaltrium.com/og-image.jpg", // можно заменить на свой логотип/превью
        width: 1200,
        height: 630,
        alt: "Kaltrium Proofreader Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f8f7] to-[#eaeaea] text-[#111]">
      {/* NAVBAR */}
      <header className="w-full flex justify-between items-center px-8 pt-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#d6c4a3] via-[#e5dcc7] to-[#b8b8b8] bg-clip-text text-transparent">
          Kaltrium
        </h1>

        <nav className="flex flex-wrap gap-4 text-sm text-[#333]">
          {/* Home убрали на главной */}
          <a href="/upload" className="rounded-xl px-3 py-1 transition-all duration-200 hover:bg-[#fdfaf5] hover:text-black hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98]">Upload</a>
          <a href="/pricing" className="rounded-xl px-3 py-1 transition-all duration-200 hover:bg-[#fdfaf5] hover:text-black hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98]">Pricing</a>
          <a href="/contact" className="rounded-xl px-3 py-1 transition-all duration-200 hover:bg-[#fdfaf5] hover:text-black hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98]">Contact</a>
          <a href="/policy" className="rounded-xl px-3 py-1 transition-all duration-200 hover:bg-[#fdfaf5] hover:text-black hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98]">Legal & Privacy</a>
          <a href="/updates" className="rounded-xl px-3 py-1 transition-all duration-200 hover:bg-[#fdfaf5] hover:text-black hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98]">Updates</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16 text-center">
        <h2 className="text-5xl md:text-6xl font-semibold leading-tight">
          AI that edits.<br className="hidden md:block" /> People who care.
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-lg text-[#444]">
          Proofreader & Editor for business and marketing texts — crafted for clarity, confidence, and precision.
        </p>

        {/* CTA buttons (живые) */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/upload"
            className="rounded-2xl bg-[#d6c4a3] text-black px-8 py-3 font-semibold shadow-[0_8px_24px_rgba(214,196,163,0.5)] hover:shadow-[0_12px_32px_rgba(214,196,163,0.6)] active:scale-[0.98] transition"
          >
            Try now
          </a>
          <a
            href="/pricing"
            className="rounded-2xl border border-[#c8c8c8] bg-white/80 px-8 py-3 font-medium hover:border-[#a0a0a0] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] active:scale-[0.98] transition"
          >
            View pricing
          </a>
        </div>

        {/* 3 преимущества */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] border-t-4 border-[#d6c4a3]">
            <div className="text-xl font-semibold text-black mb-2">Editing & Proofreading</div>
            <p className="text-[#444] text-sm leading-relaxed">
              Grammar, tone, and clarity — refined for business impact.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] border-t-4 border-[#cfcfcf]">
            <div className="text-xl font-semibold text-black mb-2">Marketing-Ready</div>
            <p className="text-[#444] text-sm leading-relaxed">
              Concise, persuasive language that sells your message.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] border-t-4 border-[#b8b8b8]">
            <div className="text-xl font-semibold text-black mb-2">Instant PDF</div>
            <p className="text-[#444] text-sm leading-relaxed">
              Receive a clean, branded PDF with tracked suggestions in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* SECURE & PRIVATE (перед футером) */}
      <div className="mt-16 flex flex-col items-center gap-1 pb-10">
        <span className="rounded-full bg-[#fdfaf5] border border-[#d6c4a3] px-4 py-1 text-sm font-medium text-[#111] shadow-sm">
          🔒 Secure & private
        </span>
        <p className="text-sm text-[#555] text-center max-w-md">
          We don’t store your data — all texts and files are processed instantly and deleted after completion.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#dcdcdc] bg-[#f3f3f3] py-8 text-center text-sm text-[#555] space-y-1">
        <p>Smart AI assistant — maintained and improved by real people.</p>
        <p>
          © {new Date().getFullYear()} Kaltrium ·{" "}
          <a href="/policy" className="underline hover:text-[#111] transition">Legal & Privacy</a> ·{" "}
          <a href="/updates" className="underline hover:text-[#111] transition">Updates</a>
        </p>
      </footer>
    </main>
  );
}











