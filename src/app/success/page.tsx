export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-2xl pt-20 text-center px-6">
      <h1 className="text-4xl font-semibold">Thank you!</h1>
      <p className="mt-4 text-lg text-neutral-700">
        Your payment was successful.  
        Your edited PDF will be available shortly.
      </p>

      <a
        href="/upload"
        className="mt-10 inline-block rounded-xl bg-[#d6c4a3] px-6 py-3 text-black font-semibold shadow-md hover:shadow-lg transition"
      >
        Upload another file
      </a>
    </main>
  );
}
