import { PlusIcon } from "@heroicons/react/24/outline";

type ReservationsHeaderProps = {
  isDark: boolean;
  onNewReservation: () => void;
};

export function ReservationsHeader({ isDark, onNewReservation }: ReservationsHeaderProps) {
  return (
    <header
      className={`rounded-2xl border p-6 ${
        isDark
          ? "border-white/10 bg-[#0d0d0d] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
          : "border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className={`text-sm font-semibold ${isDark ? "text-[#2fa58a]" : "text-[#267F6B]"}`}>
            Portal cliente
          </p>
          <h1 className={`mt-1 text-3xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
            Reservas de formación
          </h1>
          <p className={`mt-2 max-w-2xl text-sm ${isDark ? "text-white/55" : "text-slate-600"}`}>
            Consulta tus cursos activos, revisa el estado de cada solicitud y reserva nuevas fechas con disponibilidad real.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewReservation}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#267F6B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva reserva
        </button>
      </div>
    </header>
  );
}
