'use client';

import COLORS from '@/resources/colors';
import type { Usuario } from '@/resources/data';

function getInitials(username: string): string {
  const parts = username.split(/[_\s]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

type Props = {
  usuario: Usuario;
  onRemove: (id: string) => void;
};

export default function UsuarioRow({ usuario, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--border-subtle) px-3 py-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: COLORS.accent }}
        >
          {getInitials(usuario.username)}
        </div>
        <span className="truncate text-sm text-(--text-secondary)">{usuario.username}</span>
      </div>

      <button
        onClick={() => onRemove(usuario.id)}
        title="Eliminar usuario"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-[10px] text-(--text-muted) transition hover:border-red-500/30 hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
}
