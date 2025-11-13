import { NextResponse } from "next/server";

const backendURL =
  process.env.NEXT_PUBLIC_KALTRIUM_API_URL ||
  "https://kaltrium-editor-bot.onrender.com";

export async function POST(req: Request) {
  try {
    const { text, preview = false } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { ok: false, error: "No text" },
        { status: 400 }
      );
    }

    if (!backendURL) {
      return NextResponse.json(
        { ok: false, error: "No BACKEND_URL env" },
        { status: 500 }
      );
    }

    const resp = await fetch(`${backendURL}/api/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, preview }),
    });

    const contentType = resp.headers.get("content-type") || "";

    // PDF от бэкенда
    if (contentType.includes("application/pdf")) {
      const pdf = await resp.arrayBuffer();
      return new NextResponse(pdf, {
        status: resp.status,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=refined.pdf",
        },
      });
    }

    // Если бэкенд вернул не-JSON (например HTML-страницу ошибки)
    if (!contentType.includes("application/json")) {
      const textErr = await resp.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Backend error (${resp.status}): ${textErr.slice(0, 200)}`,
        },
        { status: resp.status }
      );
    }

    // Обычный JSON-ответ
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (e: any) {
    console.error("ROUTE /api/refine ERROR:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}

