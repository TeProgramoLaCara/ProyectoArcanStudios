'use client';

import { useEffect, useMemo, useState } from 'react';
import { BigCalendar } from '@/components/calendar/BigCalendar';
import { MiniCalendar } from '@/components/calendar/MiniCalendar';
import { DayActivities } from '@/components/calendar/DayActivities';
import { CalendarSideFilters, DEFAULT_SIDE_FILTERS } from '@/components/calendar/CalendarSideFilters';
import type { SideFiltersState } from '@/components/calendar/CalendarSideFilters';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import ClassroomCalendar from '@/components/calendar/ClassroomCalendar';
import MonthNavigator from '@/components/calendar/MonthNavigator';
import { getCalendarData } from '@/services/calendar.service';
import { mapCalendarApiData } from '@/components/calendar/calendar.mapper';
import type {
  CalendarEvent,
  CalendarProfessorOption,
  CalendarCompanyOption,
} from '@/components/calendar/types';
import type { CalendarEvent as PersonalCalendarEvent } from '@/resources/calendarData';

const PROFESOR_ACTUAL = 'Carlos Martínez';

export default function CalendarioPage() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [filters, setFilters] = useState<SideFiltersState>(DEFAULT_SIDE_FILTERS);
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  const [professor, setProfessor] = useState('all');
  const [company, setCompany] = useState('all');
  const [globalCurrentDate, setGlobalCurrentDate] = useState(new Date());
  const [eventsState, setEventsState] = useState<CalendarEvent[]>([]);
  const [professorOptions, setProfessorOptions] = useState<CalendarProfessorOption[]>([]);
  const [companyOptions, setCompanyOptions] = useState<CalendarCompanyOption[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    getCalendarData()
      .then((data) => {
        const mapped = mapCalendarApiData(data);
        setEventsState(mapped.events);
        setProfessorOptions(mapped.professors);
        setCompanyOptions(mapped.companies);
        setGlobalError(null);
      })
      .catch((error) => {
        console.error('Error cargando calendario global:', error);
        setGlobalError('No se pudieron cargar los datos del calendario global.');
      })
      .finally(() => setLoadingGlobal(false));
  }, []);

  function handleSelectDate(d: Date) {
    setSelectedDate(d);
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function handleMonthChange(delta: number) {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  function handleGlobalPrev() {
    setGlobalCurrentDate((date) => {
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate;
    });
  }

  function handleGlobalNext() {
    setGlobalCurrentDate((date) => {
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  }

  function handleDeleteEvent(eventId: string) {
    setEventsState((prev) => prev.filter((event) => event.id !== eventId));
  }

  function handleUpdateEvent(updatedEvent: CalendarEvent) {
    setEventsState((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
    );
  }

  const personalEvents = useMemo<PersonalCalendarEvent[]>(() => {
    return eventsState.map((event) => ({
      id: event.id,
      title: event.title,
      empresa: event.companyName,
      empresaId: event.companyId,
      profesor: event.professorName,
      profesorId: event.professorId,
      start: event.start,
      end: event.end,
      aula: event.aula,
      turno: event.turno,
      tool: event.capacitaciones[0] ?? 'Curso',
      color: event.color,
    }));
  }, [eventsState]);

  const filteredEvents = useMemo(() => {
    return personalEvents.filter((ev) => {
      if (ev.profesor !== PROFESOR_ACTUAL) return false;
      if (!filters.aulas.includes(ev.aula)) return false;
      if (!filters.turnos.includes(ev.turno)) return false;
      if (filters.empresaIds.length > 0 && !filters.empresaIds.includes(ev.empresaId)) return false;
      return true;
    });
  }, [filters, personalEvents]);

  const globalFilteredEvents = useMemo(() => {
    return eventsState.filter((event) => {
      const matchesProfessor = professor === 'all' || event.professorId === professor;
      const matchesCompany = company === 'all' || event.companyId === company;
      return matchesProfessor && matchesCompany;
    });
  }, [eventsState, professor, company]);

  const aula1Events = globalFilteredEvents.filter((event) => event.aula === 'aula1');
  const aula2Events = globalFilteredEvents.filter((event) => event.aula === 'aula2');
  const aula3Events = globalFilteredEvents.filter((event) => event.aula === 'aula3');

  return (
    <section className="flex flex-col gap-4 h-full">

      <div className="rounded-[26px] border border-(--border) bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-(--text-primary)">Calendario</h1>
            <p className="mt-1 text-sm text-(--text-secondary)">
              {isGlobalMode
                ? 'Vista global de aulas (igual que admin).'
                : 'Vista personal del profesor.'}
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-xl border border-(--border) bg-surface-elevated px-4 py-2.5">
            <span className="text-sm font-medium text-(--text-primary)">Calendario global</span>
            <button
              type="button"
              role="switch"
              aria-checked={isGlobalMode}
              onClick={() => setIsGlobalMode((prev) => !prev)}
              className="relative h-7 w-14 rounded-full border border-(--border) bg-(--border) transition-colors"
            >
              <span
                className="absolute top-1 h-5 w-5 rounded-full bg-[#267F6B] shadow-sm transition-all duration-300 ease-in-out"
                style={{ left: isGlobalMode ? 'calc(100% - 24px)' : '4px' }}
              />
            </button>
          </label>
        </div>
      </div>

      {!isGlobalMode && (
        <div
          className="flex gap-4 min-h-0"
          style={{ flex: 1, height: 'calc(100vh - 160px)' }}
        >
          <div className="flex flex-col" style={{ flex: '0 0 67%' }}>
            <BigCalendar
              events={filteredEvents}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </div>

          <div
            className="flex flex-col gap-3 overflow-y-auto"
            style={{ flex: '0 0 calc(33% - 16px)' }}
          >
            <MiniCalendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onMonthChange={handleMonthChange}
              events={filteredEvents}
            />
            <DayActivities date={selectedDate} events={filteredEvents} />
            <CalendarSideFilters filters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {isGlobalMode && (
        <>
          {loadingGlobal ? (
            <div className="p-6 text-(--text-primary)">Cargando calendario global...</div>
          ) : globalError ? (
            <div className="p-6 text-red-400">{globalError}</div>
          ) : (
            <div className="rounded-2xl p-2">
              <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
                <CalendarFilters
                  professor={professor}
                  company={company}
                  professorLegend={professorOptions}
                  companyLegend={companyOptions}
                  onProfessorChange={setProfessor}
                  onCompanyChange={setCompany}
                  onReset={() => {
                    setProfessor('all');
                    setCompany('all');
                  }}
                />

                <MonthNavigator
                  currentDate={globalCurrentDate}
                  onPrev={handleGlobalPrev}
                  onNext={handleGlobalNext}
                />

                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                  <ClassroomCalendar
                    title="Aula 1"
                    aulaId="aula1"
                    events={aula1Events}
                    currentDate={globalCurrentDate}
                    onDeleteEvent={handleDeleteEvent}
                    onUpdateEvent={handleUpdateEvent}
                  />
                  <ClassroomCalendar
                    title="Aula 2"
                    aulaId="aula2"
                    events={aula2Events}
                    currentDate={globalCurrentDate}
                    onDeleteEvent={handleDeleteEvent}
                    onUpdateEvent={handleUpdateEvent}
                  />
                  <ClassroomCalendar
                    title="Aula 3"
                    aulaId="aula3"
                    events={aula3Events}
                    currentDate={globalCurrentDate}
                    onDeleteEvent={handleDeleteEvent}
                    onUpdateEvent={handleUpdateEvent}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}