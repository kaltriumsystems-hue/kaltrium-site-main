"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

type Status = "idle" | "loading" | "error";

function countWords(text: string) {
  const normalized = text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
  if (!normalized) return 0;
  const matches = normalized.match(/\S+/g);
  return matches ? matches.length : 0;
}

export default function UploadPage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"auto" | "en" | "de">("auto");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(() => countWords(text), [text]);
  const maxWords = 3000;

  const disabled = useMemo(() => {
    if (!text.trim()) return true;
    if (words === 0) return true;
    if (words > maxWords) return true;
    return status === "loading";
  }, [text, words, maxWords, status]);

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  async function handleCheckout() {
    if (disabled) return;
    setStatus("loading");
    setError(null);

    try {
      // сохраняем текст локально, чтобы SuccessPage могла его забрать
      localStorage.setItem("kaltrium_last_text", text);

      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5,
          currency: "eur",
          lang,
        }),
      });

      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
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
        setError("We could not start the payment session. Please try again.");
        return;
      }

      // переходим на Stripe Checkout
      window.location.href = json.url as string;
    } catch (e) {
      console.error("Checkout error:", e);
      setStatus("error");
      setError("Network error. Please try again.");
    } finally {
      setStatus("idle");
    }
  }

  // На всякий случай: если человек вернулся назад — подставим текст из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kaltrium_last_text");
    if (saved && !text) {
      setText(saved);
    }
  }, []); // только при первом рендере

  return (
    <main className="min-h-screen bg-[#f5f2eb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Верхний блок — заголовок и описание */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e0d4bd] bg-[#fdfaf5] px-4 py-1 text-xs uppercase tracking-[0.12em] text-[#8a7a55]">
            Kaltrium Editor · Business & Marketing Texts
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-[#14110f]">
            Refine your text like a <span className="text-[#c7a96b]">professional editor</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#4b4338] max-w-2xl mx-auto">
            Paste your English or German business / marketing text. We&apos;ll
            clean up grammar, polish tone, and improve clarity — in seconds, not hours.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] items-start">
          {/* Левая колонка — textarea */}
          <section className="bg-white rounded-2xl border border-[#e5decf] shadow-sm px-5 py-5 md:px-6 md:py-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium text-[#14110f]">
                  Paste your text
                </h2>
                <p className="text-xs text-[#7b7468]">
                  Business emails, landing pages, LinkedIn posts, product descriptions, and more.
                </p>
              </div>

              <div className="flex flex-col items-end text-right">
                <span
                  className={`text-xs font-medium ${
                    words > maxWords ? "text-[#b91c1c]" : "text-[#4b4338]"
                  }`}
                >
                  {words}/{maxWords} words
                </span>
                {words > maxWords && (
                  <span className="text-[11px] text-[#b91c1c]">
                    Please shorten your text.
                  </span>
                )}
              </div>
            </div>

            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your English or German text here..."
              className="w-full h-[260px] md:h-[320px] resize-none rounded-xl border border-[#e2ddcf] bg-[#faf7f1] px-3.5 py-3 text-sm text-[#14110f] focus:outline-none focus:ring-2 focus:ring-[#c7a96b] focus:border-[#c7a96b]"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#7b7468]">
                <span className="font-medium">Language:</span>
                <select
                  value={lang}
                  onChange={(e) =>
                    setLang(e.target.value as "auto" | "en" | "de")
                  }
                  className="rounded-lg border border-[#e2ddcf] bg-white px-2 py-1 text-xs text-[#14110f] focus:outline-none focus:ring-1 focus:ring-[#c7a96b]"
                >
                  <option value="auto">Detect automatically</option>
                  <option value="en">English</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="text-[11px] text-[#9a8f7a]">
                No Russian UI · Texts in EN &amp; DE are supported.
              </div>
            </div>
          </section>

          {/* Правая колонка — прайс и кнопка */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#d9cdb6] shadow-sm px-5 py-5">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-[#14110f]">
                  One-time refinement
                </h2>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-[#14110f]">
                    €5
                  </div>
                  <div className="text-[11px] text-[#7b7468]">
                    up to 3&nbsp;000 words
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#4b4338] mb-3">
                Pay once for this text. No subscription, no login, no hidden fees.
              </p>

              <ul className="mb-4 space-y-1.5 text-xs text-[#4b4338]">
                <li>✓ Grammar, clarity, tone, and consistency improvements</li>
                <li>✓ Short summary and key recommendations</li>
                <li>✓ Instant refined text on the success page</li>
                <li>✓ Download as a clean <code>.txt</code> file</li>
              </ul>

              {error && (
                <div className="mb-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[11px] text-[#b91c1c]">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={disabled}
                className={`w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  disabled
                    ? "bg-[#d4c7aa] text-[#f5f1e7] cursor-not-allowed"
                    : "bg-[#c7a96b] text-[#14110f] hover:bg-[#b89651] hover:shadow-sm"
                }`}
              >
                {status === "loading" ? "Preparing checkout…" : "Refine text – €5"}
              </button>

              <p className="mt-2 text-[11px] text-[#7b7468] text-center">
                You will be redirected to Stripe for secure payment.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5decf] bg-[#fdfaf5] px-4 py-3 text-[11px] text-[#4b4338]">
              <div className="font-medium mb-1 text-[#14110f]">
                How it works
              </div>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Paste your text and check the word count.</li>
                <li>Click “Refine text – €5” and complete payment.</li>
                <li>On the success page, copy or download your refined text.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}







