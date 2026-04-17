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
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const api = calendarRef.current?.getApi();
      if (api) {
        api.gotoDate(currentDate);
      }
    });

    return () => {
      cancelled = true;
    };
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
          professorColor: PROFESSOR_COLORS[e.professorId] ?? "#9ca3af",
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
          dayMaxEventRows={2}
          weekends={false}
          defaultAllDay={true}
          eventDisplay="block"
          eventColor="transparent"
          eventBorderColor="transparent"
          eventBackgroundColor="transparent"
          displayEventTime={false}
          events={fcEvents}
          eventOrder="extendedProps.sortOrder,title"
          eventContent={(arg) => {
            const color = arg.event.extendedProps.color as string;
            const professorColor = arg.event.extendedProps.professorColor as string;
            const titleText = arg.event.title;
            return (
              <div
                style={{
                  backgroundColor: color,
                  borderRadius: "3px",
                  padding: "1px 4px",
                  fontSize: "9px",
                  fontWeight: 500,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "clip",
                  textOverflow: "ellipsis",
                  width: "100%",
                  opacity: 0.92,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title={titleText}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: professorColor,
                    flexShrink: 0,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.22)",
                  }}
                  aria-hidden
                />
                <span
                  style={{
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {titleText}
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
