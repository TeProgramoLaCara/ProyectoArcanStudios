"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page";
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
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        backgroundColor: e.color,
        borderColor: "transparent",
        extendedProps: {
          color: e.color,
          turno: e.turno,
          sortOrder: e.turno === "manana" ? 0 : 1,
          professorId: e.professorId,
          professorName: e.professorName,
          companyId: e.companyId,
          companyName: e.companyName,
          capacitaciones: e.capacitaciones,
        },
      })),
    [events],
  );

  return (
    <div className="flex flex-col rounded-[28px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
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
          dayMaxEventRows={4}
          weekends={false}
          defaultAllDay={true}
          eventDisplay="block"
          displayEventTime={false}
          events={fcEvents}
          eventOrder="extendedProps.sortOrder,title"
          eventContent={(arg) => {
            const turno = arg.event.extendedProps.turno as string;
            const color = arg.event.extendedProps.color as string;
            return (
              <div
                style={{
                  backgroundColor: color,
                  width: "100%",
                  height: "100%",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0 6px",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    color: "#000",
                    fontSize: "9px",
                    fontWeight: 700,
                    flexShrink: 0,
                    opacity: 0.6,
                    textTransform: "uppercase",
                  }}
                >
                  {turno === "manana" ? "M" : "T"}
                </span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "10px",
                    fontWeight: 600,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {arg.event.title}
                </span>
              </div>
            );
          }}
          eventClick={(info) => {
            const ep = info.event.extendedProps;
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
