'use client';

import COLORS from '@/resources/colors';
import type { Usuario } from '@/resources/data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(username: string): string {
  const parts = username.split(/[_\s]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  usuario: Usuario;
  onRemove: (id: string) => void;
};

export default function UsuarioRow({ usuario, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Avatar con iniciales */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: COLORS.accent }} /* colors.ts: accent */
        >
          {getInitials(usuario.username)}
        </div>
        <span className="truncate text-sm text-white/70">{usuario.username}</span>
      </div>

      {/* Botón eliminar usuario */}
      <button
        onClick={() => onRemove(usuario.id)}
        title="Eliminar usuario"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] text-white/30 transition hover:border-red-500/30 hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
}
