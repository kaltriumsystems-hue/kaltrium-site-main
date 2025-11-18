export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-[#111]">
          Payment cancelled
        </h1>

        <p className="mt-3 text-sm text-[#555]">
          Your payment wasn’t completed.<br />
          You can return to the editor and try again anytime.
        </p>

        <a
          href="/upload"
          className="mt-6 inline-block rounded-xl px-6 py-3 text-sm font-medium bg-[#d6c4a3] hover:bg-[#cbb796] text-black transition"
        >
          ← Back to editor
        </a>
      </div>
    </main>
  );
}

