"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, dashboardForRol } from "@/context/AuthContext";
import { instrumentSerif } from "@/lib/fonts";
import Image from "next/image";

interface Props {
  /** Texto del título principal del formulario. */
  title?: string;
  /** Subtítulo bajo el título. */
  subtitle?: string;
  /** Mostrar enlace de ayuda "¿Olvidaste tu contraseña?" */
  showForgot?: boolean;
}

export default function LoginForm({
  title = "Bienvenido",
  subtitle = "Inicia sesión para acceder a tu panel",
  showForgot = true,
}: Props) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      const next = searchParams.get("next");
      router.push(next || dashboardForRol(user.rol));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex flex-col items-center text-center">
        <Image
          src="/images/LogoArcan_NoLetras.png"
          alt="Arcan Studios"
          width={70}
          height={70}
          className="mb-4"
          priority
        />
        <h1 className={`text-5xl font-bold ${instrumentSerif.className}`}>
          {title}
        </h1>
        <p className="mt-2 text-sm text-white/80">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="email" className="text-sm font-medium text-white/90">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="password" className="text-sm font-medium text-white/90">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-300/50 bg-red-500/20 px-3 py-2 text-sm text-red-50"
          >
            {error}
          </p>
        )}

        {showForgot && (
          <div className="flex items-center justify-end text-sm">
            <span className="text-white/60">
              ¿Problemas para acceder? Contacta con tu administrador.
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-3xl bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Accediendo…" : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
