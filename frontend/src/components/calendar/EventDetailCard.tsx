"use client";

import { useEffect, useRef } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page";

type Props = {
  event: CalendarEvent;
  position: { x: number; y: number; openUpward?: boolean };
  onClose: () => void;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const AULA_LABELS: Record<string, string> = {
  aula1: "Aula 1",
  aula2: "Aula 2",
  aula3: "Aula 3",
};

export default function EventDetailCard({ event, position, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const style: React.CSSProperties = {
    position: "fixed",
    left: position.x,
    zIndex: 9999,
    transform: position.openUpward
      ? "translate(-50%, calc(-100% - 12px))"
      : "translate(-50%, 12px)",
    ...(position.openUpward ? { top: position.y } : { top: position.y }),
  };

  return (
    <div
      ref={cardRef}
      style={style}
      className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-white/20 via-white/40 to-white/10" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            {AULA_LABELS[event.aula]} · {event.turno === "manana" ? "Mañana" : "Tarde"}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: event.color }}
            />
            <h3 className="text-base font-semibold leading-snug text-white">
              {event.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/40 transition hover:border-white/20 hover:text-white/80"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* Body */}
      <div className="flex flex-col gap-4 px-5 py-4">

        {/* Profesor + Periodo en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Profesor
            </span>
            <span className="text-sm font-medium text-white/85">
              {event.professorName}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Empresa
            </span>
            <span className="text-sm font-medium text-white/85">
              {event.companyName}
            </span>
          </div>
        </div>

        {/* Periodo completo */}
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm">
            📅
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Periodo
            </span>
            <span className="text-sm font-medium text-white/85">
              {formatDate(event.start)} → {formatDate(event.end)}
            </span>
          </div>
        </div>

        {/* Capacitaciones como badges */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
            Capacitaciones
          </span>
          <div className="flex flex-wrap gap-2">
            {event.capacitaciones.map((cap, i) => (
              <span
                key={i}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}