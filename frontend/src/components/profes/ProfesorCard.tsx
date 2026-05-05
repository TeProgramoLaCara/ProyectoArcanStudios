"use client";

import type { Profesor } from "./types";
import { AVATAR_COLORS, CAP_PILL_STYLES, STATUS_COLORS } from "./colors";

type Props = {
  profesor: Profesor;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProfesorCard({ profesor, onEdit, onDelete }: Props) {
  const avatarColor = AVATAR_COLORS[profesor.id % AVATAR_COLORS.length];
  function getInitials(nombre: string, apellidos?: string) {
    const fullName = `${nombre ?? ""} ${apellidos ?? ""}`.trim();

    if (!fullName) return "?";

    const parts = fullName.split(" ").filter(Boolean);

    const firstInitial = parts[0]?.[0] ?? "";
    const secondInitial = parts[1]?.[0] ?? "";

    return `${firstInitial}${secondInitial}`.toUpperCase();
  }

  const initials = getInitials(profesor.nombre, profesor.apellidos);

  return (
    <div className="relative flex flex-col gap-4 rounded-[18px] border border-(--border) bg-surface p-5 transition hover:bg-surface-elevated">
      {/* Edit shortcut — top-right corner */}
      <button
        onClick={onEdit}
        title="Editar"
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-sm text-(--text-muted) transition hover:border-accent/40 hover:text-accent-light"
      >
        ✎
      </button>

      {/* Avatar + name */}
      <div className="flex items-center gap-3 pr-8">
        <div className="relative shrink-0">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          {/* Status dot */}
          <span
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface"
            style={{ backgroundColor: STATUS_COLORS[profesor.status].dot }}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-(--text-primary)">
            {`${profesor.nombre} ${profesor.apellidos ?? ""}`.trim()}
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: STATUS_COLORS[profesor.status].text }}
          >
            {profesor.status === "active" ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
          <span className="shrink-0 text-(--text-muted)">✉</span>
          <span className="truncate">{profesor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
          <span className="shrink-0 text-(--text-muted)">✆</span>
          <span>{profesor.tel}</span>
        </div>
      </div>

      {/* Capacitaciones pills */}
      <div className="flex flex-wrap gap-1.5">
        {profesor.caps.map((cap) => {
          const s = CAP_PILL_STYLES[cap];
          return (
            <span
              key={cap}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                color: s.color,
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
              }}
            >
              {cap}
            </span>
          );
        })}
      </div>

      {/* Separator */}
      <div className="h-px bg-(--border-subtle)" />

      {/* Footer actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-1 rounded-xl border border-(--border) py-2 text-sm text-(--text-secondary) transition hover:border-accent/40 hover:text-accent-light"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 rounded-xl border border-(--border) py-2 text-sm text-(--text-secondary) transition hover:border-red-500/30 hover:text-red-400"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
