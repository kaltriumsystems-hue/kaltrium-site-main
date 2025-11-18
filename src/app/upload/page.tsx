"use client";

import { useState, useMemo } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

const MAX_WORDS = 3000;
const PRICE = 5;

// simple word counter
function countWords(text: string) {
  const normalized = text.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

export default function UploadPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(() => countWords(text), [text]);
  const disabled = loading || !text.trim() || words > MAX_WORDS;

  async function handleCheckout() {
    setError(null);

    if (!text.trim()) {
      setError("Please paste your text before continuing.");
      return;
    }

    if (words > MAX_WORDS) {
      setError(`Your text exceeds ${MAX_WORDS} words.`);
      return;
    }

    // ⭐ store text for /success page
    localStorage.setItem("kaltrium_last_text", text);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend uses STRIPE_PRICE_ID — amount is not needed
        body: JSON.stringify({
          text,
          lang: "auto",
          words,
        }),
      });

      const json = await res.json();
      if (json?.url) {
        window.location.href = json.url;
      } else {
        setError("Failed to start checkout. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-[#111] tracking-tight">
            Submit your text
          </h1>
          <p className="mt-2 text-sm text-[#555] max-w-md mx-auto">
            Paste up to <strong>{MAX_WORDS} words</strong>. Your refined text will be available right after payment.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#d6c4a3] px-6 py-2 text-sm text-black font-medium shadow-[0_8px_20px_rgba(214,196,163,0.3)]">
            One-time edit • no subscription
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#e6e2d9] rounded-2xl shadow-sm p-8">
          
          {/* Label + word count */}
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-[#111]">
              Paste your text
            </span>
            <span
              className={`text-xs ${
                words > MAX_WORDS ? "text-[#b91c1c]" : "text-[#666]"
              }`}
            >
              {words}/{MAX_WORDS}
            </span>
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your English or German text here…"
            className="w-full h-[240px] rounded-xl border border-[#ddd] bg-[#fafafa] px-4 py-3 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#d6c4a3]"
          />

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={disabled}
            className={`w-full mt-5 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              disabled
                ? "bg-[#d8d1c4] text-[#888] cursor-not-allowed"
                : "bg-[#d6c4a3] text-black hover:bg-[#cbb893] shadow-[0_4px_12px_rgba(214,196,163,0.4)]"
            }`}
          >
            {loading ? "Processing…" : `Refine & Pay €${PRICE}`}
          </button>

          {/* Back home */}
          <div className="text-center mt-4">
            <a
              href="/"
              className="text-xs text-[#666] hover:text-[#111] underline"
            >
              ← Back home
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}





