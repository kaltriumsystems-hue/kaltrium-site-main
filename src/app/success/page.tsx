"use client";

import { useEffect, useState } from "react";

export default function SuccessPage({ searchParams }: any) {
  const sessionId = searchParams?.session_id;
  const [status, setStatus] = useState("Preparing your edited PDF...");

  useEffect(() => {
    async function fetchPDF() {
      try {
        if (!sessionId) {
          setStatus("Error: Missing payment session ID.");
          return;
        }

        setStatus("Processing your document...");

        const response = await fetch(
          `https://kaltrium-editor-bot.onrender.com/result?session_id=${sessionId}`
        );

        if (!response.ok) {
          setStatus("Still processing... please wait 5–10 seconds.");
          return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Kaltrium-Edited-Text.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();

        setStatus("Your edited PDF has been downloaded automatically.");
      } catch (err) {
        setStatus("Please wait... your file is still generating.");
      }
    }

    fetchPDF();
  }, [sessionId]);

  return (
    <main className="max-w-xl mx-auto text-center px-6 pt-20 pb-24">
      <h1 className="text-4xl font-semibold mb-4">Thank you!</h1>
      <p className="text-lg text-[#333] mb-6">{status}</p>

      <div className="flex justify-center gap-4 mt-8">
        <a
          href="/"
          className="inline-block rounded-xl bg-white border border-[#d6c4a3] text-black px-6 py-3 font-semibold shadow-sm hover:bg-[#faf8f4]"
        >
          ← Back to Home
        </a>

        <a
          href="/upload"
          className="inline-block rounded-xl bg-[#d6c4a3] text-black px-6 py-3 font-semibold shadow hover:bg-[#e7d9bf]"
        >
          Upload another file →
        </a>
      </div>
    </main>
  );
}


