'use client';
 
// src/app/admin/calendario/page.tsx  (o la ruta que corresponda al rol)
// Página del calendario personal — layout 67/33.
// Mantiene el design system del admin: fondo #080808, accent #267F6B,
// variables CSS del tema, mismas tipografías y bordes.
 
import { useState, useMemo } from 'react';
import { BigCalendar }         from '@/components/calendar/BigCalendar';
import { MiniCalendar }        from '@/components/calendar/MiniCalendar';
import { DayActivities }       from '@/components/calendar/DayActivities';
import { CalendarSideFilters, DEFAULT_SIDE_FILTERS } from '@/components/calendar/CalendarSideFilters';
import type { SideFiltersState } from '@/components/calendar/CalendarSideFilters';
import { MOCK_EVENTS } from '@/resources/calendarData';
 
// TODO: reemplazar con el profesor del usuario autenticado (llamada a API)
const PROFESOR_ACTUAL = 'Carlos Martínez';

export default function CalendarioPage() {
  const today = new Date();
 
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [filters, setFilters] = useState<SideFiltersState>(DEFAULT_SIDE_FILTERS);
 
  // Sincroniza mes del mini-cal cuando cambia la fecha seleccionada
  function handleSelectDate(d: Date) {
    setSelectedDate(d);
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }
 
  function handleMonthChange(delta: number) {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }
 
  // Filtrado global de eventos
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(ev => {
      if (ev.profesor !== PROFESOR_ACTUAL)     return false;
      if (!filters.aulas.includes(ev.aula))   return false;
      if (!filters.turnos.includes(ev.turno)) return false;
      if (filters.empresaIds.length > 0 && !filters.empresaIds.includes(ev.empresaId)) return false;
      return true;
    });
  }, [filters]);
 
  return (
    <section className="flex flex-col gap-4 h-full">
 
      {/* ── Cabecera ──────────────────────────────────────── */}
      <div>
       <h1 className="text-3xl font-bold text-(--text-primary)">Calendario</h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Calendario de cursos en las aulas de la academia.
          </p>
      </div>
 
      {/* ── Layout principal 67 / 33 ──────────────────────── */}
      <div
        className="flex gap-4 min-h-0"
        style={{ flex: 1, height: 'calc(100vh - 160px)' }}
      >
        {/* Calendario grande — 67% */}
        <div className="flex flex-col" style={{ flex: '0 0 67%' }}>
          <BigCalendar
            events={filteredEvents}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </div>
 
        {/* Sidebar — 33% */}
        <div
          className="flex flex-col gap-3 overflow-y-auto"
          style={{ flex: '0 0 calc(33% - 16px)' }}
        >
          {/* Mini calendario */}
          <MiniCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onMonthChange={handleMonthChange}
            events={filteredEvents}
          />
 
          {/* Actividades del día */}
          <DayActivities
            date={selectedDate}
            events={filteredEvents}
          />
 
          {/* Filtros */}
          <CalendarSideFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>
    </section>
  );
}