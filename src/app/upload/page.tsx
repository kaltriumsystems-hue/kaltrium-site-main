"use client";

import { useState, useMemo } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

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
  const maxWords = 3000;

  async function handleCheckout() {
    setError(null);

    if (!text.trim()) {
      setError("Please paste your text before continuing.");
      return;
    }

    if (words > maxWords) {
      setError(`Your text exceeds ${maxWords} words.`);
      return;
    }

    // save text for success page
    localStorage.setItem("kaltrium_last_text", text);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5 }),
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
    <main className="min-h-screen bg-[#f8f7f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#111] tracking-tight">
            Kaltrium Editor
          </h1>
          <p className="mt-2 text-sm text-[#555]">
            Refine your business & marketing text up to 3000 words.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#e8e5df] rounded-2xl shadow-sm p-7">
          {/* LABELS */}
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-[#111]">
              Paste your text
            </span>
            <span
              className={`text-xs ${
                words > maxWords ? "text-[#b91c1c]" : "text-[#666]"
              }`}
            >
              {words}/{maxWords}
            </span>
          </div>

          {/* TEXTAREA */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your English or German text here…"
            className="w-full h-[240px] rounded-xl border border-[#e0ded9] bg-[#fafafa] px-4 py-3 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#c7a96b]"
          />

          {/* ERROR */}
          {error && (
            <div className="mt-3 text-sm text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading || !text.trim() || words > maxWords}
            className={`w-full mt-5 rounded-xl px-4 py-3 text-sm font-medium transition ${
              loading || !text.trim() || words > maxWords
                ? "bg-[#d6cbb8] text-white cursor-not-allowed"
                : "bg-[#c7a96b] text-black hover:bg-[#b69855]"
            }`}
          >
            {loading ? "Processing…" : "Refine & Pay €5"}
          </button>

          {/* BACK HOME */}
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





