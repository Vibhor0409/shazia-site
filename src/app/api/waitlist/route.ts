import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DESIGNS = new Set(["", "sola", "rosa", "lumiere", "verde"]);

// Basic per-IP rate limit. In-memory only, so it resets per server instance.
// TODO: move to a shared store (e.g. Upstash Redis from the Vercel Marketplace) before launch.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  // spam trap: people never see this field
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 60) : "";
  const design = typeof body.design === "string" ? body.design : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a full email address, like name@example.com." }, { status: 400 });
  }
  if (!DESIGNS.has(design)) {
    return NextResponse.json({ error: "Please choose a design from the list." }, { status: 400 });
  }

  const record = { email, firstName, design, createdAt: new Date().toISOString() };
  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  if (webhook) {
    // Google Apps Script web app: it can't read headers, so the shared token travels in the body.
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...record, token: process.env.WAITLIST_WEBHOOK_TOKEN || "" }),
      redirect: "follow",
    }).catch(() => null);
    const data = res && res.ok ? await res.json().catch(() => null) : null;
    if (!data?.ok) return NextResponse.json({ error: "We couldn't save your place. Please try again." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  if (process.env.NODE_ENV !== "production") {
    // local development only: keep sign-ups in a gitignored file
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify(record) + "\n");
    return NextResponse.json({ ok: true });
  }

  // never silently drop a sign-up in production
  return NextResponse.json({ error: "Sign-ups open shortly. Please try again soon." }, { status: 503 });
}
