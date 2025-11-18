"use client";

import { useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

const FIXED_PRICE = 5;

// Подсчёт слов
function countWords(text: string) {
  const normalized = text.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (!normalized) return 0;
  const matches = normalized.match(/[A-Za-zÄÖÜäöüßЁА-Яёа-я0-9]+/gu);
  return matches ? matches.length : 0;
}

// Ограничение по словам
function clampToWordLimit(input: string, limit = 3000) {
  const parts =
    input
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
      .match(
        /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g
      ) || [];
  if (parts.length <= limit) return input;
  return parts.slice(0, limit).join(" ");
}

// Тип ответа превью под новый backend
type PreviewResponse = {
  ok: boolean;
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
  error?: string;
};

export default function UploadPage() {
  const [text, setText] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);

  const words = useMemo(() => countWords(text), [text]);
  const overLimit = words > 3000;

  const canPreview = words > 0 && !overLimit;
  const canPay = !!previewData && words > 0 && !overLimit;

  // PREVIEW
  async function handleGetPreview() {
    if (!canPreview) return;
    setApiError(null);
    setPreviewData(null);
    setIsPreviewLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, preview: true }),
      });

      if (!res.ok) {
        let msg = "Preview failed.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          // ignore
        }
        setApiError(msg);
        return;
      }

      const data = (await res.json()) as PreviewResponse;
      if (!data.ok) {
        setApiError(data.error || "Preview failed.");
        return;
      }

      setPreviewData(data);
    } catch (err) {
      console.error(err);
      setApiError("Network error. Please try again.");
    } finally {
      setIsPreviewLoading(false);
    }
  }

  // ОПЛАТА — фиксированная цена 5 €
  async function handlePay() {
    if (!canPay) return;
    setIsPayLoading(true);
    setApiError(null);

    try {
      // сохраняем текст, чтобы /success смог его взять
      localStorage.setItem("kaltrium_last_text", text);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: "auto",
          words,
        }),
      });

      if (!res.ok) {
        console.error("Stripe error", await res.text());
        setApiError("Payment failed. Please try again.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // редирект на Stripe Checkout
      } else {
        setApiError("No checkout URL returned.");
      }
    } catch (e) {
      console.error(e);
      setApiError("Payment error. Please try again.");
    } finally {
      setIsPayLoading(false);
    }
  }

  // ОДНА КНОПКА: сначала превью, потом оплата
  function handlePrimaryClick() {
    if (!previewData) {
      // ещё нет превью → сначала получить превью
      handleGetPreview();
    } else {
      // превью уже есть → открываем оплату
      handlePay();
    }
  }

  const primaryLabel = (() => {
    if (!previewData) {
      return isPreviewLoading ? "Getting preview…" : "Get preview";
    }
    // превью уже есть → кнопка для оплаты
    if (isPayLoading) return "Opening checkout…";
    return "Unlock full text (€5)";
  })();

  const primaryDisabled = (() => {
    if (!previewData) {
      return !canPreview || isPreviewLoading;
    }
    return !canPay || isPayLoading;
  })();

  return (
    <main className="relative mx-auto max-w-3xl px-6 pt-8 pb-20 text-[#111]">
      {/* BACK BUTTON */}
      <a
        href="/"
        className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-xl border border-[#d6c4a3] px-4 py-1.5 text-sm font-medium text-[#111]
                   hover:bg-[#faf8f4] transition"
      >
        ← Back to home
      </a>

      {/* HEADER */}
      <header className="text-center mt-16">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
          Submit your text
        </h1>
        <p className="mt-3 text-lg text-[#444]">
          Paste your business or marketing content to get an instant preview
          and, after payment, the full refined version.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d6c4a3] px-6 py-3 text-black font-medium shadow-[0_8px_24px_rgba(214,196,163,0.35)]">
          <span>Instant preview included</span>
          <span className="opacity-70">• no account, no subscription</span>
        </div>
      </header>

      {overLimit && (
        <div className="mt-6 rounded-xl border border-[#fde68a] bg-[#fff7ed] px-4 py-3 text-sm text-[#9a6700]">
          ⚠️ Your text exceeds the maximum limit (3,000 words). Please shorten
          it or split into multiple texts.
        </div>
      )}

      <section className="mt-6 bg-white border border-[#ddd] rounded-2xl shadow-[0_8px_22px_rgba(0,0,0,0.05)] p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-[#333] text-base">
            Paste up to <strong>3,000 words</strong>. One-time edit,{" "}
            <strong>€{FIXED_PRICE}</strong>.
          </p>
        </div>

        <textarea
          placeholder="Paste your text here..."
          rows={12}
          value={text}
          onChange={(e) => {
            setPreviewData(null); // новый текст → старое превью не актуально
            setText(clampToWordLimit(e.target.value, 3000));
          }}
          className="mt-5 w-full resize-none rounded-xl border border-[#cfcfcf] bg-[#fafafa] px-4 py-3 text-sm text-[#111]
                     focus:border-[#d6c4a3] focus:ring-1 focus:ring-[#d6c4a3] outline-none transition"
        />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Words */}
          <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[#666]">
              Words
            </div>
            <div className="mt-1 text-2xl font-semibold">{words}</div>
          </div>

          {/* Price (fixed) */}
          <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[#666]">
              Price
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {words > 0 && !overLimit ? `€${FIXED_PRICE}` : "—"}
            </div>
            <div className="text-xs text-[#666] mt-1">
              One refined version, no subscription.
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[#666]">
              Status
            </div>
            <div className="mt-1 text-sm font-semibold">
              {previewData
                ? "Preview ready"
                : words > 0
                ? "Waiting for preview"
                : "Paste your text"}
            </div>
          </div>
        </div>

        {apiError && (
          <p className="mt-4 text-sm text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3">
            {apiError}
          </p>
        )}
        {!overLimit && words === 0 && !apiError && (
          <p className="mt-4 text-sm text-[#666]">
            Start by pasting your text. You’ll get a free preview and QA score
            first; then you can unlock the full version for €5.
          </p>
        )}

        {/* ОДНА КНОПКА */}
        <div className="mt-8 flex justify-center">
          <button
            disabled={primaryDisabled}
            className={`rounded-xl px-8 py-3 font-semibold transition duration-200 ease-out
              ${
                !primaryDisabled
                  ? "bg-[#d6c4a3] text-black shadow-[0_8px_20px_rgba(214,196,163,0.4)] hover:bg-[#cbb993] hover:shadow-[0_10px_24px_rgba(214,196,163,0.55)] active:scale-[0.98]"
                  : "bg-[#f3f3f3] text-[#999] cursor-not-allowed shadow-none"
              }`}
            onClick={handlePrimaryClick}
          >
            {primaryLabel}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-[#666]">
          Preview shows only part of your refined text and your QA score. The
          full edited version is available after a one-time payment of €5.
        </p>

        {previewData && (
          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#666]">
                  Preview · Language: {previewData.lang.toUpperCase()}
                </p>
                <p className="mt-1 text-sm text-[#333] whitespace-pre-line">
                  {previewData.preview}
                </p>
              </div>
              {previewData.qa && previewData.avg !== null && (
                <div className="text-sm text-right">
                  <p className="font-semibold">
                    QA: {previewData.avg}/100
                  </p>
                  <p className="text-xs text-[#666]">
                    Grammar {previewData.qa.grammar} · Clarity{" "}
                    {previewData.qa.clarity}
                    <br />
                    Tone {previewData.qa.tone} · Consistency{" "}
                    {previewData.qa.consistency}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#fdfaf5] border border-[#d6c4a3] px-4 py-1 text-sm font-medium text-[#111] shadow-sm">
            🔒 Secure & private
          </span>
          <p className="mt-2 text-sm text-[#444]">
            We don’t store your texts. Processing is secure and temporary.
          </p>
        </div>
      </section>
    </main>
  );
}






