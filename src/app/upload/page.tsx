"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

import { useMemo, useState } from "react";

type Plan = { name: string; price: number; maxWords: number; border?: string; bg?: string };

const PLANS: Plan[] = [
  { name: "€3", price: 3, maxWords: 1000 },
  { name: "€5", price: 5, maxWords: 2000, border: "#cfcfcf", bg: "#fcfcfc" },
  { name: "€8", price: 8, maxWords: 3000, border: "#d6c4a3", bg: "#fdfaf5" },
];

async function handlePay(price: number) {
  try {
    const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });

    if (!res.ok) {
      console.error("Stripe error", await res.text());
      alert("Payment failed. Please try again.");
      return;
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // редирект на Stripe Checkout
    } else {
      alert("No checkout URL returned.");
    }
  } catch (e) {
    console.error(e);
    alert("Payment error. Please try again.");
  }
}

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
      .match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g) || [];
  if (parts.length <= limit) return input;
  return parts.slice(0, limit).join(" ");
}

function selectPlan(words: number): Plan | null {
  if (words === 0) return null;
  if (words <= 1000) return PLANS[0];
  if (words <= 2000) return PLANS[1];
  if (words <= 3000) return PLANS[2];
  return null;
}

// Тип ответа превью под новый backend
type PreviewResponse = {
  ok: boolean;
  lang: string;
  qa: { grammar: number; clarity: number; tone: number; consistency: number };
  avg: number;
  preview: string;
  words: number; // <— важное поле для PDF
  error?: string;
};

