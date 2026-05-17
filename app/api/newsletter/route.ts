import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const existing = await prisma.newsletterSignup.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const signup = await prisma.newsletterSignup.create({
    data: {
      email,
      source: body.source ? String(body.source).slice(0, 80) : null,
      page: body.page ? String(body.page).slice(0, 240) : null,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null
    }
  });

  return NextResponse.json({ ok: true, signup });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signups = await prisma.newsletterSignup.findMany({
    orderBy: { createdAt: "desc" },
    take: 500
  });

  return NextResponse.json({ signups });
}
