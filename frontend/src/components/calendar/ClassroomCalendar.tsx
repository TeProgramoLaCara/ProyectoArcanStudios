"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page";
import { PROFESSOR_COLORS } from "@/resources/data";
import EventDetailCard from "./EventDetailCard";

type ClassroomCalendarProps = {
  title: string;
  aulaId: string;
  events: CalendarEvent[];
  currentDate: Date;
};

export default function ClassroomCalendar({
  title,
  aulaId,
  events,
  currentDate,
}: ClassroomCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [cardPosition, setCardPosition] = useState({
    x: 0,
    y: 0,
    openUpward: false,
  });

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(currentDate);
    }
  }, [currentDate]);

  const fcEvents = useMemo(
    () => {
      const toLocalKey = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      const addDays = (date: Date, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
      };

      const isWeekday = (date: Date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
      };

      const busyEvents = events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        order: e.turno === "manana" ? 0 : 1,
        backgroundColor: e.color,
        borderColor: e.color,
        textColor: "#ffffff",
        extendedProps: {
          isAvailable: false,
          color: e.color,
          turno: e.turno,
          sortOrder: e.turno === "manana" ? 0 : 1,
          professorId: e.professorId,
          professorName: e.professorName,
          professorColor: PROFESSOR_COLORS[e.professorId] ?? "#9ca3af",
          companyId: e.companyId,
          companyName: e.companyName,
          capacitaciones: e.capacitaciones,
        },
      }));

      const occupied = {
        manana: new Set<string>(),
        tarde: new Set<string>(),
      };

      for (const event of events) {
        const start = new Date(`${event.start}T00:00:00`);
        const endExclusive = new Date(`${event.end}T00:00:00`);
        for (
          const cursor = new Date(start);
          cursor < endExclusive;
          cursor.setDate(cursor.getDate() + 1)
        ) {
          if (!isWeekday(cursor)) continue;
          occupied[event.turno].add(toLocalKey(cursor));
        }
      }

      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const createAvailabilityRanges = (turno: CalendarEvent["turno"]) => {
        const ranges: Array<{ start: string; end: string }> = [];
        let rangeStart: Date | null = null;
        let previousDate: Date | null = null;

        for (
          const cursor = new Date(monthStart);
          cursor <= monthEnd;
          cursor.setDate(cursor.getDate() + 1)
        ) {
          if (!isWeekday(cursor)) continue;
          const key = toLocalKey(cursor);
          const isFree = !occupied[turno].has(key);

          if (isFree) {
            if (!rangeStart) {
              rangeStart = new Date(cursor);
            } else if (previousDate && toLocalKey(addDays(previousDate, 1)) !== key) {
              ranges.push({
                start: toLocalKey(rangeStart),
                end: toLocalKey(addDays(previousDate, 1)),
              });
              rangeStart = new Date(cursor);
            }
            previousDate = new Date(cursor);
          } else if (rangeStart && previousDate) {
            ranges.push({
              start: toLocalKey(rangeStart),
              end: toLocalKey(addDays(previousDate, 1)),
            });
            rangeStart = null;
            previousDate = null;
          }
        }

        if (rangeStart && previousDate) {
          ranges.push({
            start: toLocalKey(rangeStart),
            end: toLocalKey(addDays(previousDate, 1)),
          });
        }

        return ranges;
      };

      const availabilityColor = "rgba(34, 197, 94, 0.33)";

      const availabilityEvents = (["manana", "tarde"] as const).flatMap((turno) =>
        createAvailabilityRanges(turno).map((range, idx) => ({
          id: `available-${turno}-${range.start}-${idx}`,
          title: "Disponible",
          start: range.start,
          end: range.end,
          allDay: true,
          order: turno === "manana" ? 0 : 1,
          backgroundColor: availabilityColor,
          borderColor: "transparent",
          textColor: "#dcfce7",
          extendedProps: {
            isAvailable: true,
            color: availabilityColor,
            turno,
            sortOrder: turno === "manana" ? 0 : 1,
            professorColor: "transparent",
          },
        })),
      );

      return [...busyEvents, ...availabilityEvents];
    },
    [events, currentDate],
  );

  return (
    <div className="flex flex-col rounded-[28px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs capitalize text-white/50">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
            aria-label={`Mes anterior en ${title}`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
            aria-label={`Mes siguiente en ${title}`}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="calendar-modern-wrapper overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]"
        style={{ height: "600px" }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          initialDate={currentDate}
          height="100%"
          fixedWeekCount={false}
          dayMaxEventRows={2}
          weekends={false}
          editable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          defaultAllDay={true}
          eventDisplay="block"
          displayEventTime={false}
          events={fcEvents}
          eventOrder="order,title"
          eventOrderStrict={true}
          eventDidMount={(info) => {
            const turno = info.event.extendedProps.turno as CalendarEvent["turno"];
            const isAvailable = Boolean(info.event.extendedProps.isAvailable);
            const harness = info.el.closest(".fc-daygrid-event-harness");
            if (!harness) return;
            harness.classList.remove(
              "turno-manana-slot",
              "turno-tarde-slot",
              "availability-slot",
            );
            harness.classList.add(
              turno === "manana" ? "turno-manana-slot" : "turno-tarde-slot",
            );
            if (isAvailable) {
              harness.classList.add("availability-slot");
            }
          }}
          eventContent={(arg) => {
            const professorColor = arg.event.extendedProps.professorColor as string;
            const turno = arg.event.extendedProps.turno as CalendarEvent["turno"];
            const isAvailable = Boolean(arg.event.extendedProps.isAvailable);
            const turnoIcon = turno === "manana" ? "☀" : "☾";
            const titleText = arg.event.title;
            const showLabel = arg.isStart;
            if (!showLabel) return null;

            return (
              <div
                style={{
                  padding: "3px 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  minHeight: "22px",
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                title={titleText}
              >
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    flexShrink: 0,
                    opacity: 0.95,
                  }}
                  aria-hidden
                >
                  {turnoIcon}
                </span>
                {!isAvailable && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "9999px",
                      backgroundColor: professorColor,
                      flexShrink: 0,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.22)",
                    }}
                    aria-hidden
                  />
                )}
                <span>{titleText}</span>
              </div>
            );
          }}
          eventClick={(info) => {
            const ep = info.event.extendedProps;
            if (ep.isAvailable) return;
            const reconstructed: CalendarEvent = {
              id: info.event.id,
              title: info.event.title,
              start: info.event.startStr,
              end: info.event.endStr,
              aula: aulaId as CalendarEvent["aula"],
              turno: ep.turno as CalendarEvent["turno"],
              color: ep.color as string,
              professorId: ep.professorId as string,
              professorName: ep.professorName as string,
              companyId: ep.companyId as string,
              companyName: ep.companyName as string,
              capacitaciones: ep.capacitaciones as string[],
            };

            const rect = info.el.getBoundingClientRect();
            const cardHeight = 320;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const y =
              spaceBelow >= cardHeight || spaceBelow >= spaceAbove
                ? rect.bottom
                : rect.top;

            setCardPosition({
              x: rect.left + rect.width / 2,
              y,
              openUpward: spaceBelow < cardHeight && spaceAbove > spaceBelow,
            });
            setSelectedEvent(reconstructed);
          }}
        />
      </div>

      {selectedEvent && (
        <EventDetailCard
          event={selectedEvent}
          position={cardPosition}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}