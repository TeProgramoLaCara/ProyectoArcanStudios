"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  allEvents,
  allReservas,
  capacitaciones,
  cursos,
  type Reserva,
} from "@/resources/data";
import type { EventInput } from "@fullcalendar/core";

type DayAvailability = {
  key: string;
  date: Date;
  status: "none" | "partial" | "full";
  availableTurnos: Array<"manana" | "tarde">;
};

const AULA_CAPACITY_PER_TURNO = 3;
const CURRENT_CLIENT = "Alejandro Vega";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIso(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function formatHumanDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function parseReservaHumanDate(value: string): Date | null {
  const rangeStart = value.split(" - ")[0]?.trim() ?? value;
  const months: Record<string, number> = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dic: 11,
  };
  const normalized = rangeStart.toLowerCase();
  const parts = normalized.split(" ");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = months[parts[1]];
  const year = Number(parts[2]);
  if (!day || month === undefined || !year) return null;
  return new Date(year, month, day);
}

function parseReservaDateRange(value: string): { start: Date; endInclusive: Date } | null {
  const [rawStart, rawEnd] = value.split(" - ").map((part) => part.trim());
  const start = parseReservaHumanDate(rawStart);
  if (!start) return null;
  const endInclusive = rawEnd ? parseReservaHumanDate(rawEnd) ?? start : start;
  return { start, endInclusive };
}

function getAvailabilityByDay(date: Date): DayAvailability {
  const dayOfWeek = date.getDay();
  const key = toIsoDate(date);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { key, date, status: "none", availableTurnos: [] };
  }

  let occupiedManana = 0;
  let occupiedTarde = 0;

  for (const event of allEvents) {
    const start = parseIso(event.start);
    const endExclusive = parseIso(event.end);
    if (date >= start && date < endExclusive) {
      if (event.turno === "manana") occupiedManana += 1;
      if (event.turno === "tarde") occupiedTarde += 1;
    }
  }

  const freeManana = occupiedManana < AULA_CAPACITY_PER_TURNO;
  const freeTarde = occupiedTarde < AULA_CAPACITY_PER_TURNO;

  if (freeManana && freeTarde) {
    return { key, date, status: "full", availableTurnos: ["manana", "tarde"] };
  }
  if (freeManana || freeTarde) {
    return {
      key,
      date,
      status: "partial",
      availableTurnos: freeManana ? ["manana"] : ["tarde"],
    };
  }
  return { key, date, status: "none", availableTurnos: [] };
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

function getRangeAvailability(
  startDate: Date,
  durationWeeks: number,
): {
  status: "none" | "partial" | "full";
  availableTurnos: Array<"manana" | "tarde">;
} {
  const durationDays = durationWeeks * 7;
  const availableTurnos: Array<"manana" | "tarde"> = [];

  const isTurnoAvailableForWholeRange = (turno: "manana" | "tarde") => {
    for (let i = 0; i < durationDays; i += 1) {
      const day = addDays(startDate, i);
      const dayOfWeek = day.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      const dayAvailability = getAvailabilityByDay(day);
      if (!dayAvailability.availableTurnos.includes(turno)) {
        return false;
      }
    }
    return true;
  };

  if (isTurnoAvailableForWholeRange("manana")) availableTurnos.push("manana");
  if (isTurnoAvailableForWholeRange("tarde")) availableTurnos.push("tarde");

  if (availableTurnos.length === 2) return { status: "full", availableTurnos };
  if (availableTurnos.length === 1) return { status: "partial", availableTurnos };
  return { status: "none", availableTurnos: [] };
}

