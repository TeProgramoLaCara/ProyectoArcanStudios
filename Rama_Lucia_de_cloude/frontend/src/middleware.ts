import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, decodeJwt } from "@/lib/auth/cookie";

type Rol = "admin" | "profesor" | "cliente";

function dashboardForRol(rol: Rol): string {
  if (rol === "admin") return "/admin/dashboard";
  if (rol === "profesor") return "/profesor/dashboard";
  return "/cliente/dashboard";
}

const PROTECTED_PREFIXES: Array<{ prefix: string; roles: Rol[] }> = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/profesor", roles: ["profesor", "admin"] },
  { prefix: "/cliente", roles: ["cliente", "admin"] },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token
    ? decodeJwt<{ rol?: Rol; exp?: number }>(token)
    : null;
  const expired = payload?.exp ? payload.exp * 1000 < Date.now() : false;
  const rol = !expired ? payload?.rol : undefined;

  // Si el usuario logueado entra a /login → mándalo a su dashboard
  if (pathname === "/login" && rol) {
    return NextResponse.redirect(new URL(dashboardForRol(rol), req.url));
  }

  // Página pública (landing) si no está logueado: ok. Si está logueado, sigue.
  const match = PROTECTED_PREFIXES.find((p) => pathname.startsWith(p.prefix));
  if (!match) return NextResponse.next();

  if (!rol) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!match.roles.includes(rol)) {
    return NextResponse.redirect(new URL(dashboardForRol(rol), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/profesor/:path*", "/cliente/:path*"],
};
