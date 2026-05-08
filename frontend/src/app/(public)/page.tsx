"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { instrumentSerif, montserrat } from "@/lib/fonts";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

type LoginMode = "empresa" | "staff";
type StaffRole = "admin" | "profesor";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("empresa");
  const [staffRole, setStaffRole] = useState<StaffRole>("admin");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMode === "empresa") {
      router.push("/cliente/dashboard");
      return;
    }

    if (staffRole === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    router.push("/profesor/dashboard");
  };

  function openCompanyLogin() {
    setLoginMode("empresa");
    setShowLogin(true);
  }

  function openStaffLogin() {
    setLoginMode("staff");
    setShowLogin(true);
  }

  const isStaffLogin = loginMode === "staff";

  return (
    <BackgroundVideo>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-5 text-center text-white"
            >
              <Image
                src="/images/LogoArcan_NoLetras.png"
                alt="Arcan Studios"
                width={120}
                height={120}
                priority
              />

              <div className="flex flex-col items-center leading-none">
                <h1
                  className={`text-5xl font-bold md:text-6xl ${montserrat.className}`}
                >
                  Arcan Studios
                </h1>

                <h2
                  className={`-mt-2 text-4xl md:text-5xl ${instrumentSerif.className}`}
                >
                  Reservations
                </h2>
              </div>

              <p className="text-sm text-white/90 md:text-lg">
                Gestiona tus reservas de forma sencilla
              </p>

              <button
                onClick={openCompanyLogin}
                className="rounded-lg bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.02] hover:opacity-90"
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                onClick={openStaffLogin}
                className="text-sm font-medium text-white/75 transition hover:text-white hover:underline"
              >
                Acceso docentes y administración
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={loginMode}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <Image
                  src="/images/LogoArcan_NoLetras.png"
                  alt="Arcan Studios"
                  width={70}
                  height={70}
                  className="mb-4"
                  priority
                />

                <h1
                  className={`text-5xl font-bold ${instrumentSerif.className}`}
                >
                  {isStaffLogin ? "Acceso interno" : "Bienvenido"}
                </h1>

                <p className="mt-2 text-sm text-white/80">
                  {isStaffLogin
                    ? "Inicia sesión para acceder al panel de gestión"
                    : "Inicia sesión para acceder a tu panel de reservas"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {isStaffLogin && (
                  <div className="flex flex-col gap-2 text-left">
                    <label
                      htmlFor="staff-role"
                      className="text-sm font-medium text-white/90"
                    >
                      Tipo de acceso
                    </label>

                    <select
                      id="staff-role"
                      value={staffRole}
                      onChange={(e) =>
                        setStaffRole(e.target.value as StaffRole)
                      }
                      className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-200 focus:bg-white/15"
                    >
                      <option value="admin" className="text-black">
                        Administrador
                      </option>
                      <option value="profesor" className="text-black">
                        Profesor
                      </option>
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-2 text-left">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-white/90"
                  >
                    Nombre de usuario
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={
                      isStaffLogin
                        ? "usuario_admin"
                        : "nombre_empresa"
                    }
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/90"
                  >
                    Contraseña
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Introduce tu contraseña"
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-white/80">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 accent-emerald-300"
                    />
                    Recordarme
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-white/70 transition hover:text-white hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-3xl bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.01] hover:opacity-90"
                >
                  {isStaffLogin ? "Acceder al panel" : "Iniciar sesión"}
                </button>
              </form>

              <div className="mt-5 flex flex-col items-center gap-3">
                {isStaffLogin ? (
                  <button
                    type="button"
                    onClick={() => setLoginMode("empresa")}
                    className="text-sm text-white/75 transition hover:text-white hover:underline"
                  >
                    Acceder como empresa
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoginMode("staff")}
                    className="text-sm text-white/75 transition hover:text-white hover:underline"
                  >
                    Acceso docentes y administración
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Volver al inicio
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BackgroundVideo>
  );
}