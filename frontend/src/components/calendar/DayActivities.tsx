'use client';
 
// src/components/calendar/DayActivities.tsx
// Panel de actividades del día seleccionado en el sidebar del calendario.
 
import type { CalendarEvent } from '@/resources/calendarData';
import { AULA_META, TURNO_META, TOOL_ICON } from '@/resources/calendarData';
 
interface Props {
  date: Date;
  events: CalendarEvent[];
}
 
function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
 
export function DayActivities({ date, events }: Props) {
  const ds = toYMD(date);
  const dayEvents = events.filter(ev => ev.start <= ds && ev.end > ds);
 
  const dateLabel = date.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
 
  return (
    <div className="rounded-2xl border border-(--border) bg-surface p-4 shadow-sm flex flex-col gap-3">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-0.5">
          Actividades del día
        </p>
        <p className="text-xs font-bold capitalize text-(--text-primary)">{dateLabel}</p>
      </div>
 
      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-5 gap-2">
          <span className="text-2xl">📭</span>
          <p className="text-xs text-(--text-muted) text-center">Sin cursos este día</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map(ev => {
            const aula  = AULA_META[ev.aula];
            const turno = TURNO_META[ev.turno];
            return (
              <div
                key={ev.id}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{
                  background: aula.bg,
                  border: `1px solid ${aula.color}30`,
                }}
              >
                {/* Título + turno */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-(--text-primary) leading-tight">
                    {TOOL_ICON[ev.tool] ?? '📚'} {ev.title}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: turno.bg, color: turno.color }}
                  >
                    {turno.icon} {turno.label}
                  </span>
                </div>
 
                {/* Aula + empresa */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: aula.bg, color: aula.color, border: `1px solid ${aula.color}35` }}
                  >
                    {aula.label}
                  </span>
                  <span className="text-[10px] text-(--text-muted)">{ev.empresa}</span>
                </div>
 
                {/* Profesor */}
                <span className="text-[10px] text-(--text-secondary)">👤 {ev.profesor}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}