export default function UploadPage() {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // ВАЖНО: если PDF → берём количество слов из previewData.words
  const words = useMemo(() => {
    if (pdfFile) {
      return previewData?.words ?? 0;
    }
    return countWords(text);
  }, [text, pdfFile, previewData]);

  const plan = useMemo(() => selectPlan(words), [words]);
  const overLimit = words > 3000;

  // можно превью, если есть либо текст, либо PDF
  const canPreview = (words > 0 || !!pdfFile) && !overLimit;

  // Загрузка PDF
  function handlePdfUpload(file: File | null) {
    setPdfError(null);
    setApiError(null);
    setPreviewData(null);
    setPdfFile(null);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setPdfError("PDF is too large (max 2 MB).");
      return;
    }
    if (file.type !== "application/pdf") {
      setPdfError("Only PDF files are allowed.");
      return;
    }

    // Сохраняем файл и очищаем текст → включаем PDF-режим
    setPdfFile(file);
    setText("");
  }

  // PREVIEW
  async function handleGetPreview() {
    if (!canPreview) return;
    setApiError(null);
    setPreviewData(null);
    setIsPreviewLoading(true);

    try {
      let res: Response;

      if (pdfFile && !text.trim()) {
        // PREVIEW ДЛЯ PDF → multipart/form-data
        const form = new FormData();
        form.append("file", pdfFile);
        form.append("preview", "true");
        res = await fetch(`${API_BASE}/api/refine`, {
          method: "POST",
          body: form,
        });
      } else {
        // PREVIEW ДЛЯ ТЕКСТА → JSON
        res = await fetch(`${API_BASE}/api/refine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, preview: true }),
        });
      }

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

  // ПОЛНЫЙ PDF
  async function handleGetPdf() {
    if (!canPreview) return;
    setApiError(null);
    setIsPdfLoading(true);

    try {
      let res: Response;

      if (pdfFile && !text.trim()) {
        const form = new FormData();
        form.append("file", pdfFile);
        form.append("preview", "false");
        res = await fetch(`${API_BASE}/api/refine`, {
          method: "POST",
          body: form,
        });
      } else {
        res = await fetch(`${API_BASE}/api/refine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, preview: false }),
        });
      }

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json();
          setApiError(data?.error || "Request failed.");
        } else {
          setApiError("Request failed.");
        }
        return;
      }

      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kaltrium-refined.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data?.error) {
          setApiError(data.error);
        } else {
          setApiError("Unexpected response from server.");
        }
      } else {
        setApiError("Unexpected response type from server.");
      }
    } catch (err) {
      console.error(err);
      setApiError("Network error. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  }

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
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Submit your text</h1>
        <p className="mt-3 text-lg text-[#444]">
          Paste your business or marketing content to get an instant preview and price.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#d6c4a3] px-6 py-3 text-black font-medium shadow-[0_8px_24px_rgba(214,196,163,0.35)]">
          <span>Instant preview included</span>
          <span className="opacity-70">• we don’t store your texts</span>
        </div>
      </header>

      {overLimit && (
        <div className="mt-6 rounded-xl border border-[#fde68a] bg-[#fff7ed] px-4 py-3 text-sm text-[#9a6700]">
          ⚠️ Your text exceeds the maximum limit (5,000 words). Please shorten it or split into multiple files.
        </div>
      )}

      <section className="mt-6 bg-white border border-[#ddd] rounded-2xl shadow-[0_8px_22px_rgba(0,0,0,0.05)] p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-[#333] text-base">
            Paste up to <strong>3,000 words</strong>. Price is detected automatically.
          </p>

          <label
            htmlFor="pdfUpload"
            className="rounded-xl border border-[#d6c4a3] bg-white text-black px-5 py-2 text-sm font-medium cursor-pointer
                       transition duration-200 ease-out
                       hover:bg-[#fdfaf5] hover:shadow-[0_6px_16px_rgba(214,196,163,0.35)]
                       active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c4a3]"
          >
            Upload PDF instead
          </label>
          <input
            id="pdfUpload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handlePdfUpload(e.target.files?.[0] || null)}
          />
        </div>

        <textarea
          placeholder={
            pdfFile
              ? "PDF uploaded. You can still paste text here instead, if you want."
              : "Paste your text here..."
          }
          rows={12}
          value={text}
          onChange={(e) => {
            setPdfFile(null); // если пользователь начинает печатать — выходим из PDF-режима
            setText(clampToWordLimit(e.target.value, 3000));
          }}
          className="mt-5 w-full resize-none rounded-xl border border-[#cfcfcf] bg-[#fafafa] px-4 py-3 text-sm text-[#111]
                     focus:border-[#d6c4a3] focus:ring-1 focus:ring-[#d6c4a3] outline-none transition"
        />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[#666]">Words</div>
            <div className="mt-1 text-2xl font-semibold">{words}</div>
          </div>

          <div
            className="rounded-2xl border p-4 text-center transition-colors duration-300"
            style={{
              borderColor: plan?.border ?? "#e5e7eb",
              backgroundColor: plan?.bg ?? "white",
            }}
          >
            <div className="text-xs uppercase tracking-wide text-[#666]">Detected plan</div>
            <div className="mt-1 text-xl font-semibold">
              {overLimit ? "—" : plan ? plan.name : pdfFile ? "Based on PDF" : "—"}
            </div>
            <div className="text-xs text-[#666] mt-1">
              {overLimit
                ? "Limit is 5,000 words"
                : plan
                ? `up to ${plan.maxWords.toLocaleString()} words`
                : pdfFile
                ? "plan will be based on extracted words"
                : "paste text to detect"}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-zinc-200 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[#666]">Price</div>
            <div className="mt-1 text-2xl font-semibold">
              {overLimit ? "—" : plan ? plan.name : pdfFile ? "€3–€8" : "—"}
            </div>
          </div>
        </div>

        {pdfError && (
          <p className="mt-4 text-sm text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3">
            {pdfError}
          </p>
        )}
        {apiError && (
          <p className="mt-4 text-sm text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3">
            {apiError}
          </p>
        )}
        {!overLimit && words === 0 && !pdfError && !apiError && !pdfFile && (
          <p className="mt-4 text-sm text-[#666]">
            Start by pasting your text — or upload a PDF. We’ll show the plan and price automatically.
          </p>
        )}
        {pdfFile && (
          <p className="mt-4 text-sm text-[#444]">
            PDF selected: <strong>{pdfFile.name}</strong>. You can request a preview or the full refined PDF.
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            disabled={!canPreview || isPreviewLoading}
            className={`rounded-xl px-8 py-3 font-semibold transition duration-200 ease-out
              ${
                canPreview && !isPreviewLoading
                  ? "bg-[#d6c4a3] text-black shadow-[0_8px_20px_rgba(214,196,163,0.4)] hover:bg-[#cbb993] hover:shadow-[0_10px_24px_rgba(214,196,163,0.55)] active:scale-[0.98]"
                  : "bg-[#f3f3f3] text-[#999] cursor-not-allowed shadow-none"
              }`}
            onClick={handleGetPreview}
          >
            {isPreviewLoading ? "Getting preview…" : "Get preview"}
          </button>

          <button
            disabled={!canPreview || isPdfLoading}
            className={`rounded-xl px-8 py-3 font-medium transition duration-200 ease-out
              ${
                canPreview && !isPdfLoading
                  ? "bg-white border border-[#d6c4a3] text-black hover:bg-[#fdfaf5] hover:shadow-[0_8px_20px_rgba(214,196,163,0.35)] active:scale-[0.98]"
                  : "bg-white border border-[#e5e5e5] text-[#999] cursor-not-allowed shadow-none"
              }`}
            onClick={handleGetPdf}
          >
            {isPdfLoading ? "Preparing PDF…" : "Continue to payment"}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-[#666]">
          Preview shows only the first part of your refined text. The full edited, branded PDF is delivered after
          payment.
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
              <div className="text-sm text-right">
                <p className="font-semibold">QA: {previewData.avg}/100</p>
                <p className="text-xs text-[#666]">
                  Grammar {previewData.qa.grammar} · Clarity {previewData.qa.clarity}
                  <br />
                  Tone {previewData.qa.tone} · Consistency {previewData.qa.consistency}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-1">
          <span className="rounded-full bg-[#fdfaf5] border border-[#d6c4a3] px-4 py-1 text-sm font-medium text-[#111] shadow-sm">
            🔒 Secure & private
          </span>
          <p className="text-sm text-[#444] mt-2 text-center">
            Processing is secure and immediately deleted. PDF (optional): max 2 MB, text-based only (no scans).
          </p>
        </div>
      </section>
    </main>
  );
}





