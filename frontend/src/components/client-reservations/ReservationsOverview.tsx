import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { Reserva } from "@/resources/data";
import { formatHumanDate, parseReservaDateRange } from "./reservationUtils";
import { StatCard } from "./StatCard";

type ReservationsOverviewProps = {
  reservasActivas: Reserva[];
  isDark: boolean;
};

export function ReservationsOverview({ reservasActivas, isDark }: ReservationsOverviewProps) {
  const nextReservation = reservasActivas
    .map((reserva) => ({ reserva, range: parseReservaDateRange(reserva.fecha) }))
    .filter((item): item is { reserva: Reserva; range: { start: Date; endInclusive: Date } } =>
      Boolean(item.range),
    )
    .sort((a, b) => a.range.start.getTime() - b.range.start.getTime())[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <StatCard
        icon={CalendarDaysIcon}
        label="Reservas activas"
        value={reservasActivas.length}
        detail="Confirmadas, en curso o pendientes de validación."
        tone="emerald"
        isDark={isDark}
      />
      <StatCard
        icon={ClockIcon}
        label="Pendientes"
        value={reservasActivas.filter((r) => r.status === "Pendiente").length}
        detail="Solicitudes enviadas al equipo de Arcan Studios."
        tone="amber"
        isDark={isDark}
      />
      <StatCard
        icon={CheckCircleIcon}
        label="Próxima formación"
        value={nextReservation ? formatHumanDate(nextReservation.range.start) : "-"}
        detail={nextReservation ? nextReservation.reserva.curso : "Aún no hay cursos próximos."}
        tone="sky"
        isDark={isDark}
      />
    </div>
  );
}
