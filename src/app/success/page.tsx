"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("Preparing your PDF...");

  useEffect(() => {
    async function fetchPDF() {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get("session_id");

      if (!session_id) {
        setStatus("Missing session_id.");
        return;
      }

      try {
        const res = await fetch(`/api/finish-pdf?session_id=${session_id}`);

        if (!res.ok) {
          setStatus("Error generating PDF. Please contact support.");
          return;
        }

        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Kaltrium-Edited-Report.pdf";
        link.click();

        setStatus("PDF downloaded successfully.");
      } catch (e) {
        console.error(e);
        setStatus("Unexpected error. Please try again.");
      }
    }

    fetchPDF();
  }, []);

  return (
    <main className="text-center p-10">
      <h1 className="text-3xl font-bold">Thank you!</h1>
      <p className="mt-4 text-lg">{status}</p>
    </main>
  );
}



