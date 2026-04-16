'use client';

import { useTheme } from '@/context/ThemeContext';
import type { ReservaStatus } from '@/resources/data';

// Re-exportado para compatibilidad con importaciones existentes
export type { ReservaStatus };

const DARK_STYLES: Record<ReservaStatus, string> = {
  Pendiente:  'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  Confirmada: 'border-[#267F6B]/40 bg-[#267F6B]/10 text-[#2fa58a]',
  'En curso': 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  Completada: 'border-white/10 bg-white/5 text-white/50',
  Cancelada:  'border-red-500/30 bg-red-500/10 text-red-400',
};

const LIGHT_STYLES: Record<ReservaStatus, string> = {
  Pendiente:  'border-[#b45309]/30 bg-[#b45309]/10 text-[#b45309]',
  Confirmada: 'border-[#267F6B]/30 bg-[#267F6B]/10 text-[#267F6B]',
  'En curso': 'border-[#0284c7]/30 bg-[#0284c7]/10 text-[#0284c7]',
  Completada: 'border-black/10 bg-black/[0.04] text-[#64748b]',
  Cancelada:  'border-[#dc2626]/30 bg-[#dc2626]/10 text-[#dc2626]',
};

export default function ReservaBadge({ status }: { status: ReservaStatus }) {
  const { isDark } = useTheme();
  const styles = isDark ? DARK_STYLES : LIGHT_STYLES;

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}
