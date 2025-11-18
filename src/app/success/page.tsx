"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

type Status = "idle" | "loading" | "success" | "error";

type FullResponse = {
  ok: boolean;
  mode: "full";
  lang: string;
  qa: {
    grammar: number;
    clarity: number;
    tone: number;
    consistency: number;
  } | null;
  avg: number | null;
  miniSummary: string;
  recommendations: string[];
  originalText: string;
  refinedText: string;
  words: number;
  error?: string;
};

export default function SuccessPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FullResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadFullReport() {
    setStatus("loading");
    setError(null);
    setData(null);

    try {
      const storedText = localStorage.getItem("kaltrium_last_text") || "";

      if (!storedText.trim()) {
        setStatus("error");
        setError(
          "We could not find your text. Please go back to the upload page and try again."
        );
        return;
      }

      const res = await fetch(`${API_BASE}/api/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: storedText, preview: false }),
      });

      if (!res.ok) {
        let msg = "Failed to generate the full report.";
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

      const json = (await res.json()) as FullResponse;
      if (!json.ok) {
        setStatus("error");
        setError(json.error || "Failed to generate the full report.");
        return;
      }

      setData(json);
      setStatus("success");
    } catch (e) {
      console.error("Finalize error:", e);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  // Авто-запуск при заходе на страницу
  useEffect(() => {
    if (status === "idle") {
      loadFullReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCopy() {
    if (!data?.refinedText) return;
    try {
      await navigator.clipboard.writeText(data.refinedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleDownloadTxt() {
    if (!data?.refinedText) return;
    const blob = new Blob([data.refinedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `kaltrium-refined-${today}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2 text-[#111] text-center">
          Payment successful 🎉
        </h1>
        <p className="text-sm text-[#555] mb-6 text-center">
          Your payment has been processed. We’re now generating your full refined text and quality report.
        </p>

        {status === "loading" && (
          <p className="text-sm text-[#555] mb-4 text-center">
            Preparing your full report… This usually takes a few seconds.
          </p>
        )}

        {status === "error" && (
          <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </div>
        )}

        {status === "error" && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadFullReport}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium bg-[#111] text-white hover:bg-black transition"
            >
              Try again
            </button>
          </div>
        )}

        {status !== "success" && (
          <div className="text-center">
            <a
              href="/upload"
              className="mt-3 inline-block text-xs text-[#666] hover:text-[#111] underline"
            >
              ← Back to upload page
            </a>
          </div>
        )}

        {status === "success" && data && (
          <>
            {/* QA / Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                <div className="text-xs uppercase tracking-wide text-[#666]">
                  Overall QA
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {data.avg !== null ? `${data.avg}/100` : "—"}
                </div>
                {data.qa && (
                  <p className="mt-2 text-xs text-[#666]">
                    Grammar {data.qa.grammar} · Clarity {data.qa.clarity}
                    <br />
                    Tone {data.qa.tone} · Consistency {data.qa.consistency}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4 col-span-1 md:col-span-2">
                <div className="text-xs uppercase tracking-wide text-[#666] mb-1">
                  Summary
                </div>
                <p className="text-sm text-[#333] whitespace-pre-line">
                  {data.miniSummary || "Your text has been refined to improve clarity, tone, and overall impact."}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div className="mb-6 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                <div className="text-xs uppercase tracking-wide text-[#666] mb-2">
                  Key recommendations
                </div>
                <ul className="list-disc list-inside text-sm text-[#333] space-y-1">
                  {data.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Refined text */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-[#666]">
                  Refined text
                </div>
                <div className="text-xs text-[#888]">
                  Language: {data.lang.toUpperCase()} · {data.words} words
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition"
                >
                  {copied ? "Copied ✓" : "Copy text"}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-[#d6c4a3] text-black hover:bg-[#cbb993] transition"
                >
                  Download .txt
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4 max-h-[420px] overflow-auto">
              <pre className="whitespace-pre-wrap text-sm text-[#111]">
                {data.refinedText}
              </pre>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/upload"
                className="inline-block text-xs text-[#666] hover:text-[#111] underline"
              >
                ← Refine another text
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}



