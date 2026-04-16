'use client';

import { useTheme } from '@/context/ThemeContext';
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
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
      isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-black/[0.05] bg-black/[0.03]'
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Avatar con iniciales */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: COLORS.accent }}
        >
          {getInitials(usuario.username)}
        </div>
        <span className={`truncate text-sm ${isDark ? 'text-white/70' : 'text-[#475569]'}`}>{usuario.username}</span>
      </div>

      {/* Botón eliminar usuario */}
      <button
        onClick={() => onRemove(usuario.id)}
        title="Eliminar usuario"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] transition hover:border-red-500/30 hover:text-red-400 ${
          isDark ? 'border-white/10 bg-white/5 text-white/30' : 'border-black/[0.08] bg-black/[0.04] text-[#94a3b8]'
        }`}
      >
        ✕
      </button>
    </div>
  );
}
