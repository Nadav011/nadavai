import { NextResponse } from "next/server"

// In-memory store — replace with Buttondown/Resend/database before production.
// NOTE: In-memory rate limiter resets on cold starts; replace with Upstash Redis
// (@upstash/ratelimit) when a real email provider is wired up.
const subscribers = new Set<string>()

// Simple in-memory rate limiter: max 5 requests per IP per minute.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  // Rate limiting
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? (forwarded.split(",")[0]?.trim() ?? "unknown") : "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "יותר מדי בקשות. נסה שוב עוד דקה." },
      { status: 429, headers: { "Retry-After": "60" } },
    )
  }

  try {
    const body: unknown = await request.json()

    // Input validation — reject non-objects and non-string emails
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 })
    }
    const raw = (body as Record<string, unknown>).email
    const email = typeof raw === "string" ? raw.trim().toLowerCase() : ""

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "כתובת מייל לא תקינה" }, { status: 400 })
    }

    subscribers.add(email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 })
  }
}
