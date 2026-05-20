import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { EventInput } from "@fullcalendar/core";
import { useEffect, useMemo, useRef } from "react";
import type { Reserva } from "@/resources/data";
import {
  addDays,
  formatMonth,
  parseReservaDateRange,
  toIsoDate,
} from "./reservationUtils";

type ActiveReservationsCalendarProps = {
  reservasActivas: Reserva[];
  activeMonth: Date;
  onMonthChange: (date: Date) => void;
  isDark: boolean;
};

export function ActiveReservationsCalendar({
  reservasActivas,
  activeMonth,
  onMonthChange,
  isDark,
}: ActiveReservationsCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const mutedText = isDark ? "text-white/55" : "text-slate-600";

  const events = useMemo<EventInput[]>(
    () =>
      reservasActivas.flatMap((reserva) => {
        const range = parseReservaDateRange(reserva.fecha);
        if (!range) return [];
        return [
          {
            id: `active-reservation-${reserva.id}`,
            title: reserva.curso,
            start: toIsoDate(range.start),
            end: toIsoDate(addDays(range.endInclusive, 1)),
            allDay: true,
            backgroundColor: reserva.status === "Pendiente" ? "#d97706" : "#267F6B",
            borderColor: reserva.status === "Pendiente" ? "#f59e0b" : "#2fa58a",
            textColor: "#ffffff",
          },
        ];
      }),
    [reservasActivas],
  );

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(activeMonth);
  }, [activeMonth]);

  return (
    <section className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
            Calendario de reservas
          </h2>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Vista mensual de tus reservas activas y solicitudes pendientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMonthChange(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1))}
            className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
              isDark ? "border-white/10 text-white/75 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            aria-label="Mes anterior"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className={`min-w-36 text-center text-sm font-semibold capitalize ${isDark ? "text-white" : "text-slate-950"}`}>
            {formatMonth(activeMonth)}
          </span>
          <button
            type="button"
            onClick={() => onMonthChange(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1))}
            className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
              isDark ? "border-white/10 text-white/75 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            aria-label="Mes siguiente"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`client-calendar-wrapper overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-[#111111]" : "border-slate-200 bg-white"}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          initialDate={activeMonth}
          height="590px"
          fixedWeekCount={false}
          weekends={false}
          editable={false}
          eventDisplay="block"
          displayEventTime={false}
          events={events}
          dayMaxEventRows={2}
          eventContent={(arg) => (
            <div className="truncate px-2 py-1 text-[11px] font-semibold leading-tight text-white">
              {arg.event.title}
            </div>
          )}
        />
      </div>
      <div className={`mt-4 flex flex-wrap gap-2 text-xs ${isDark ? "text-white/60" : "text-slate-600"}`}>
        <span className="rounded-full bg-[#267F6B]/15 px-3 py-1 font-medium text-[#2fa58a]">
          Confirmada o en curso
        </span>
        <span className="rounded-full bg-amber-500/15 px-3 py-1 font-medium text-amber-500">
          Pendiente de revisión
        </span>
      </div>
    </section>
  );
}
