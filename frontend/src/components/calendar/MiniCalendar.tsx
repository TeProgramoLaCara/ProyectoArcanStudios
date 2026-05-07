'use client';
 
// src/components/calendar/MiniCalendar.tsx
// Mini calendario lateral — sincronizado con el calendario principal.
// Usa las variables CSS del design system de Arcan Studios (--border, --surface, etc.)
 
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import type { CalendarEvent } from '@/resources/calendarData';
import { AULA_META } from '@/resources/calendarData';
 
interface Props {
  currentMonth: Date;            // mes que muestra el mini-cal
  selectedDate: Date;            // día seleccionado
  onSelectDate: (d: Date) => void;
  onMonthChange: (delta: number) => void;
  events: CalendarEvent[];       // eventos ya filtrados
}
 
const WEEK_DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
 
function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
 
function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // lunes = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
 
export function MiniCalendar({ currentMonth, selectedDate, onSelectDate, onMonthChange, events }: Props) {
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = buildGrid(year, month);
  const today = toYMD(new Date());
  const selStr = toYMD(selectedDate);
 
  // días con eventos → qué aulas
  const dotMap: Record<number, Set<string>> = {};
  events.forEach(ev => {
    const s = new Date(ev.start + 'T00:00:00');
    const e = new Date(ev.end   + 'T00:00:00');
    for (const d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!dotMap[day]) dotMap[day] = new Set();
        dotMap[day].add(ev.aula);
      }
    }
  });
 
  const monthLabel = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
 
  return (
    <div className="rounded-2xl border border-(--border) bg-surface p-4 shadow-sm">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold capitalize text-(--text-primary)">{monthLabel}</span>
        <div className="flex gap-1">
          {([-1, 1] as const).map(d => (
            <button
              key={d}
              onClick={() => onMonthChange(d)}
              className="w-6 h-6 rounded-lg flex items-center justify-center border border-(--border) bg-(--border-subtle) hover:bg-(--border) transition-colors"
            >
              {d === -1
                ? <HiChevronLeft className="w-3 h-3 text-(--text-secondary)" />
                : <HiChevronRight className="w-3 h-3 text-(--text-secondary)" />}
            </button>
          ))}
        </div>
      </div>
 
      {/* Días de la semana */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-(--text-muted) py-0.5">{d}</div>
        ))}
      </div>
 
      {/* Celdas */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
 
          const ds      = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = ds === today;
          const isSel   = ds === selStr;
          const dots    = dotMap[day] ? [...dotMap[day]] : [];
 
          return (
            <button
              key={day}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={[
                'w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors text-[11px]',
                isSel   ? 'bg-accent text-white font-bold'
                : isToday ? 'bg-(--accent)/15 text-accent font-bold'
                :           'text-(--text-primary) hover:bg-(--border-subtle)',
              ].join(' ')}
            >
              <span>{day}</span>
              {dots.length > 0 && (
                <div className="flex gap-0.75">
                  {dots.slice(0, 3).map(aula => (
                    <div
                      key={aula}
                      className="w-1 h-1 rounded-full"
                      style={{ background: isSel ? 'rgba(255,255,255,0.65)' : AULA_META[aula as keyof typeof AULA_META]?.color ?? '#267F6B' }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
 
      {/* Leyenda */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-(--border-subtle)">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[10px] text-(--text-muted)">Hoy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-(--accent)/40" />
          <span className="text-[10px] text-(--text-muted)">Con cursos</span>
        </div>
      </div>
    </div>
  );
}