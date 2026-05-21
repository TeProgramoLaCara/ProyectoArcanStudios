'use client';

import ReservaBadge from './ReservaBadge';
import type { Reserva } from '@/resources/data';

export type { Reserva };

export default function ReservaRow({ reserva }: { reserva: Reserva }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_130px_100px] items-center gap-4 rounded-2xl border border-(--border-subtle) bg-surface px-5 py-4 transition hover:border-[#267F6B]/25">

      {/* Cliente */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm font-medium text-(--text-primary)">{reserva.clientName}</span>
        <span className="text-xs text-(--text-muted)">Cliente</span>
      </div>

      {/* Empresa */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm text-(--text-secondary)">{reserva.company}</span>
        <span className="text-xs text-(--text-muted)">Empresa</span>
      </div>

      {/* Curso */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm text-(--text-secondary)">{reserva.curso}</span>
        <span className="text-xs text-(--text-muted)">Curso</span>
      </div>

      {/* Capacitaciones */}
      <div className="flex flex-col gap-1 min-w-0">
        {reserva.capacitaciones.map((cap, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/30 bg-[#267F6B]/10 text-[9px] font-bold text-[#2fa58a]">
              {i + 1}
            </span>
            <span className="truncate text-xs text-(--text-muted)">{cap}</span>
          </div>
        ))}
      </div>

      {/* Estado */}
      <ReservaBadge status={reserva.status} />

      {/* Fecha */}
      <div className="text-right">
        <span className="text-xs whitespace-nowrap text-(--text-muted)">{reserva.fecha}</span>
      </div>
    </div>
  );
}
