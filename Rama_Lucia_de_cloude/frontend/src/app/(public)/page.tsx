"use client";

import { useState } from "react";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import LoginForm from "@/components/auth/LoginForm";
import { instrumentSerif, montserrat } from "@/lib/fonts";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

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
                onClick={() => setShowLogin(true)}
                className="rounded-lg bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.02] hover:opacity-90"
              >
                Iniciar sesión
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              <LoginForm
                title="Bienvenido"
                subtitle="Inicia sesión para acceder a tu panel"
              />
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="text-sm text-white/60 transition hover:text-white"
              >
                Volver al inicio
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BackgroundVideo>
  );
}
