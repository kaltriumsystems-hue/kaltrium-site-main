"use client";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("Generating your PDF…");

  useEffect(() => {
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_KALTRIUM_API_URL}/status`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.ready && data?.url) {
          setStatus("Your PDF is ready! Downloading…");

          // Автотриггер скачивания
          window.location.href = data.url;
          clearInterval(checkInterval);
        }
      } catch (e) {
        console.log("Status check error:", e);
      }
    }, 5000); // каждые 5 секунд

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#faf8f4]">
      <h1 className="text-4xl font-semibold mb-4">Thank you! 🎉</h1>
      <p className="text-lg text-[#444] max-w-xl">
        {status}
        <br />
        Your edited PDF will download automatically once ready.
      </p>

      <a
        href="/"
        className="mt-10 inline-block rounded-xl bg-[#d6c4a3] px-6 py-3 font-semibold text-black shadow-md hover:shadow-lg transition"
      >
        Back to home
      </a>

      <p className="mt-6 text-sm text-neutral-500">
        If the file does not start automatically, please wait a few seconds or
        return later.
      </p>
    </main>
  );
}