export default function ClienteReservasPage() {
  const { isDark } = useTheme();
  const reservationsCalendarRef = useRef<FullCalendar>(null);
  const bookingCalendarRef = useRef<FullCalendar>(null);
  const [reservasState, setReservasState] = useState<Reserva[]>(allReservas);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [activeReservationsMonth, setActiveReservationsMonth] = useState(new Date());

  const [alumnos, setAlumnos] = useState(10);
  const [requestType, setRequestType] = useState<"curso" | "capacitacion" | "personalizado">(
    "curso",
  );
  const [selectedCurso, setSelectedCurso] = useState(cursos[0]?.id ?? "");
  const [selectedCap, setSelectedCap] = useState(capacitaciones[0]?.id ?? "");
  const [customRequest, setCustomRequest] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<"manana" | "tarde" | "">("");

  const reservasActivas = useMemo(
    () =>
      reservasState.filter(
        (r) =>
          r.clientName === CURRENT_CLIENT &&
          (r.status === "Pendiente" || r.status === "Confirmada" || r.status === "En curso"),
      ),
    [reservasState],
  );

  const requiredWeeks = useMemo(() => {
    if (requestType === "curso") {
      const selected = cursos.find((c) => c.id === selectedCurso);
      return Math.max(2, selected?.capacitaciones.length ?? 2);
    }
    if (requestType === "capacitacion") {
      return 2;
    }
    return 2;
  }, [requestType, selectedCurso]);

  const activeReservationEvents = useMemo<EventInput[]>(
    () =>
      reservasActivas.flatMap((reserva) => {
          const range = parseReservaDateRange(reserva.fecha);
          if (!range) return [];
          const start = toIsoDate(range.start);
          const endExclusiveDate = addDays(range.endInclusive, 1);
          const end = toIsoDate(endExclusiveDate);
          return [{
            id: `active-reservation-${reserva.id}-${start}`,
            title: reserva.curso,
            start,
            end,
            allDay: true,
            backgroundColor: "rgba(56, 189, 248, 0.45)",
            borderColor: "rgba(56, 189, 248, 0.85)",
            textColor: "#e0f2fe",
          }];
        }),
    [reservasActivas],
  );

  const bookingPreviewEvents = useMemo<EventInput[]>(() => {
    if (!selectedDay || !selectedTurno) return [];
    const start = toIsoDate(selectedDay.date);
    const endExclusive = toIsoDate(addDays(selectedDay.date, requiredWeeks * 7));
    const turnoLabel = selectedTurno === "manana" ? "Mañana" : "Tarde";
    return [
      {
        id: "booking-preview",
        title: `Bloque reservado (${turnoLabel})`,
        start,
        end: endExclusive,
        allDay: true,
        backgroundColor: "rgba(59, 130, 246, 0.35)",
        borderColor: "rgba(96, 165, 250, 0.9)",
        textColor: "#dbeafe",
      },
    ];
  }, [selectedDay, selectedTurno, requiredWeeks]);

  useEffect(() => {
    const api = reservationsCalendarRef.current?.getApi();
    if (api) {
      api.gotoDate(activeReservationsMonth);
    }
  }, [activeReservationsMonth]);

  useEffect(() => {
    const api = bookingCalendarRef.current?.getApi();
    if (api) {
      api.gotoDate(calendarMonth);
    }
  }, [calendarMonth]);

  const resetForm = () => {
    setStep(1);
    setAlumnos(10);
    setRequestType("curso");
    setSelectedCurso(cursos[0]?.id ?? "");
    setSelectedCap(capacitaciones[0]?.id ?? "");
    setCustomRequest("");
    setSelectedDay(null);
    setSelectedTurno("");
    setCalendarMonth(new Date());
  };

  const canGoStep2 =
    alumnos > 0 &&
    (requestType === "curso"
      ? Boolean(selectedCurso)
      : requestType === "capacitacion"
        ? Boolean(selectedCap)
        : customRequest.trim().length > 4);

  const canSubmit = Boolean(selectedDay && selectedTurno);

  const selectedRequestLabel =
    requestType === "curso"
      ? cursos.find((c) => c.id === selectedCurso)?.title ?? "Curso"
      : requestType === "capacitacion"
        ? capacitaciones.find((c) => c.id === selectedCap)?.title ?? "Capacitación"
        : `Personalizado: ${customRequest}`;
  const selectedEndDate = selectedDay
    ? addDays(selectedDay.date, requiredWeeks * 7 - 1)
    : null;

  const submitReservation = () => {
    if (!selectedDay || !selectedTurno) return;
    const newReserva: Reserva = {
      id: `r-${Date.now()}`,
      clientName: CURRENT_CLIENT,
      company: "Nova",
      curso: selectedRequestLabel,
      capacitaciones:
        requestType === "curso"
          ? cursos
              .find((c) => c.id === selectedCurso)
              ?.capacitaciones.map(
                (capId) => capacitaciones.find((cap) => cap.id === capId)?.title ?? capId,
              ) ?? []
          : requestType === "capacitacion"
            ? [capacitaciones.find((cap) => cap.id === selectedCap)?.title ?? "Capacitación"]
            : ["Solicitud personalizada"],
      status: "Pendiente",
      fecha: `${formatHumanDate(selectedDay.date)} - ${formatHumanDate(addDays(selectedDay.date, requiredWeeks * 7 - 1))}`,
    };
    setReservasState((prev) => [newReserva, ...prev]);
    setShowModal(false);
    resetForm();
  };

  return (
    <section className={`p-6 ${isDark ? "bg-[#050505]" : "bg-[#f8fafc]"}`}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div
          className={`rounded-[26px] border p-6 ${
            isDark
              ? "border-white/10 bg-[#0d0d0d] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
              : "border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                Mis reservas
              </h1>
              <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-[#475569]"}`}>
                Resumen de reservas activas y solicitud de nuevas plazas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
            >
              + Nueva reserva
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}
          >
            <p className={`text-xs uppercase tracking-wide ${isDark ? "text-white/40" : "text-[#64748b]"}`}>Activas</p>
            <p className={`mt-1 text-2xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>{reservasActivas.length}</p>
          </div>
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? "text-white/40" : "text-[#64748b]"}`}>Pendientes</p>
            <p className={`mt-1 text-2xl font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>
              {reservasActivas.filter((r) => r.status === "Pendiente").length}
            </p>
          </div>
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? "text-white/40" : "text-[#64748b]"}`}>En curso</p>
            <p className={`mt-1 text-2xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
              {reservasActivas.filter((r) => r.status === "En curso").length}
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
              Calendario de mis reservas activas
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveReservationsMonth(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                  )
                }
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
              >
                ←
              </button>
              <span className={`text-sm ${isDark ? "text-white/85" : "text-[#0f172a]"}`}>
                {activeReservationsMonth.toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveReservationsMonth(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                  )
                }
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[500px_minmax(320px,1fr)]">
            <div>
              <div
                className="calendar-modern-wrapper overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]"
                style={{ height: "520px", width: "500px" }}
              >
                <FullCalendar
                  ref={reservationsCalendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  initialDate={activeReservationsMonth}
                  height="100%"
                  fixedWeekCount={false}
                  weekends={false}
                  editable={false}
                  eventDisplay="block"
                  displayEventTime={false}
                  events={activeReservationEvents}
                  dayMaxEventRows={2}
                  eventContent={(arg) => (
                    <div
                      style={{
                        padding: "2px 6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: "#e0f2fe",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {arg.event.title}
                    </div>
                  )}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-sky-500/25 px-2 py-1 text-sky-100">
                  Día con reserva activa
                </span>
              </div>
            </div>

            <div
              className={`rounded-xl border p-3 ${isDark ? "border-white/10 bg-[#111111]" : "border-black/[0.08] bg-white"}`}
            >
              <h4 className={`mb-2.5 text-base font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                Reservas activas
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {reservasActivas.slice(0, 7).map((reserva) => (
                  <div
                    key={reserva.id}
                    className={`rounded-lg border px-3 py-2 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-[#f8fafc]"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={`truncate text-xs font-semibold leading-tight ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                          {reserva.curso}
                        </h3>
                        <p className={`truncate text-[11px] leading-tight ${isDark ? "text-white/50" : "text-[#64748b]"}`}>
                          Fecha: {reserva.fecha} · Empresa: {reserva.company}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          reserva.status === "En curso"
                            ? "bg-emerald-500/20 text-emerald-200"
                            : reserva.status === "Confirmada"
                              ? "bg-sky-500/20 text-sky-200"
                              : "bg-amber-500/20 text-amber-200"
                        }`}
                      >
                        {reserva.status}
                      </span>
                    </div>
                  </div>
                ))}
                {reservasActivas.length > 7 && (
                  <p className={`rounded-md border px-3 py-1.5 text-xs ${isDark ? "border-white/10 text-white/55" : "border-black/[0.08] text-[#64748b]"}`}>
                    +{reservasActivas.length - 7} reservas más
                  </p>
                )}
                {reservasActivas.length === 0 && (
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-[#64748b]"}`}>
                    No tienes reservas activas ahora mismo.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-6xl min-h-[82vh] rounded-2xl border ${isDark ? "border-white/10 bg-[#111111]" : "border-black/[0.08] bg-white"} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                Nueva reserva · Paso {step} de 3
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/70"
              >
                Cerrar
              </button>
            </div>

            {step === 1 && (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs uppercase ${isDark ? "text-white/45" : "text-[#64748b]"}`}>Número de alumnos</label>
                    <input
                      type="number"
                      min={1}
                      value={alumnos}
                      onChange={(e) => setAlumnos(Number(e.target.value))}
                      className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs uppercase ${isDark ? "text-white/45" : "text-[#64748b]"}`}>Tipo de solicitud</label>
                    <select
                      value={requestType}
                      onChange={(e) =>
                        setRequestType(e.target.value as "curso" | "capacitacion" | "personalizado")
                      }
                      className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                    >
                      <option value="curso">Curso</option>
                      <option value="capacitacion">Capacitación</option>
                      <option value="personalizado">Curso personalizado</option>
                    </select>
                  </div>
                </div>

                {requestType === "curso" && (
                  <select
                    value={selectedCurso}
                    onChange={(e) => setSelectedCurso(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                  >
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.title}
                      </option>
                    ))}
                  </select>
                )}

                {requestType === "capacitacion" && (
                  <select
                    value={selectedCap}
                    onChange={(e) => setSelectedCap(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                  >
                    {capacitaciones.map((cap) => (
                      <option key={cap.id} value={cap.id}>
                        {cap.title}
                      </option>
                    ))}
                  </select>
                )}

                {requestType === "personalizado" && (
                  <textarea
                    rows={4}
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="Describe el curso/capacitación personalizada que necesitas..."
                    className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                  />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="flex min-h-[62vh] flex-col gap-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                      )
                    }
                    className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
                  >
                    ←
                  </button>
                  <p className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                    {calendarMonth.toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                      )
                    }
                    className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
                  >
                    →
                  </button>
                </div>
                <p className={`text-xs ${isDark ? "text-white/60" : "text-[#64748b]"}`}>
                  Duración de esta reserva: <strong>{requiredWeeks} semana(s)</strong> (mínimo 2; 1 semana por capacitación del curso).
                </p>

                <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div
                    className="calendar-modern-wrapper overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]"
                    style={{ height: "100%", minHeight: "500px" }}
                  >
                    <FullCalendar
                      key={`booking-${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${selectedDay?.key ?? "none"}`}
                      ref={bookingCalendarRef}
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      headerToolbar={false}
                      initialDate={calendarMonth}
                      height="100%"
                      fixedWeekCount={false}
                      weekends={false}
                      editable={false}
                      eventDisplay="block"
                      displayEventTime={false}
                      events={bookingPreviewEvents}
                      dateClick={(info) => {
                        const dayInfo = getAvailabilityByDay(info.date);
                        if (dayInfo.status === "none") return;
                        const range = getRangeAvailability(info.date, requiredWeeks);
                        if (range.status === "none") return;
                        setSelectedDay(dayInfo);
                        if (range.status === "full") {
                          setSelectedTurno("manana");
                        } else {
                          setSelectedTurno(range.availableTurnos[0] ?? "");
                        }
                      }}
                      dayCellDidMount={(info) => {
                        const dayInfo = getAvailabilityByDay(info.date);
                        const range = getRangeAvailability(info.date, requiredWeeks);
                        const frame = info.el.querySelector(".fc-daygrid-day-frame") as HTMLElement | null;
                        if (!frame) return;
                        frame.style.borderRadius = "10px";
                        frame.style.margin = "2px";
                        frame.style.position = "relative";
                        frame.style.overflow = "hidden";
                        frame.style.transition = "all 120ms ease";

                        const previousChip = frame.querySelector(".availability-status-chip");
                        if (previousChip) previousChip.remove();
                        const previousShade = frame.querySelector(".availability-top-shade");
                        if (previousShade) previousShade.remove();

                        if (range.status === "full") {
                          frame.style.background =
                            "linear-gradient(180deg, rgba(22,163,74,0.30) 0%, rgba(22,163,74,0.20) 100%)";
                          frame.style.border = "1px solid rgba(74, 222, 128, 0.55)";
                        } else if (range.status === "partial") {
                          frame.style.background =
                            "linear-gradient(180deg, rgba(245,158,11,0.30) 0%, rgba(245,158,11,0.20) 100%)";
                          frame.style.border = "1px solid rgba(251, 191, 36, 0.55)";
                        } else {
                          frame.style.background =
                            "linear-gradient(180deg, rgba(239,68,68,0.28) 0%, rgba(239,68,68,0.18) 100%)";
                          frame.style.border = "1px solid rgba(248, 113, 113, 0.5)";
                        }

                        if (selectedDay?.key === dayInfo.key) {
                          frame.style.outline = "2px solid rgba(255,255,255,0.85)";
                          frame.style.outlineOffset = "-2px";
                          frame.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.2)";
                        } else {
                          frame.style.outline = "none";
                          frame.style.boxShadow = "none";
                        }

                        if (range.status !== "none" && dayInfo.status !== "none") {
                          const topShade = document.createElement("div");
                          topShade.className = "availability-top-shade";
                          topShade.style.position = "absolute";
                          topShade.style.left = "0";
                          topShade.style.right = "0";
                          topShade.style.top = "0";
                          topShade.style.height = "15px";
                          topShade.style.background =
                            dayInfo.status === "full"
                              ? "rgba(22,163,74,0.32)"
                              : "rgba(245,158,11,0.32)";
                          topShade.style.pointerEvents = "none";
                          frame.appendChild(topShade);

                          const chip = document.createElement("span");
                          chip.className = "availability-status-chip";
                          chip.textContent =
                            range.status === "full" ? "Disponible" : "Parcial";
                          chip.style.position = "absolute";
                          chip.style.right = "6px";
                          chip.style.bottom = "4px";
                          chip.style.fontSize = "10px";
                          chip.style.fontWeight = "700";
                          chip.style.lineHeight = "1";
                          chip.style.padding = "2px 6px";
                          chip.style.borderRadius = "999px";
                          chip.style.color =
                            range.status === "full" ? "#dcfce7" : "#fef3c7";
                          chip.style.background =
                            range.status === "full"
                              ? "rgba(22,163,74,0.35)"
                              : "rgba(245,158,11,0.35)";
                          frame.appendChild(chip);
                        }
                      }}
                    />
                  </div>

                  <div className="flex h-full min-h-[500px] flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col gap-3">
                      <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                        Disponibilidad por color
                      </h3>
                      <div className="flex flex-col gap-2 text-xs">
                        <span className="rounded-full bg-emerald-500/25 px-2 py-1 text-emerald-100">
                          Verde: bloque completo disponible
                        </span>
                        <span className="rounded-full bg-amber-500/25 px-2 py-1 text-amber-100">
                          Naranja: bloque parcial (mañana o tarde)
                        </span>
                        <span className="rounded-full bg-rose-500/25 px-2 py-1 text-rose-100">
                          Rojo: bloque no disponible
                        </span>
                      </div>
                    </div>

                    {selectedDay && selectedDay.status !== "none" ? (
                      <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#141414] p-3">
                        <label className={`text-xs uppercase ${isDark ? "text-white/45" : "text-[#64748b]"}`}>
                          Turno disponible
                        </label>
                        <select
                          value={selectedTurno}
                          onChange={(e) => setSelectedTurno(e.target.value as "manana" | "tarde")}
                          className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-white"
                        >
                          {getRangeAvailability(selectedDay.date, requiredWeeks).availableTurnos.map((turno) => (
                            <option key={turno} value={turno}>
                              {turno === "manana" ? "Mañana" : "Tarde"}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className={`rounded-xl border border-dashed p-3 text-xs ${isDark ? "border-white/15 text-white/55" : "border-black/[0.12] text-[#64748b]"}`}>
                        Selecciona un día disponible en el calendario para elegir turno.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/85">
                  <p><strong>Solicitud:</strong> {selectedRequestLabel}</p>
                  <p><strong>Alumnos:</strong> {alumnos}</p>
                  <p><strong>Inicio:</strong> {selectedDay ? formatHumanDate(selectedDay.date) : "-"}</p>
                  <p><strong>Fin:</strong> {selectedEndDate ? formatHumanDate(selectedEndDate) : "-"}</p>
                  <p><strong>Duración:</strong> {requiredWeeks} semana(s)</p>
                  <p><strong>Turno:</strong> {selectedTurno === "manana" ? "Mañana" : "Tarde"}</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/75"
                disabled={step === 1}
              >
                Anterior
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={(step === 1 && !canGoStep2) || (step === 2 && !canSubmit)}
                  className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitReservation}
                  disabled={!canSubmit}
                  className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Confirmar reserva
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}