"use client";

import { useEffect, useRef } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page";

type Props = {
  event: CalendarEvent;
  position: { x: number; y: number; openUpward?: boolean };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
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

export default function EventDetailCard({
  event,
  position,
  onClose,
  onEdit,
  onDelete,
}: Props) {
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
      className="w-80 overflow-hidden rounded-2xl border border-(--border) bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-accent/0 via-accent/40 to-accent/0" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
            {AULA_LABELS[event.aula]} · {event.turno === "manana" ? "Mañana" : "Tarde"}
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{
                backgroundColor: event.color,
                borderRadius: "4px",
                width: "10px",
                height: "10px",
                flexShrink: 0,
              }}
            />
            <h3 className="text-base font-semibold leading-snug text-(--text-primary)">
              {event.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-xs text-(--text-muted) transition hover:border-(--border) hover:text-(--text-primary)"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-(--border-subtle)" />

      {/* Body */}
      <div className="flex flex-col gap-4 px-5 py-4">

        {/* Profesor + Empresa en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-xl border border-(--border-subtle) bg-surface-elevated px-3 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
              Profesor
            </span>
            <span className="text-sm font-medium text-(--text-primary)">
              {event.professorName}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-(--border-subtle) bg-surface-elevated px-3 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
              Empresa
            </span>
            <span className="text-sm font-medium text-(--text-primary)">
              {event.companyName}
            </span>
          </div>
        </div>

        {/* Periodo completo */}
        <div className="flex items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-surface-elevated px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--border) text-sm">
            📅
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
              Periodo
            </span>
            <span className="text-sm font-medium text-(--text-primary)">
              {formatDate(event.start)} → {formatDate(event.end)}
            </span>
          </div>
        </div>

        {/* Turno */}
        <div className="flex items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-surface-elevated px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--border) text-sm">
            🕒
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
              Turno
            </span>
            <span className="text-sm font-medium text-(--text-primary)">
              {event.turno === "manana" ? "Mañana" : "Tarde"}
            </span>
          </div>
        </div>

        {/* Capacitaciones como badges */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
            Capacitaciones
          </span>
          <div className="flex flex-wrap gap-2">
            {event.capacitaciones.map((cap, i) => (
              <span
                key={i}
                className="rounded-full border border-(--border) bg-surface-elevated px-3 py-1 text-xs font-medium text-(--text-secondary)"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-sky-300/35 bg-sky-500/20 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/30"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-rose-300/35 bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/30"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}