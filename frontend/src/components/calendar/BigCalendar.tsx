'use client';
 
// src/components/calendar/BigCalendar.tsx
// Calendario principal (67% del ancho).
// Vistas: mes, semana, día. Sin FullCalendar — implementación propia
// para mantener coherencia visual con el design system del admin.
 
import { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { CalendarEvent, Aula } from '@/resources/calendarData';
import { AULA_META } from '@/resources/calendarData';
 
type View = 'mes' | 'semana' | 'día';
 
interface Props {
  events: CalendarEvent[];
  currentMonth: Date;
  onMonthChange: (delta: number) => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}
 
// ── Helpers ──────────────────────────────────────────────────────────────────
 
function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
 
function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const offset   = firstDay === 0 ? 6 : firstDay - 1;
  const total    = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
 
function getWeekDates(anchor: Date): Date[] {
  const day    = anchor.getDay();
  const offset = day === 0 ? 6 : day - 1;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
 
const HOURS        = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20
const WEEK_LONG    = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const WEEK_SHORT   = ['L',   'M',   'X',   'J',   'V',   'S',   'D'];
 
// ── Sub-componentes ───────────────────────────────────────────────────────────
 
function EventChip({ ev, small }: { ev: CalendarEvent; small?: boolean }) {
  const meta = AULA_META[ev.aula];
  return (
    <div
      className={`rounded-md overflow-hidden mb-0.5 ${small ? 'px-1.5 py-0.5' : 'px-2 py-1'}`}
      style={{ background: meta.bg, borderLeft: `3px solid ${meta.color}` }}
    >
      <p
        className="font-bold truncate"
        style={{ fontSize: small ? 9 : 10, color: meta.color }}
      >
        {ev.title}
      </p>
      {!small && (
        <p className="truncate" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
          {ev.empresa} · {meta.label}
        </p>
      )}
    </div>
  );
}
 
// Vista mensual
function MonthView({ year, month, events, selectedDate, onSelectDate }: {
  year: number; month: number;
  events: CalendarEvent[]; selectedDate: Date;
  onSelectDate: (d: Date) => void;
}) {
  const weeks   = getMonthGrid(year, month);
  const todayDS = toYMD(new Date());
  const selDS   = toYMD(selectedDate);
 
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Cabecera días */}
      <div
        className="grid border-b border-(--border)"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {WEEK_LONG.map(d => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold text-(--text-muted)">{d}</div>
        ))}
      </div>
 
      {/* Semanas */}
      <div className="flex-1" style={{ display: 'grid', gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < weeks.length - 1 ? '1px solid var(--border-subtle, rgba(255,255,255,0.05))' : 'none' }}
          >
            {week.map((day, di) => {
              if (!day) return (
                <div
                  key={`e${di}`}
                  className="opacity-30"
                  style={{ borderRight: di < 6 ? '1px solid var(--border-subtle, rgba(255,255,255,0.05))' : 'none', background: 'var(--border-subtle)' }}
                />
              );
              const ds      = toYMD(day);
              const isToday = ds === todayDS;
              const isSel   = ds === selDS;
              const evs     = events.filter(ev => ev.start <= ds && ev.end > ds);
 
              return (
                <div
                  key={ds}
                  onClick={() => onSelectDate(day)}
                  className="p-1.5 overflow-hidden cursor-pointer transition-colors"
                  style={{
                    borderRight: di < 6 ? '1px solid var(--border-subtle, rgba(255,255,255,0.05))' : 'none',
                    background: isSel ? 'rgba(38,127,107,0.10)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.background = 'var(--border-subtle, rgba(255,255,255,0.04))'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isSel ? 'rgba(38,127,107,0.10)' : 'transparent'; }}
                >
                  <div
                    className="w-5.5 h-5.5 rounded-full flex items-center justify-center mb-1 text-[11px] font-bold"
                    style={{
                      background: isToday ? '#267F6B' : 'transparent',
                      color: isToday ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {day.getDate()}
                  </div>
                  {evs.slice(0, 2).map(ev => <EventChip key={ev.id} ev={ev} small />)}
                  {evs.length > 2 && (
                    <p className="text-[9px] text-(--text-muted) font-semibold">+{evs.length - 2} más</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
 
// Vista semanal
function WeekView({ anchor, events, selectedDate, onSelectDate }: {
  anchor: Date; events: CalendarEvent[];
  selectedDate: Date; onSelectDate: (d: Date) => void;
}) {
  const days    = getWeekDates(anchor);
  const todayDS = toYMD(new Date());
  const selDS   = toYMD(selectedDate);
 
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Cabecera */}
      <div
        className="grid sticky top-0 z-10 bg-surface border-b border-(--border)"
        style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}
      >
        <div />
        {days.map((day, i) => {
          const ds      = toYMD(day);
          const isToday = ds === todayDS;
          const isSel   = ds === selDS;
          return (
            <div key={i} onClick={() => onSelectDate(day)} className="py-2 text-center cursor-pointer">
              <p className="text-[10px] text-(--text-muted) font-medium">{WEEK_SHORT[i]}</p>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1 text-xs font-bold"
                style={{
                  background: isToday ? '#267F6B' : isSel ? 'rgba(38,127,107,0.15)' : 'transparent',
                  color: isToday ? '#fff' : 'var(--text-primary)',
                }}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
 
      {/* Horas */}
      {HOURS.map(hour => (
        <div
          key={hour}
          className="grid"
          style={{ gridTemplateColumns: '48px repeat(7, 1fr)', minHeight: 56, borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.04))' }}
        >
          <div className="text-[9px] text-(--text-muted) text-right pr-2 pt-1 font-mono tabular-nums">
            {String(hour).padStart(2, '0')}:00
          </div>
          {days.map((day, di) => {
            const ds   = toYMD(day);
            const evs  = events.filter(ev => ev.start <= ds && ev.end > ds);
            const isSel = ds === selDS;
            return (
              <div
                key={di}
                onClick={() => onSelectDate(day)}
                className="border-l border-(--border-subtle) p-1 cursor-pointer transition-colors"
                style={{ background: isSel ? 'rgba(38,127,107,0.06)' : 'transparent' }}
              >
                {hour === 9  && evs.filter(e => e.turno === 'mañana').map(ev => <EventChip key={ev.id} ev={ev} />)}
                {hour === 16 && evs.filter(e => e.turno === 'tarde').map(ev =>  <EventChip key={ev.id} ev={ev} />)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
 
// Vista diaria
function DayView({ date, events }: { date: Date; events: CalendarEvent[] }) {
  const ds       = toYMD(date);
  const dayEvs   = events.filter(ev => ev.start <= ds && ev.end > ds);
  const dateLabel = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
 
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <p className="text-sm font-bold text-(--text-primary) capitalize mb-4">{dateLabel}</p>
      {HOURS.map(hour => {
        const isMorning = hour < 14;
        const slotEvs   = dayEvs.filter(ev =>
          (isMorning ? ev.turno === 'mañana' : ev.turno === 'tarde') &&
          hour === (isMorning ? 9 : 16)
        );
        return (
          <div key={hour} className="flex gap-3 mb-2">
            <span className="text-[10px] text-(--text-muted) w-10 text-right pt-1 font-mono tabular-nums shrink-0">
              {String(hour).padStart(2, '0')}:00
            </span>
            <div
              className="flex-1 pl-3 min-h-8"
              style={{ borderLeft: '2px solid var(--border-subtle, rgba(255,255,255,0.06))' }}
            >
              {slotEvs.map(ev => {
                const meta = AULA_META[ev.aula];
                return (
                  <div
                    key={ev.id}
                    className="rounded-xl p-3 mb-2"
                    style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}
                  >
                    <p className="text-sm font-bold text-(--text-primary)">{ev.title}</p>
                    <p className="text-xs text-(--text-secondary) mt-1">
                      {ev.empresa} · {meta.label} · {ev.profesor}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
 
// ── Componente principal ──────────────────────────────────────────────────────
 
export function BigCalendar({ events, currentMonth, onMonthChange, selectedDate, onSelectDate }: Props) {
  const [view, setView] = useState<View>('mes');
 
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
 
  const headerLabel = useMemo(() => {
    if (view === 'mes') {
      return currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
    if (view === 'semana') {
      const days = getWeekDates(selectedDate);
      return `${days[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – ${days[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, [view, currentMonth, selectedDate]);
 
  function navigate(delta: number) {
    if (view === 'mes') { onMonthChange(delta); return; }
    const next = new Date(selectedDate);
    if (view === 'semana') next.setDate(next.getDate() + delta * 7);
    else                   next.setDate(next.getDate() + delta);
    onSelectDate(next);
  }
 
  return (
    <div className="rounded-2xl border border-(--border) bg-surface shadow-sm flex flex-col overflow-hidden h-full">
 
      {/* ── Toolbar ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-(--border) shrink-0 gap-4 flex-wrap">
 
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-(--border) bg-(--border-subtle) hover:bg-(--border) transition-colors"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5 text-(--text-secondary)" />
          </button>
          <span className="text-sm font-bold text-(--text-primary) capitalize min-w-40 text-center">
            {headerLabel}
          </span>
          <button
            onClick={() => navigate(1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-(--border) bg-(--border-subtle) hover:bg-(--border) transition-colors"
          >
            <ChevronRightIcon className="w-3.5 h-3.5 text-(--text-secondary)" />
          </button>
          <button
            onClick={() => { onSelectDate(new Date()); onMonthChange(0); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-accent text-accent bg-(--accent)/10 hover:bg-(--accent)/20 transition-colors"
            style={{ color: '#267F6B', borderColor: '#267F6B', background: 'rgba(38,127,107,0.10)' }}
          >
            Hoy
          </button>
        </div>
 
        {/* Toggle de vista */}
        <div className="flex bg-(--border-subtle) rounded-xl p-1 border border-(--border) gap-0.5">
          {(['mes', 'semana', 'día'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
              style={{
                background: view === v ? 'var(--bg-surface, #0f0f0f)' : 'transparent',
                color:      view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow:  view === v ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
 
        {/* Leyenda aulas */}
        <div className="flex items-center gap-4">
          {(['aula1', 'aula2', 'aula3'] as Aula[]).map(a => (
            <div key={a} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: AULA_META[a].color }} />
              <span className="text-[11px] text-(--text-secondary) font-medium">{AULA_META[a].label}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Body ─────────────────────────────────────────── */}
      {view === 'mes'    && <MonthView year={year} month={month} events={events} selectedDate={selectedDate} onSelectDate={onSelectDate} />}
      {view === 'semana' && <WeekView  anchor={selectedDate} events={events} selectedDate={selectedDate} onSelectDate={onSelectDate} />}
      {view === 'día'    && <DayView   date={selectedDate} events={events} />}
    </div>
  );
}