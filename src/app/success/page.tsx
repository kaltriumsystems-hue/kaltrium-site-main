export default function SuccessPage() {
  return (
    <main className="max-w-xl mx-auto text-center px-6 pt-20 pb-24">
      <h1 className="text-4xl font-semibold mb-4">Thank you!</h1>
      <p className="text-lg text-[#444] mb-6">
        Your payment was successful.  
        You can now upload your document for editing.
      </p>

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
          Upload your file →
        </a>
      </div>
    </main>
  );
}



