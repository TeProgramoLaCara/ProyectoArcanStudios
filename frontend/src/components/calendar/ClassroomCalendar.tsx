"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type ClassroomCalendarProps = {
  title: string;
  subtitle?: string;
  events: CalendarEvent[];
};

export default function ClassroomCalendar({
  title,
  subtitle,
  events,
}: ClassroomCalendarProps) {
  return (
    <div className="flex min-h-[560px] flex-col rounded-[28px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-white/50">{subtitle}</p>
          )}
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          Classroom
        </span>
      </div>

      <div className="calendar-modern-wrapper flex-1 overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]">
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
        />
      </div>
    </div>
  );
}