// middleware.ts (root)
import { NextResponse, type NextRequest } from 'next/server'

/* ---------- простейший rate-limit (в памяти) ---------- */
const hits = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60_000
const MAX_HITS = 60

function limited(ip: string) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
    return false
  }
  rec.count += 1
  return rec.count > MAX_HITS
}

/* ---------- security headers ---------- */
function applySecurityHeaders(res: NextResponse) {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://formspree.io",
  ].join('; ')

  res.headers.set('Content-Security-Policy', csp)
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  )
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains')
  }
  return res
}

/* ---------- middleware ---------- */
export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') return NextResponse.next()

  const ip =
  (req as any).ip ||
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  '0.0.0.0'


  if (limited(ip)) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  const res = NextResponse.next()
  return applySecurityHeaders(res)
}

/* ---------- matcher (не трогаем статику/robots/sitemap) ---------- */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
