import {
  getStatusColor,
  getStatusIcon,
  hexToRgba,
  normalizeStatusLabel,
  pickId,
  pickText,
} from './dashboard.utils';

type RecentReservationsPanelProps = {
  reservas: unknown[];
};

export default function RecentReservationsPanel({
  reservas,
}: RecentReservationsPanelProps) {
  return (
    <div className="flex h-[520px] flex-col gap-5 overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[560px]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Últimas reservas
          </h2>
        </div>

        <div className="rounded-full border border-[#267F6B]/15 bg-[#267F6B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--text-secondary)">
          {reservas.length} registros visibles
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        <div className="sticky top-0 z-10 grid grid-cols-[1fr_1fr_1.5fr_120px] gap-4 bg-surface px-5 pb-3">
          {['Reserva', 'Empresa', 'Curso / Detalle', 'Estado'].map((col) => (
            <span
              key={col}
              className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)"
            >
              {col}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {reservas.length === 0 ? (
            <div className="rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-5 py-4 text-sm text-(--text-secondary)">
              No hay reservas registradas todavía.
            </div>
          ) : (
            reservas.map((reserva, index) => {
              const rawStatus = pickText(
                reserva,
                ['status', 'estado'],
                'Registrada'
              );
              const status = normalizeStatusLabel(rawStatus);
              const statusColor = getStatusColor(status);
              const id = pickId(reserva, index);

              return (
                <div
                  key={id}
                  className="grid grid-cols-[1fr_1fr_1.5fr_120px] items-center gap-4 rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--text-primary)">
                      {pickText(
                        reserva,
                        ['clientName', 'cliente', 'usuario', 'nombre'],
                        `Reserva #${id}`
                      )}
                    </p>
                    <p className="mt-1 text-xs text-(--text-muted)">
                      ID: {id}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-(--text-secondary)">
                      {pickText(
                        reserva,
                        ['company', 'empresa', 'empresaName'],
                        'Sin empresa'
                      )}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--text-primary)">
                      {pickText(
                        reserva,
                        ['curso', 'cursoName', 'title', 'titulo'],
                        'Reserva registrada'
                      )}
                    </p>
                    <p className="mt-1 truncate text-xs text-(--text-muted)">
                      {pickText(
                        reserva,
                        ['fecha', 'createdAt', 'fecha_reserva'],
                        'Sin fecha visible'
                      )}
                    </p>
                  </div>

                  <div>
                    <span
                      className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold"
                      style={{
                        borderColor: hexToRgba(statusColor, 0.24),
                        backgroundColor: hexToRgba(statusColor, 0.12),
                        color: statusColor,
                      }}
                    >
                      {getStatusIcon(status)} {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}