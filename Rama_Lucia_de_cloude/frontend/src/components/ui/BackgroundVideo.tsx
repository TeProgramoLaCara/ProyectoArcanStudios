"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundVideo({
  children,
}: {
  children: React.ReactNode;
}) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<1 | 2>(1);

  // Ajusta esto a la duración real de tu vídeo
  const duration = 6000;
  const fadeDuration = 1000;

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    // Inicia el primer vídeo
    video1.currentTime = 0;
    video1.play().catch(() => {});

    const interval = setInterval(() => {
      if (active === 1) {
        video2.currentTime = 0;
        video2.play().catch(() => {});
        setActive(2);
      } else {
        video1.currentTime = 0;
        video1.play().catch(() => {});
        setActive(1);
      }
    }, duration - fadeDuration);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          active === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <video
        ref={video2Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          active === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10">{children}</div>
    </main>
  );
}