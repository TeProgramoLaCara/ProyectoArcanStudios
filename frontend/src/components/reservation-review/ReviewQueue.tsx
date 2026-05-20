import type { Reserva } from "@/resources/data";
import ReservaBadge from "@/components/reservations/ReservaBadge";

type ReviewQueueProps = {
  reservas: Reserva[];
  selectedId?: string;
  onSelect: (reserva: Reserva) => void;
};

export function ReviewQueue({ reservas, selectedId, onSelect }: ReviewQueueProps) {
  return (
    <aside className="rounded-2xl border border-(--border) bg-surface p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-(--text-primary)">Solicitudes</h2>
        <p className="text-sm text-(--text-muted)">Reservas recibidas y estado de revisión.</p>
      </div>

      <div className="hide-scrollbar flex max-h-[720px] flex-col gap-2 overflow-y-auto pr-1">
        {reservas.map((reserva) => {
          const active = reserva.id === selectedId;

          return (
            <button
              key={reserva.id}
              type="button"
              onClick={() => onSelect(reserva)}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? "border-[#267F6B]/60 bg-[#267F6B]/15"
                  : "border-(--border-subtle) bg-surface-elevated hover:border-[#267F6B]/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">{reserva.curso}</p>
                  <p className="mt-0.5 text-xs text-(--text-muted)">
                    {reserva.company} · {reserva.clientName}
                  </p>
                </div>
                <ReservaBadge status={reserva.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-(--text-secondary)">
                  {reserva.alumnos ?? 0} alumnos
                </span>
                <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-(--text-secondary)">
                  {reserva.requestedStart} - {reserva.requestedEnd}
                </span>
                <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-(--text-secondary)">
                  {(reserva.assignments ?? []).length}/{reserva.capacitaciones.length} asignadas
                </span>
              </div>
            </button>
          );
        })}

        {reservas.length === 0 && (
          <div className="rounded-xl border border-(--border-subtle) bg-surface-elevated p-6 text-center text-sm text-(--text-muted)">
            No hay reservas con estos filtros.
          </div>
        )}
      </div>
    </aside>
  );
}
