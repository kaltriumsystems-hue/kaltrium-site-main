import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, preview = false } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ ok: false, error: "No text" }, { status: 400 });
    }

    // Отправляем запрос на Render backend
   const backendURL =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

    if (!backendURL) {
      return NextResponse.json({ ok: false, error: "No BACKEND_URL env" }, { status: 500 });
    }

    const resp = await fetch(`${backendURL}/api/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, preview })
    });

    const isPDF = resp.headers.get("content-type") === "application/pdf";

    if (isPDF) {
      const pdf = await resp.arrayBuffer();
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=refined.pdf"
        }
      });
    }

    const data = await resp.json();
    return NextResponse.json(data);

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}
