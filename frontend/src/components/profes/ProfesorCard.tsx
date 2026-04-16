'use client';

import type { Profesor } from './types';
import { AVATAR_COLORS, CAP_PILL_STYLES, STATUS_COLORS } from './colors';

type Props = {
  profesor: Profesor;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProfesorCard({ profesor, onEdit, onDelete }: Props) {
  const avatarColor = AVATAR_COLORS[profesor.id % AVATAR_COLORS.length];
  const initials = `${profesor.nombre[0]}${profesor.apellidos[0]}`.toUpperCase();

  return (
    <div className="relative flex flex-col gap-4 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#0f0f0f] p-5 transition hover:bg-[#131313]">

      {/* Edit shortcut — top-right corner */}
      <button
        onClick={onEdit}
        title="Editar"
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white/30 transition hover:border-[#267F6B]/40 hover:text-[#2fa58a]"
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
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f0f]"
            style={{ backgroundColor: STATUS_COLORS[profesor.status].dot }}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-white">
            {profesor.nombre} {profesor.apellidos}
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: STATUS_COLORS[profesor.status].text }}
          >
            {profesor.status === 'active' ? 'Activo' : 'Inactivo'}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span className="shrink-0 text-white/25">✉</span>
          <span className="truncate">{profesor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span className="shrink-0 text-white/25">✆</span>
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
      <div className="h-px bg-white/[0.06]" />

      {/* Footer actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-white/50 transition hover:border-[#267F6B]/40 hover:text-[#2fa58a]"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-white/50 transition hover:border-red-500/30 hover:text-red-400"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
