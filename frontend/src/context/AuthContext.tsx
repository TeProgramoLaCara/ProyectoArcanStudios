"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type Rol = "admin" | "profesor" | "cliente";
export type TipoCuenta = "usuario" | "profesor";

export interface SessionUser {
  id: number;
  tipo: TipoCuenta;
  rol: Rol;
  nombre: string;
  email: string;
  empresa?: { id: number; nombre: string } | null;
  disponibilidad?: string | null;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function dashboardForRol(rol: Rol): string {
  if (rol === "admin") return "/admin/dashboard";
  if (rol === "profesor") return "/profesor/dashboard";
  return "/cliente/dashboard";
}

async function fetchMe(): Promise<SessionUser | null> {
  const res = await fetch("/api/backend/auth/me", {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!res.ok) return null;
  return res.json();
}

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(initialUser === null);
  const router = useRouter();

  const refresh = useCallback(async () => {
    setLoading(true);
    const me = await fetchMe();
    setUser(me);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialUser === null) void refresh();
  }, [initialUser, refresh]);

  const login = useCallback(
    async (email: string, password: string): Promise<SessionUser> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Credenciales incorrectas");
      }
      const me = await fetchMe();
      if (!me) throw new Error("No se pudo recuperar la sesión");
      setUser(me);
      return me;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { dashboardForRol };
