// middleware.ts — временно максимально простой

import { NextResponse, type NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // просто пропускаем запрос дальше
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
