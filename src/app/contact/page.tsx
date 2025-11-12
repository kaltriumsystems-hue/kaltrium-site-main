"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// можно вынести в .env.local как NEXT_PUBLIC_FORMSPREE_ENDPOINT
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mblqjkgo";

export default function ContactPage() {
  const router = useRouter();

  // UI / статус
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Анти-спам
  const [honeypot, setHoneypot] = useState("");           // если не пусто — бот
  const startedAtRef = useRef<number>(0);                 // время загрузки
  const MIN_SECONDS = 2;                                  // анти-бот таймер
  const COOLDOWN_MS = 60_000;                             // 1 отправка в минуту

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => router.push("/"), 2500);
      return () => clearTimeout(t);
    }
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    setError(null);

    // 1) Honeypot: если поле заполнено — прерываем (делаем вид, что всё ок)
    if (honeypot.trim().length > 0) {
      setSuccess(true);
      return;
    }

    // 2) Time-trap: слишком быстро (бот/скрипт)
    const elapsedSec = (Date.now() - startedAtRef.current) / 1000;
    if (elapsedSec < MIN_SECONDS) {
      setError("Please wait a moment before sending.");
      return;
    }

    // 3) Local rate-limit: не чаще 1 раза в 60 сек
    const last = Number(localStorage.getItem("contact:lastSent") || 0);
    if (Date.now() - last < COOLDOWN_MS) {
      setError("Please wait a minute before sending another message.");
      return;
    }

    setSending(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form) as any);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Добавим служебные поля (полезно для фильтров)
        body: JSON.stringify({
          ...data,
          _form: "kaltrium-contact",
          _ts: new Date().toISOString(),
          _ua: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        }),
      });

      if (res.ok) {
        setSuccess(true);
        form.reset();
        localStorage.setItem("contact:lastSent", String(Date.now()));
      } else {
        setError("Could not send the message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f8f7] to-[#eaeaea] text-[#111]">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-8 pt-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#d6c4a3] via-[#e5dcc7] to-[#b8b8b8] bg-clip-text text-transparent">
          Kaltrium
        </h1>
        <a
          href="/"
          className="rounded-xl border border-[#d6c4a3] px-4 py-2 text-sm hover:bg-[#fdfaf5] hover:shadow-[0_2px_10px_rgba(214,196,163,0.25)] active:scale-[0.98] transition"
        >
          ← Back to Home
        </a>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-8 text-center">
        <h2 className="text-5xl font-semibold leading-tight mb-4">Get in touch.</h2>
        <p className="max-w-xl mx-auto text-[#444] text-lg">
          Questions, feedback, or ideas? We&apos;d love to hear from you.
        </p>
      </section>

      {/* STATUS */}
      <div className="mx-auto max-w-xl px-6">
        {success && (
          <div className="mb-6 rounded-xl border border-[#cbe7cb] bg-[#ecf9ec] px-4 py-3 text-sm text-[#1b5e20] text-center animate-fadeIn" role="status" aria-live="polite">
            ✅ Message sent successfully! Redirecting to home...
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-[#f5c2c7] bg-[#fde2e4] px-4 py-3 text-sm text-[#842029] text-center animate-fadeIn" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* FORM */}
      <section className="mx-auto max-w-xl px-6 pb-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] border border-[#e5e5e5] p-8 space-y-4" autoComplete="off" noValidate>
          {/* Honeypot (скрытое поле) */}
          <div className="hidden" aria-hidden="true">
            <label>
              Do not fill this field
              <input
                type="text"
                name="company"               // нейтральное имя поля
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-[#555]">Your name</label>
            <input
              name="name"
              required
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-[#dcdcdc] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6c4a3]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#555]">Your email</label>
            <input
              type="email"
              name="email"
              required
              inputMode="email"
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-[#dcdcdc] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6c4a3]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#555]">Your message</label>
            <textarea
              name="message"
              rows={5}
              required
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-[#dcdcdc] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6c4a3]"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-2xl font-semibold py-3 bg-[#d6c4a3] text-black shadow-[0_8px_20px_rgba(214,196,163,0.5)] hover:shadow-[0_12px_28px_rgba(214,196,163,0.6)] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-disabled={sending}
          >
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      {/* PRIVACY */}
      <div className="mt-12 flex flex-col items-center gap-1 pb-6">
        <span className="rounded-full bg-[#fdfaf5] border border-[#d6c4a3] px-4 py-1 text-sm font-medium text-[#111] shadow-sm">
          🔒 Secure &amp; private
        </span>
        <p className="text-sm text-[#555]">
          We don&apos;t store your data — all messages are instantly deleted after delivery.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#dcdcdc] bg-[#f3f3f3] py-8 text-center text-sm text-[#555]">
        Smart AI assistant — maintained and improved by real people.
      </footer>

      {/* CSS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </main>
  );
}
