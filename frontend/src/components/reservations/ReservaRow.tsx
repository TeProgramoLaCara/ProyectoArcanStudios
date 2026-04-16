'use client';

import { useTheme } from '@/context/ThemeContext';
import ReservaBadge from './ReservaBadge';
import type { Reserva } from '@/resources/data';

// Re-exportado para compatibilidad con importaciones existentes
export type { Reserva };

export default function ReservaRow({ reserva }: { reserva: Reserva }) {
  const { isDark } = useTheme();

  return (
    <div className={`grid grid-cols-[1fr_1fr_1.5fr_1.5fr_130px_100px] items-center gap-4 rounded-2xl border px-5 py-4 transition ${
      isDark
        ? 'border-white/[0.06] bg-[#0d0d0d] hover:border-[#267F6B]/25'
        : 'border-black/[0.06] bg-[#f1f5f9] hover:border-[#267F6B]/35'
    }`}>
      {/* Cliente */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
          {reserva.clientName}
        </span>
        <span className={`text-xs ${isDark ? 'text-white/35' : 'text-[#94a3b8]'}`}>Cliente</span>
      </div>

      {/* Empresa */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`truncate text-sm ${isDark ? 'text-white/75' : 'text-[#475569]'}`}>{reserva.company}</span>
        <span className={`text-xs ${isDark ? 'text-white/35' : 'text-[#94a3b8]'}`}>Empresa</span>
      </div>

      {/* Curso */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`truncate text-sm ${isDark ? 'text-white/75' : 'text-[#475569]'}`}>{reserva.curso}</span>
        <span className={`text-xs ${isDark ? 'text-white/35' : 'text-[#94a3b8]'}`}>Curso</span>
      </div>

      {/* Capacitaciones */}
      <div className="flex flex-col gap-1 min-w-0">
        {reserva.capacitaciones.map((cap, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/30 bg-[#267F6B]/10 text-[9px] font-bold text-[#2fa58a]">
              {i + 1}
            </span>
            <span className={`truncate text-xs justify-start ${isDark ? 'text-white/55' : 'text-[#94a3b8]'}`}>{cap}</span>
          </div>
        ))}
      </div>

      {/* Estado */}
      <ReservaBadge status={reserva.status} />

      {/* Fecha */}
      <div className="text-right">
        <span className={`text-xs whitespace-nowrap ${isDark ? 'text-white/35' : 'text-[#94a3b8]'}`}>{reserva.fecha}</span>
      </div>
    </div>
  );
}
