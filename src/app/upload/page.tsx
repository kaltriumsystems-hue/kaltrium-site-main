"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

type Status = "idle" | "preview-loading" | "checkout-loading" | "ready" | "error";

type Plan = { name: string; price: number; maxWords: number; highlight?: boolean };

const PLANS: Plan[] = [
  { name: "€3", price: 3, maxWords: 1500 },
  { name: "€5", price: 5, maxWords: 3000, highlight: true },
  { name: "€8", price: 8, maxWords: 5000 },
];

type PreviewResponse = {
  ok: boolean;
  mode: "preview";
  lang: string;
  qa: {
    grammar: number;
    clarity: number;
    tone: number;
    consistency: number;
  } | null;
  avg: number | null;
  preview: string;
  words: number;
  restrictedWarning?: string | null;
  error?: string;
};

export default function UploadPage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"auto" | "en" | "de" | "ru">("auto");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // восстановить текст из localStorage, если вернулись после cancel на Stripe
  useEffect(() => {
    const stored = localStorage.getItem("kaltrium_last_text");
    if (stored && !text) {
      setText(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const wordCount = useMemo(() => {
    const normalized = text.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
    if (!normalized) return 0;
    return normalized.split(/\s+/).length;
  }, [text]);

  const maxPlanWords = selectedPlan?.maxWords ?? PLANS[1].maxWords;

  const overPlanLimit = wordCount > maxPlanWords;

  async function handlePreview() {
    if (!text.trim()) {
      setError("Please paste your text first.");
      return;
    }

    setStatus("preview-loading");
    setError(null);
    setPreviewData(null);

    try {
      const res = await fetch(`${API_BASE}/api/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang, preview: true }),
      });

      if (!res.ok) {
        let msg = "Failed to load preview.";
        try {
          const t = await res.json();
          if (t?.error) msg = t.error;
        } catch {
          // ignore
        }
        setStatus("error");
        setError(msg);
        return;
      }

      const json = (await res.json()) as PreviewResponse;
      if (!json.ok) {
        setStatus("error");
        setError(json.error || "Failed to load preview.");
        return;
      }

      setPreviewData(json);
      setStatus("ready");
    } catch (e) {
      console.error("Preview error:", e);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  async function handleCheckout() {
    if (!text.trim()) {
      setError("Please paste your text before payment.");
      return;
    }
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }
    if (overPlanLimit) {
      setError(
        `Your text is too long for the selected plan (${wordCount} words > ${maxPlanWords}).`
      );
      return;
    }

    setStatus("checkout-loading");
    setError(null);

    try {
      // ключевая строка для success-страницы:
      localStorage.setItem("kaltrium_last_text", text);

      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: selectedPlan.price,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to start checkout.";
        try {
          const t = await res.json();
          if (t?.error) msg = t.error;
        } catch {
          // ignore
        }
        setStatus("error");
        setError(msg);
        return;
      }

      const json = await res.json();
      if (!json?.url) {
        setStatus("error");
        setError("No checkout URL returned from server.");
        return;
      }

      window.location.href = json.url;
    } catch (e) {
      console.error("Checkout error:", e);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-[0_18px_45px_rgba(15,15,15,0.08)] border border-[#e3ded4] px-8 py-8 md:px-10 md:py-10">
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#151515]">
            Kaltrium Editor · Refine your business & marketing text
          </h1>
          <p className="mt-2 text-sm md:text-[15px] text-[#5b5b5b] max-w-2xl">
            Paste your English, German or Russian business text, get a quick free
            preview, then unlock a full refined version with a detailed quality report.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Text input */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#8a8170]">
                  Your text
                </p>
                <p className="text-[11px] text-[#a8a29e]">
                  We don’t store your content permanently.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] text-[#6b6b6b]">
                  <span>Language</span>
                  <select
                    value={lang}
                    onChange={(e) =>
                      setLang(e.target.value as "auto" | "en" | "de" | "ru")
                    }
                    className="border border-[#d4cbb8] rounded-full px-2.5 py-1 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-[#d6c4a3]"
                  >
                    <option value="auto">Auto</option>
                    <option value="en">EN</option>
                    <option value="de">DE</option>
                    <option value="ru">RU</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e3ded4] bg-[#fbfaf8]">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Paste your business email, landing page section, LinkedIn post, or marketing copy here..."
                className="w-full min-h-[260px] md:min-h-[320px] resize-none rounded-2xl bg-transparent px-4 py-3 text-sm md:text-[15px] text-[#151515] placeholder:text-[#b0a79b] focus:outline-none"
              />
              <div className="flex items-center justify-between px-4 py-2 border-t border-[#e9e4da] text-[11px] text-[#8a8170]">
                <span>
                  Words:&nbsp;
                  <span className={wordCount > maxPlanWords ? "text-[#b91c1c]" : ""}>
                    {wordCount}
                  </span>
                  {selectedPlan && (
                    <>
                      {" "}
                      / {maxPlanWords} (selected plan)
                    </>
                  )}
                </span>
                <span>Max technical limit: 3000 words</span>
              </div>
            </div>

            {/* Preview / error */}
            <div className="mt-4 flex flex-col gap-3">
              {error && (
                <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-[12px] text-[#b91c1c]">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePreview}
                  disabled={status === "preview-loading" || !text.trim()}
                  className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-medium bg-[#151515] text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {status === "preview-loading"
                    ? "Generating free preview…"
                    : "Get free preview"}
                </button>

                <button
                  onClick={handleCheckout}
                  disabled={
                    status === "checkout-loading" ||
                    !text.trim() ||
                    !selectedPlan ||
                    overPlanLimit
                  }
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium bg-[#d6c4a3] text-[#151515] hover:bg-[#cbb793] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {status === "checkout-loading"
                    ? "Redirecting to payment…"
                    : "Proceed to payment"}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Plans + preview card */}
          <section className="lg:col-span-2 flex flex-col gap-5">
            {/* Plans */}
            <div className="rounded-2xl border border-[#e3ded4] bg-[#fdfbf7] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8a8170] mb-3">
                Choose your plan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan?.price === plan.price;
                  return (
                    <button
                      key={plan.price}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={[
                        "flex flex-col items-start rounded-2xl border px-3.5 py-3 text-left transition",
                        plan.highlight
                          ? "border-[#d6c4a3] bg-[#fdf8f1]"
                          : "border-[#e2ddd3] bg-white",
                        isSelected ? "ring-2 ring-[#151515]" : "hover:border-[#c4b79f]",
                      ].join(" ")}
                    >
                      <span className="text-[13px] font-semibold text-[#151515]">
                        {plan.name}
                      </span>
                      <span className="mt-0.5 text-[11px] text-[#7a7467]">
                        Up to {plan.maxWords.toLocaleString()} words
                      </span>
                      <span className="mt-1 text-[10px] text-[#a8a29e]">
                        One refined text + QA report
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-[#9f9585]">
                You’ll be redirected to a secure Stripe checkout. After payment, your
                full refined text and QA report will appear instantly on the success page.
              </p>
            </div>

            {/* Preview card */}
            <div className="rounded-2xl border border-[#e3ded4] bg-[#fbfaf8] px-4 py-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.14em] text-[#8a8170]">
                  Free preview
                </p>
                {previewData && (
                  <span className="text-[11px] text-[#918779]">
                    {previewData.words} words ·{" "}
                    {previewData.lang ? previewData.lang.toUpperCase() : "AUTO"}
                  </span>
                )}
              </div>

              {!previewData && status !== "preview-loading" && (
                <p className="text-[12px] text-[#75706a]">
                  Click <span className="font-medium">“Get free preview”</span> to see how
                  Kaltrium Editor improves your text before you pay.
                </p>
              )}

              {status === "preview-loading" && (
                <p className="text-[12px] text-[#75706a]">
                  Analysing your text and preparing a short preview…
                </p>
              )}

              {previewData && (
                <>
                  {previewData.qa && (
                    <div className="mb-3 mt-1 flex flex-wrap gap-2 text-[11px] text-[#6f6a63]">
                      <span>
                        Grammar {previewData.qa.grammar}/100 · Clarity{" "}
                        {previewData.qa.clarity}/100
                      </span>
                      <span>
                        Tone {previewData.qa.tone}/100 · Consistency{" "}
                        {previewData.qa.consistency}/100
                      </span>
                    </div>
                  )}

                  <div className="mt-1 rounded-xl border border-[#e3ded4] bg-white px-3 py-2 max-h-[160px] overflow-auto">
                    <p className="text-[12px] text-[#151515] whitespace-pre-wrap">
                      {previewData.preview}
                    </p>
                  </div>

                  {previewData.restrictedWarning && (
                    <p className="mt-2 text-[11px] text-[#92400e]">
                      {previewData.restrictedWarning}
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}






