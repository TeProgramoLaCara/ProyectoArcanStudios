"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page"; // ajusta el path
import EventDetailCard from "./EventDetailCard";

type OccupancyStatus = "free" | "partial" | "full";
const MAX_SIMULTANEOUS = 2;

function getDayOccupancy(date: Date, events: CalendarEvent[]): OccupancyStatus {
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const cellStr = toDateStr(date);

  const count = events.filter((e) => {
    return cellStr >= e.start && cellStr < e.end;
  }).length;

  if (count === 0) return "free";
  if (count >= MAX_SIMULTANEOUS) return "full";
  return "partial";
}

type ClassroomCalendarProps = {
  title: string;
  events: CalendarEvent[];
};

export default function ClassroomCalendar({
  title,
  events,
}: ClassroomCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [cardPosition, setCardPosition] = useState({
    x: 0,
    y: 0,
    openUpward: false,
  });

  return (
    <div className="flex flex-col rounded-[28px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          
        </div>
      </div>

      <div className="calendar-modern-wrapper overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]" style={{ height: "600px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          height="100%"
          fixedWeekCount={false}
          dayMaxEventRows={2}
          weekends={false}
          events={events}
          eventDisplay="block"
          eventColor="#ffffff"
          eventTextColor="#0a0a0a"
          dayCellClassNames={({ date }) => {
            const status = getDayOccupancy(date, events);
            return [`occupancy-${status}`];
          }}
          eventClick={(info) => {
            const clicked = events.find((e) => e.id === info.event.id);
            if (!clicked) return;

            const rect = info.el.getBoundingClientRect();
            const cardHeight = 320; // altura estimada de la card
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const y =
              spaceBelow >= cardHeight || spaceBelow >= spaceAbove
                ? rect.bottom // abre hacia abajo
                : rect.top; // abre hacia arriba

            setCardPosition({
              x: rect.left + rect.width / 2,
              y,
              openUpward: spaceBelow < cardHeight && spaceAbove > spaceBelow,
            });
            setSelectedEvent(clicked);
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
