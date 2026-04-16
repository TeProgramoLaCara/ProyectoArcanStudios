"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { DayCellContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
}

interface Sesion {
  id: number;
  fecha_ini: string;
  fecha_fin: string;
  turno: string;
  aulaId: number;
  empresa?: string;
  curso?: string;
  profesor?: string;
  profesorColor?: string;
}

export default function CalendariosAulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [globalMonthDate, setGlobalMonthDate] = useState(() => new Date(2026, 2, 1));

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/aulas').then(res => res.json()),
      fetch('http://localhost:4000/sesiones').then(res => res.json())
    ]).then(([dataAulas, dataSesiones]) => {
      setAulas(dataAulas);
      setSesiones(dataSesiones);
    }).catch(err => {
      console.error("No se pudo obtener la información. Asegúrate de que json-server está corriendo en el puerto 4000.", err);
    });
  }, []);

  const globalMonthLabel = useMemo(
    () =>
      globalMonthDate.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      }),
    [globalMonthDate]
  );

  const moveGlobalMonth = (delta: number) => {
    setGlobalMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">Disponibilidad de Aulas</h1>

      {/* Leyenda de Colores */}
      <div className="flex flex-wrap gap-6 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
        <span className="font-semibold text-gray-600 mr-2">Leyenda de Ocupación:</span>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border shadow-sm" style={{backgroundColor: '#4ade80', borderColor: '#22c55e'}}></div>
          <span className="text-sm font-medium text-gray-700">Libre (Mañana y Tarde)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border shadow-sm" style={{backgroundColor: '#fb923c', borderColor: '#f97316'}}></div>
          <span className="text-sm font-medium text-gray-700">Parcial (Mañana o Tarde)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border shadow-sm" style={{backgroundColor: '#f87171', borderColor: '#ef4444'}}></div>
          <span className="text-sm font-medium text-gray-700">Ocupado (Todo el día)</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => moveGlobalMonth(-1)}
          className="px-3 py-1.5 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          ←
        </button>
        <span className="text-sm md:text-base font-semibold text-gray-700 capitalize min-w-[180px] text-center">
          {globalMonthLabel}
        </span>
        <button
          type="button"
          onClick={() => moveGlobalMonth(1)}
          className="px-3 py-1.5 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          →
        </button>
      </div>

      {/* Grid de Calendarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {aulas.map(aula => (
          <AulaCalendar 
            key={aula.id} 
            aula={aula} 
            sesiones={sesiones.filter(s => s.aulaId === aula.id)} 
            globalMonthDate={globalMonthDate}
          />
        ))}
        {aulas.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
            <p>Cargando aulas... ¿Has arrancado <code>npm run api</code>?</p>
          </div>
        )}
      </div>
    </div>
  );
}

type Turno = 'Mañana' | 'Tarde';

interface SlotReservation {
  empresa: string;
  curso: string;
  profesor: string;
  profesorColor: string;
}

interface DayReservations {
  Mañana?: SlotReservation;
  Tarde?: SlotReservation;
}

const PROFESSOR_TEST_COLORS = ['#2563eb', '#f97316', '#16a34a', '#9333ea', '#db2777'];

function AulaCalendar({
  aula,
  sesiones,
  globalMonthDate
}: {
  aula: Aula;
  sesiones: Sesion[];
  globalMonthDate: Date;
}) {
  const calendarRef = useRef<FullCalendar>(null);
  const dayMap = useMemo(() => {
    const map: Record<string, DayReservations> = {};
    sesiones.forEach(sesion => {
      const dateStr = sesion.fecha_ini.split('T')[0];
      const turno = sesion.turno as Turno;

      if (turno !== 'Mañana' && turno !== 'Tarde') return;
      if (!map[dateStr]) map[dateStr] = {};

      map[dateStr][turno] = {
        empresa: sesion.empresa ?? 'Empresa demo',
        curso: sesion.curso ?? '',
        profesor: sesion.profesor ?? `Profesor ${sesion.id}`,
        profesorColor: sesion.profesorColor ?? PROFESSOR_TEST_COLORS[sesion.id % PROFESSOR_TEST_COLORS.length]
      };
    });
    return map;
  }, [sesiones]);

  useEffect(() => {
    if (!calendarRef.current) return;
    calendarRef.current.getApi().gotoDate(globalMonthDate);
  }, [globalMonthDate]);

  const getSlotBgColor = (hasSlot: boolean, isFullyOccupied: boolean) => {
    if (!hasSlot) return '#4ade80';
    return isFullyOccupied ? '#f87171' : '#fb923c';
  };

  const dayCellContent = (arg: DayCellContentArg) => {
    const localDate = new Date(arg.date.getTime() - arg.date.getTimezoneOffset() * 60000);
    const dateStr = localDate.toISOString().split('T')[0];
    const dayReservations = dayMap[dateStr] ?? {};
    const hasMorning = Boolean(dayReservations.Mañana);
    const hasAfternoon = Boolean(dayReservations.Tarde);
    const isFullyOccupied = hasMorning && hasAfternoon;
    const morning = dayReservations.Mañana;
    const afternoon = dayReservations.Tarde;

    const SlotInfo = ({ reserva }: { reserva?: SlotReservation }) => {
      if (!reserva) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[9px] opacity-50">Libre</span>
          </div>
        );
      }
      const cleanCurso = (reserva.curso || 'Sin curso').split(' - ')[0].trim();
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 overflow-hidden px-1 leading-tight text-black">
          <div className="flex items-center gap-1">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: reserva.profesorColor }}
            />
            <span className="truncate text-[8px] opacity-80">{reserva.profesor}</span>
          </div>
          <div className="w-full truncate text-center text-[9px] font-bold">{cleanCurso}</div>
          <div className="w-full truncate text-center text-[8px] opacity-70">{reserva.empresa}</div>
        </div>
      );
    };

    return (
      <div className="relative h-full w-full overflow-hidden text-black">
        {/* Número del día en posición absoluta, en negrita */}
        <div className="absolute right-1 top-0.5 z-10 text-[10px] font-bold leading-none">
          {arg.dayNumberText}
        </div>
        <div className="flex h-full flex-col">
          <div
            className="flex-1 overflow-hidden border-t border-black/10"
            style={{ backgroundColor: getSlotBgColor(hasMorning, isFullyOccupied) }}
            title={morning ? `Mañana · ${morning.profesor} · ${morning.empresa}` : 'Mañana libre'}
          >
            <SlotInfo reserva={morning} />
          </div>
          <div
            className="flex-1 overflow-hidden border-t border-black/10"
            style={{ backgroundColor: getSlotBgColor(hasAfternoon, isFullyOccupied) }}
            title={afternoon ? `Tarde · ${afternoon.profesor} · ${afternoon.empresa}` : 'Tarde libre'}
          >
            <SlotInfo reserva={afternoon} />
          </div>
        </div>
      </div>
    );
  };



  // Convertir sesiones a eventos estándar de FullCalendar para si se renderizan dentro
  const events = sesiones.map(s => ({
    id: s.id.toString(),
    title: s.turno,
    start: s.fecha_ini,
    end: s.fecha_fin,
    color: s.turno === 'Mañana' ? '#3b82f6' : '#8b5cf6', // Azul y morado para identificarlos si se abre la semana
    allDay: false
  }));

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 overflow-hidden transform transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-center border-b pb-3">
        <h2 className="text-xl font-bold tracking-wide text-indigo-900">{aula.nombre}</h2>
      </div>
      
      {/* Overrides de color para el interior del calendario */}
      <style>{`
        .fc .fc-toolbar-title,
        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number {
          color: #000 !important;
        }
        .fc .fc-button {
          color: #fff !important;
        }
      `}</style>
      <div className="text-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          initialDate={globalMonthDate}
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next'
          }}
          events={events} // Los eventos de sesiones pintados
          dayCellContent={dayCellContent}
          height="auto" // Ajusta a la altura del contenido del mes
          locale="es" // Traducción
          buttonText={{
            today: 'Hoy'
          }}
          fixedWeekCount={false}
        />
      </div>
    </div>
  );
}