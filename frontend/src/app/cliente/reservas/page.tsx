"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  type CalendarEvent,
  type Capacitacion,
  type Curso,
  type Reserva,
} from "@/resources/data";
import { ActiveReservationsCalendar } from "@/components/client-reservations/ActiveReservationsCalendar";
import { ActiveReservationsList } from "@/components/client-reservations/ActiveReservationsList";
import { NewReservationModal } from "@/components/client-reservations/NewReservationModal";
import { ReservationsHeader } from "@/components/client-reservations/ReservationsHeader";
import { ReservationsOverview } from "@/components/client-reservations/ReservationsOverview";
import { CURRENT_CLIENT } from "@/components/client-reservations/types";
import { getClientApiData } from "@/services/client.service";

function isActiveReservation(reserva: Reserva) {
  return (
    reserva.clientName === CURRENT_CLIENT &&
    (reserva.status === "Pendiente" ||
      reserva.status === "Confirmada" ||
      reserva.status === "En curso")
  );
}

export default function ClienteReservasPage() {
  const { isDark } = useTheme();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [availableCursos, setAvailableCursos] = useState<Curso[]>([]);
  const [availableCapacitaciones, setAvailableCapacitaciones] =
    useState<Capacitacion[]>([]);
  const [calendarEvents, setCalendarEvents] =
    useState<CalendarEvent[]>([]);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date());

  useEffect(() => {
    getClientApiData()
      .then((data) => {
        setReservas(data.reservas);
        setAvailableCursos(data.cursos);
        setAvailableCapacitaciones(data.capacitaciones);
        setCalendarEvents(data.calendarEvents.map((event) => ({ ...event })));
      })
      .catch((error) => {
        console.error("Error cargando reservas del cliente:", error);
      });
  }, []);

  const reservasActivas = useMemo(
    () => reservas.filter(isActiveReservation),
    [reservas],
  );

  const handleCreateReservation = (reserva: Reserva) => {
    setReservas((prev) => [reserva, ...prev.filter((item) => item.id !== reserva.id)]);
    setShowNewReservation(false);
  };

  return (
    <section className={`min-h-full p-6 ${isDark ? "bg-[#050505]" : "bg-[#f8fafc]"}`}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <ReservationsHeader
          isDark={isDark}
          onNewReservation={() => setShowNewReservation(true)}
        />

        <ReservationsOverview reservasActivas={reservasActivas} isDark={isDark} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <ActiveReservationsCalendar
            activeMonth={activeMonth}
            isDark={isDark}
            onMonthChange={setActiveMonth}
            reservasActivas={reservasActivas}
          />
          <ActiveReservationsList reservasActivas={reservasActivas} isDark={isDark} />
        </div>
      </div>

      {showNewReservation && (
        <NewReservationModal
          availableCalendarEvents={calendarEvents}
          availableCapacitaciones={availableCapacitaciones}
          availableCursos={availableCursos}
          isDark={isDark}
          onClose={() => setShowNewReservation(false)}
          onCreateReservation={handleCreateReservation}
        />
      )}
    </section>
  );
}
