import ReservaBadge, { type ReservaStatus } from "./ReservaBadge";

export type Reserva = {
  id: string;
  clientName: string;
  company: string;
  curso: string;
  capacitaciones: string[];
  status: ReservaStatus;
  fecha: string;
};

export default function ReservaRow({ reserva }: { reserva: Reserva }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_130px_100px] items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0d0d0d] px-5 py-4 transition hover:border-[#267F6B]/25 hover:bg-[#0d0d0d]">
      {/* Cliente */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm font-medium text-white">
          {reserva.clientName}
        </span>
        <span className="text-xs text-white/35">Cliente</span>
      </div>

      {/* Empresa */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm text-white/75">{reserva.company}</span>
        <span className="text-xs text-white/35">Empresa</span>
      </div>

      {/* Curso */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate text-sm text-white/75">{reserva.curso}</span>
        <span className="text-xs text-white/35">Curso</span>
      </div>

      {/* Capacitaciones */}
      <div className="flex flex-col gap-1 min-w-0">
        {reserva.capacitaciones.map((cap, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/30 bg-[#267F6B]/10 text-[9px] font-bold text-[#2fa58a]">
              {i + 1}
            </span>
            <span className="truncate text-xs text-white/55 justify-start">{cap}</span>
          </div>
        ))}
      </div>

      {/* Estado */}
      <ReservaBadge status={reserva.status} />

      {/* Fecha */}
      <div className="text-right">
        <span className="text-xs text-white/35 whitespace-nowrap">{reserva.fecha}</span>
      </div>
    </div>
  );
}