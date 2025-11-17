"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

type Status = "idle" | "loading" | "success" | "error";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function downloadPdf() {
    if (!sessionId) {
      setError("Missing session ID in the link.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/finalize?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        let msg = "Failed to generate PDF.";
        try {
          const text = await res.text();
          if (text) msg = text;
        } catch {
          // ignore
        }
        setError(msg);
        setStatus("error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // открыть PDF в новой вкладке
      window.open(url, "_blank", "noopener,noreferrer");

      setStatus("success");
    } catch (e) {
      console.error("Finalize error:", e);
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  // Авто-запуск при первом заходе на страницу
  useEffect(() => {
    if (status === "idle") {
      downloadPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md px-6 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-3 text-[#111]">
          Payment successful 🎉
        </h1>

        {status === "loading" && (
          <>
            <p className="text-sm text-[#555] mb-4">
              We’re preparing your refined PDF report. It will open in a new tab
              in a moment…
            </p>
            <p className="text-xs text-[#777]">
              If nothing happens, use the button below to download again.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-sm text-[#333] mb-4">
              Your full edited PDF report is ready.
            </p>
            <button
              onClick={downloadPdf}
              className="mt-2 inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium bg-[#d6c4a3] hover:bg-[#cbb796] text-black transition"
            >
              Download PDF again
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={downloadPdf}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium bg-[#111] text-white hover:bg-black transition"
            >
              Try again
            </button>
          </>
        )}

        {status === "idle" && (
          <p className="text-sm text-[#555]">
            Loading your payment result…
          </p>
        )}

        <a
          href="/"
          className="mt-6 inline-block text-xs text-[#666] hover:text-[#111] underline"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}



