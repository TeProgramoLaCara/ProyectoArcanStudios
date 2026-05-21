import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, decodeJwt } from "@/lib/auth/cookie";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { error: "API_URL no configurada" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const token = data?.token as string | undefined;
  if (!token) {
    return NextResponse.json(
      { error: "Respuesta del backend sin token" },
      { status: 502 },
    );
  }

  // Calcula expiración (8h por defecto si no podemos leer el exp del token)
  const payload = decodeJwt<{ exp?: number }>(token);
  const expSeconds = payload?.exp
    ? payload.exp - Math.floor(Date.now() / 1000)
    : 60 * 60 * 8;

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.max(expSeconds, 60),
  });
  return response;
}
