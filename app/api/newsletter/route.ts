import { NextResponse } from "next/server"

const subscribers = new Set<string>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "כתובת מייל לא תקינה" }, { status: 400 })
    }

    // In-memory store for now. Replace with Buttondown/Resend/database later.
    subscribers.add(email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 })
  }
}
