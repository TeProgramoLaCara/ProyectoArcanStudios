"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { instrumentSerif, montserrat } from "@/lib/fonts";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/admin/dashboard");
  };

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
                Make your reservations now
              </p>

              <button
                onClick={() => setShowLogin(true)}
                className="rounded-lg bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.02] hover:opacity-90"
              >
                Login
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="w-6xl max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md"
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
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-white/80">
                  Sign in to continue to your reservations panel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-white/90"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/90"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-emerald-200 focus:bg-white/15"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 accent-emerald-300"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-white/70 transition hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-3xl bg-white px-6 py-3 font-bold text-emerald-900 transition hover:scale-[1.01] hover:opacity-90"
                >
                  Sign in
                </button>
              </form>

              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="mt-5 w-full text-sm text-white/75 transition hover:text-white"
              >
                Back to landing
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BackgroundVideo>
  );
}
