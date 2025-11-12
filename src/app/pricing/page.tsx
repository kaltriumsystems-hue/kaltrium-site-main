export const metadata = {
  title: "Pricing – Kaltrium",
  description:
    "Simple, transparent pricing for AI proofreading and editing. One price per file — crafted for clarity and precision.",
  keywords:
    "Kaltrium pricing, AI proofreading, editing service, business text correction, marketing writing, PDF proofreading",
};

export default function PricingPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-6 pt-8 pb-16 text-[#111]">
      {/* BACK BUTTON — в верхнем левом углу */}
      <a
        href="/"
        className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-xl border border-[#d6c4a3] px-4 py-1.5 text-sm font-medium text-[#111] hover:bg-[#faf8f4] transition"
      >
        ← Back to home
      </a>

      {/* HERO */}
      <header className="text-center mt-14">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
          Simple pricing. Clear results.
        </h1>
        <p className="mt-3 text-lg text-[#444]">
          Proofreading & editing for business and marketing texts — one price per file.
        </p>

        {/* PROMO LINE */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d6c4a3] px-6 py-3 text-black font-medium shadow-[0_8px_24px_rgba(214,196,163,0.45)]">
          <span>Instant preview included</span>
          <span className="opacity-70">— see the first lines before you pay</span>
        </div>
      </header>

      {/* PRICING CARDS */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* €3 */}
        <div
          className="h-full rounded-2xl bg-white border border-zinc-200 md:border-2 md:border-zinc-200 
          shadow-[0_8px_22px_rgba(0,0,0,0.05)] 
          transition duration-300 ease-out
          motion-safe:hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]
          focus-within:ring-2 focus-within:ring-[#d6c4a3] flex flex-col"
        >
          <div className="p-6 flex flex-col grow">
            <div className="flex items-end gap-2">
              <div className="text-5xl font-semibold leading-none">€3</div>
              <div className="text-sm text-[#666] leading-none">up to 1,500 words</div>
            </div>
            <p className="mt-6 mb-6 text-sm text-[#333] leading-relaxed pl-1.5 sm:pl-2">
              Editing & proofreading for short texts.
            </p>
            <a
              href="/upload"
              className="mt-auto inline-flex justify-center w-full rounded-xl bg-[#d6c4a3] text-black px-5 py-3 font-semibold
              shadow-[0_8px_24px_rgba(214,196,163,0.45)]
              transition duration-300 ease-out
              motion-safe:hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.10)]
              active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c4a3]"
            >
              Choose €3 plan
            </a>
          </div>
        </div>

        {/* €5 */}
        <div
          className="h-full rounded-2xl bg-white border-2 border-[#cfcfcf]
          shadow-[0_8px_22px_rgba(0,0,0,0.05)]
          transition duration-300 ease-out
          motion-safe:hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]
          focus-within:ring-2 focus-within:ring-[#d6c4a3] flex flex-col"
        >
          <div className="p-6 flex flex-col grow">
            <div className="flex items-end gap-2">
              <div className="text-5xl font-semibold leading-none">€5</div>
              <div className="text-sm text-[#666] leading-none">up to 3,000 words</div>
            </div>
            <p className="mt-6 mb-6 text-sm text-[#333] leading-relaxed pl-1.5 sm:pl-2">
              Editing & proofreading for medium texts.
            </p>
            <a
              href="/upload"
              className="mt-auto inline-flex justify-center w-full rounded-xl bg-[#d6c4a3] text-black px-5 py-3 font-semibold
              shadow-[0_8px_24px_rgba(214,196,163,0.45)]
              transition duration-300 ease-out
              motion-safe:hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.10)]
              active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c4a3]"
            >
              Choose €5 plan
            </a>
          </div>
        </div>

        {/* €8 */}
        <div
          className="h-full rounded-2xl bg-white border-2 border-[#d6c4a3]
          shadow-[0_8px_22px_rgba(0,0,0,0.05)]
          transition duration-300 ease-out
          motion-safe:hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]
          focus-within:ring-2 focus-within:ring-[#d6c4a3] flex flex-col"
        >
          <div className="p-6 flex flex-col grow">
            <div className="flex items-end gap-2">
              <div className="text-5xl font-semibold leading-none">€8</div>
              <div className="text-sm text-[#666] leading-none">up to 5,000 words</div>
            </div>
            <p className="mt-6 mb-6 text-sm text-[#333] leading-relaxed pl-1.5 sm:pl-2">
              Editing & proofreading for longer texts.
            </p>
            <a
              href="/upload"
              className="mt-auto inline-flex justify-center w-full rounded-xl bg-[#d6c4a3] text-black px-5 py-3 font-semibold
              shadow-[0_8px_24px_rgba(214,196,163,0.45)]
              transition duration-300 ease-out
              motion-safe:hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.10)]
              active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c4a3]"
            >
              Choose €8 plan
            </a>
          </div>
        </div>
      </section>

      {/* FOOTNOTE */}
      <p className="mt-12 text-center text-sm text-[#666] font-medium">
        Same quality across all plans. You only pay for the word count.
      </p>
    </main>
  );
}

