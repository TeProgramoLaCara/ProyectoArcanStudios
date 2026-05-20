import type { Reserva } from "@/resources/data";
import { CURRENT_COMPANY } from "./types";
import { getStatusClass } from "./reservationUtils";

type ActiveReservationsListProps = {
  reservasActivas: Reserva[];
  isDark: boolean;
};

export function ActiveReservationsList({ reservasActivas, isDark }: ActiveReservationsListProps) {
  const mutedText = isDark ? "text-white/55" : "text-slate-600";

  return (
    <aside className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
            Mis reservas activas
          </h2>
          <p className={`mt-1 text-sm ${mutedText}`}>Detalle rápido de cada curso solicitado.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? "bg-white/5 text-white/70" : "bg-slate-100 text-slate-700"}`}>
          {CURRENT_COMPANY}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {reservasActivas.map((reserva) => (
          <article
            key={reserva.id}
            className={`rounded-xl border p-4 ${
              isDark ? "border-white/10 bg-[#111111]" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold leading-snug ${isDark ? "text-white" : "text-slate-950"}`}>
                  {reserva.curso}
                </h3>
                <p className={`mt-1 text-xs ${mutedText}`}>{reserva.fecha}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(reserva.status, isDark)}`}>
                {reserva.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {reserva.capacitaciones.slice(0, 2).map((cap) => (
                <span
                  key={cap}
                  className={`rounded-full px-2 py-1 text-[11px] ${
                    isDark ? "bg-white/[0.04] text-white/55" : "bg-white text-slate-600"
                  }`}
                >
                  {cap}
                </span>
              ))}
              {reserva.capacitaciones.length > 2 && (
                <span className={`rounded-full px-2 py-1 text-[11px] ${isDark ? "bg-white/[0.04] text-white/55" : "bg-white text-slate-600"}`}>
                  +{reserva.capacitaciones.length - 2}
                </span>
              )}
            </div>

            {(reserva.communications ?? []).filter((communication) => communication.visibleToClient).slice(0, 1).map((communication) => (
              <div
                key={communication.id}
                className={`mt-3 rounded-xl border p-3 text-xs ${
                  isDark
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-50"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
                }`}
              >
                <p className="font-semibold">Última comunicación</p>
                <p className="mt-1 leading-relaxed">{communication.message}</p>
              </div>
            ))}

            {(reserva.assignments ?? []).length > 0 && (
              <p className={`mt-3 text-xs ${mutedText}`}>
                Equipo asignado: {(reserva.assignments ?? [])
                  .map((assignment) => assignment.professorName)
                  .filter((name, index, names) => names.indexOf(name) === index)
                  .join(", ")}
              </p>
            )}
          </article>
        ))}
        {reservasActivas.length === 0 && (
          <div className={`rounded-xl border p-5 text-center ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
              No tienes reservas activas.
            </p>
            <p className={`mt-1 text-sm ${mutedText}`}>Crea una nueva solicitud para elegir curso y fechas.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
