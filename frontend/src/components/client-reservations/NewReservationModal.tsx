"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { EventInput } from "@fullcalendar/core";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  type CalendarEvent,
  type Capacitacion,
  type Curso,
  type Reserva,
} from "@/resources/data";
import { StepIndicator } from "./StepIndicator";
import {
  addDays,
  formatHumanDate,
  formatLongDate,
  formatMonth,
  getAvailabilityByDay,
  getCursoCapacitaciones,
  getMinimumEndDate,
  getRangeAvailability,
  normalizeDate,
  parseIso,
  toIsoDate,
} from "./reservationUtils";
import {
  CURRENT_CLIENT,
  type DatePickMode,
  type RequestType,
  type Turno,
} from "./types";

type NewReservationModalProps = {
  availableCalendarEvents: CalendarEvent[];
  availableCapacitaciones: Capacitacion[];
  availableCursos: Curso[];
  isDark: boolean;
  onClose: () => void;
  onCreateReservation: (reserva: Reserva) => void;
};

export function NewReservationModal({
  availableCalendarEvents,
  availableCapacitaciones,
  availableCursos,
  isDark,
  onClose,
  onCreateReservation,
}: NewReservationModalProps) {
  const bookingCalendarRef = useRef<FullCalendar>(null);
  const [step, setStep] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [alumnos, setAlumnos] = useState(10);
  const [requestType, setRequestType] = useState<RequestType>("curso");
  const [selectedCurso, setSelectedCurso] = useState(availableCursos[0]?.id ?? "");
  const [selectedCapOne, setSelectedCapOne] = useState(availableCapacitaciones[0]?.id ?? "");
  const [selectedCapTwo, setSelectedCapTwo] = useState(availableCapacitaciones[1]?.id ?? "");
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [datePickMode, setDatePickMode] = useState<DatePickMode>("start");
  const [selectedTurno, setSelectedTurno] = useState<Turno | "">("");

  const mutedText = isDark ? "text-white/55" : "text-slate-600";
  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#267F6B] ${
    isDark
      ? "border-white/10 bg-[#141414] text-white placeholder:text-white/30"
      : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400"
  }`;

  const selectedCourse = useMemo(
    () => availableCursos.find((curso) => curso.id === selectedCurso),
    [availableCursos, selectedCurso],
  );

  const selectedCaps = useMemo(
    () =>
      [selectedCapOne, selectedCapTwo]
        .map((id) => availableCapacitaciones.find((cap) => cap.id === id))
        .filter((cap): cap is Capacitacion => Boolean(cap)),
    [availableCapacitaciones, selectedCapOne, selectedCapTwo],
  );

  const selectedRangeAvailability = useMemo(
    () => getRangeAvailability(selectedStartDate, selectedEndDate, availableCalendarEvents),
    [availableCalendarEvents, selectedStartDate, selectedEndDate],
  );

  const selectedRequestLabel =
    requestType === "curso"
      ? selectedCourse?.title ?? "Curso existente"
      : `Curso a medida: ${selectedCaps.map((cap) => cap.title).join(" + ")}`;

  const selectedRequestCaps =
    requestType === "curso"
      ? getCursoCapacitaciones(selectedCourse, availableCapacitaciones)
      : selectedCaps.map((cap) => cap.title);

  useEffect(() => {
    if (!availableCursos.some((curso) => curso.id === selectedCurso)) {
      setSelectedCurso(availableCursos[0]?.id ?? "");
    }
  }, [availableCursos, selectedCurso]);

  useEffect(() => {
    if (!availableCapacitaciones.some((cap) => cap.id === selectedCapOne)) {
      setSelectedCapOne(availableCapacitaciones[0]?.id ?? "");
    }
    if (!availableCapacitaciones.some((cap) => cap.id === selectedCapTwo)) {
      setSelectedCapTwo(availableCapacitaciones[1]?.id ?? availableCapacitaciones[0]?.id ?? "");
    }
  }, [availableCapacitaciones, selectedCapOne, selectedCapTwo]);

  const canGoStep2 =
    alumnos > 0 &&
    (requestType === "curso"
      ? Boolean(selectedCurso)
      : Boolean(selectedCapOne) && Boolean(selectedCapTwo) && selectedCapOne !== selectedCapTwo);

  const canSubmit = Boolean(
    selectedStartDate &&
      selectedEndDate &&
      selectedTurno &&
      selectedRangeAvailability.status !== "none",
  );

  const bookingPreviewEvents = useMemo<EventInput[]>(() => {
    if (!selectedStartDate || !selectedEndDate) return [];
    return [
      {
        id: "booking-preview",
        title: selectedTurno
          ? `Reserva propuesta (${selectedTurno === "manana" ? "mañana" : "tarde"})`
          : "Fechas seleccionadas",
        start: toIsoDate(selectedStartDate),
        end: toIsoDate(addDays(selectedEndDate, 1)),
        allDay: true,
        display: "background",
        backgroundColor: "rgba(38, 127, 107, 0.28)",
        borderColor: "#2fa58a",
        textColor: "#ffffff",
      },
    ];
  }, [selectedEndDate, selectedStartDate, selectedTurno]);

  useEffect(() => {
    bookingCalendarRef.current?.getApi().gotoDate(calendarMonth);
  }, [calendarMonth]);

  useEffect(() => {
    if (selectedTurno && !selectedRangeAvailability.availableTurnos.includes(selectedTurno)) {
      setSelectedTurno("");
    }
  }, [selectedRangeAvailability.availableTurnos, selectedTurno]);

  const pickDateFromCalendar = (date: Date) => {
    const normalized = normalizeDate(date);
    const availability = getAvailabilityByDay(normalized, availableCalendarEvents);
    if (availability.status === "none") return;

    if (datePickMode === "start" || !selectedStartDate) {
      setSelectedStartDate(normalized);
      setSelectedEndDate(getMinimumEndDate(normalized));
      setDatePickMode("end");
      setSelectedTurno("");
      return;
    }

    if (normalized < selectedStartDate) {
      setSelectedStartDate(normalized);
      setSelectedEndDate(getMinimumEndDate(normalized));
    } else {
      const minimumEndDate = getMinimumEndDate(selectedStartDate);
      setSelectedEndDate(normalized < minimumEndDate ? minimumEndDate : normalized);
    }
    setDatePickMode("end");
    setSelectedTurno("");
  };

  const setStartFromInput = (value: string) => {
    if (!value) {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectedTurno("");
      return;
    }
    const date = parseIso(value);
    if (getAvailabilityByDay(date, availableCalendarEvents).status === "none") return;
    setSelectedStartDate(date);
    const minimumEndDate = getMinimumEndDate(date);
    setSelectedEndDate((current) => (!current || current < minimumEndDate ? minimumEndDate : current));
    setDatePickMode("end");
    setSelectedTurno("");
  };

  const setEndFromInput = (value: string) => {
    if (!value) {
      setSelectedEndDate(null);
      setSelectedTurno("");
      return;
    }
    const date = parseIso(value);
    if (!selectedStartDate) {
      setSelectedEndDate(date);
    } else {
      const minimumEndDate = getMinimumEndDate(selectedStartDate);
      setSelectedEndDate(date < minimumEndDate ? minimumEndDate : date);
    }
    setDatePickMode("end");
    setSelectedTurno("");
  };

  const submitReservation = () => {
    if (!selectedStartDate || !selectedEndDate || !selectedTurno || !canSubmit) return;

    onCreateReservation({
      id: `r-${Date.now()}`,
      clientName: CURRENT_CLIENT,
      company: "Sin empresa",
      companyId: "",
      curso: selectedRequestLabel,
      cursoId: selectedCourse?.id,
      alumnos,
      capacitaciones: selectedRequestCaps,
      status: "Pendiente",
      fecha: `${formatHumanDate(selectedStartDate)} - ${formatHumanDate(selectedEndDate)}`,
      requestedStart: toIsoDate(selectedStartDate),
      requestedEnd: toIsoDate(selectedEndDate),
      turno: selectedTurno,
      aula: "aula1",
      assignments: [],
      communications: [
        {
          id: `comm-${Date.now()}`,
          createdAt: new Date().toISOString(),
          author: "sistema",
          channel: "panel",
          message: "Solicitud recibida. El equipo revisará disponibilidad, aula y profesorado antes de confirmar.",
          visibleToClient: true,
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4">
      <div
        className={`flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
          isDark ? "border-white/10 bg-[#101010]" : "border-slate-200 bg-white"
        }`}
      >
        <div className={`border-b p-5 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
                Nueva reserva
              </h2>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Completa la solicitud en tres pasos. La reserva quedará pendiente hasta que Arcan Studios la confirme.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                isDark ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5">
            <StepIndicator step={step} isDark={isDark} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {step === 1 && (
            <CourseStep
              alumnos={alumnos}
              inputClass={inputClass}
              isDark={isDark}
              mutedText={mutedText}
              requestType={requestType}
              availableCapacitaciones={availableCapacitaciones}
              availableCursos={availableCursos}
              selectedCapOne={selectedCapOne}
              selectedCapTwo={selectedCapTwo}
              selectedCurso={selectedCurso}
              selectedRequestCaps={selectedRequestCaps}
              selectedRequestLabel={selectedRequestLabel}
              setAlumnos={setAlumnos}
              setRequestType={setRequestType}
              setSelectedCapOne={setSelectedCapOne}
              setSelectedCapTwo={setSelectedCapTwo}
              setSelectedCurso={setSelectedCurso}
            />
          )}

          {step === 2 && (
            <DatesStep
              bookingCalendarRef={bookingCalendarRef}
              bookingPreviewEvents={bookingPreviewEvents}
              calendarMonth={calendarMonth}
              inputClass={inputClass}
              isDark={isDark}
              mutedText={mutedText}
              onCalendarDateClick={pickDateFromCalendar}
              selectedEndDate={selectedEndDate}
              selectedRangeAvailability={selectedRangeAvailability}
              selectedStartDate={selectedStartDate}
              selectedTurno={selectedTurno}
              availableCalendarEvents={availableCalendarEvents}
              setCalendarMonth={setCalendarMonth}
              setDatePickMode={setDatePickMode}
              setEndFromInput={setEndFromInput}
              setSelectedTurno={setSelectedTurno}
              setStartFromInput={setStartFromInput}
            />
          )}

          {step === 3 && (
            <SummaryStep
              alumnos={alumnos}
              isDark={isDark}
              mutedText={mutedText}
              selectedEndDate={selectedEndDate}
              selectedRequestCaps={selectedRequestCaps}
              selectedRequestLabel={selectedRequestLabel}
              selectedStartDate={selectedStartDate}
              selectedTurno={selectedTurno}
            />
          )}
        </div>

        <div className={`flex items-center justify-between gap-3 border-t p-5 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isDark ? "border-white/10 text-white/75 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Anterior
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={(step === 1 && !canGoStep2) || (step === 2 && !canSubmit)}
              className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={submitReservation}
              disabled={!canSubmit}
              className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Confirmar reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type CourseStepProps = {
  alumnos: number;
  availableCapacitaciones: Capacitacion[];
  availableCursos: Curso[];
  inputClass: string;
  isDark: boolean;
  mutedText: string;
  requestType: RequestType;
  selectedCapOne: string;
  selectedCapTwo: string;
  selectedCurso: string;
  selectedRequestCaps: string[];
  selectedRequestLabel: string;
  setAlumnos: (value: number) => void;
  setRequestType: (value: RequestType) => void;
  setSelectedCapOne: (value: string) => void;
  setSelectedCapTwo: (value: string) => void;
  setSelectedCurso: (value: string) => void;
};

function CourseStep({
  alumnos,
  availableCapacitaciones,
  availableCursos,
  inputClass,
  isDark,
  mutedText,
  requestType,
  selectedCapOne,
  selectedCapTwo,
  selectedCurso,
  selectedRequestCaps,
  selectedRequestLabel,
  setAlumnos,
  setRequestType,
  setSelectedCapOne,
  setSelectedCapTwo,
  setSelectedCurso,
}: CourseStepProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-5">
        <div>
          <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Número de alumnos
          </label>
          <div className="mt-2 flex items-center gap-3">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${isDark ? "bg-white/[0.04] text-white/65" : "bg-slate-100 text-slate-600"}`}>
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <input
              type="number"
              min={1}
              max={200}
              value={alumnos}
              onChange={(event) => setAlumnos(Math.max(1, Number(event.target.value)))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Tipo de curso
          </p>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            <CourseTypeButton
              active={requestType === "curso"}
              description="Elige un programa completo del catálogo."
              isDark={isDark}
              mutedText={mutedText}
              onClick={() => setRequestType("curso")}
              title="Curso ya creado"
            />
            <CourseTypeButton
              active={requestType === "dos_capacitaciones"}
              description="Combina dos módulos existentes para crear una formación."
              isDark={isDark}
              mutedText={mutedText}
              onClick={() => setRequestType("dos_capacitaciones")}
              title="Curso con dos capacitaciones"
            />
          </div>
        </div>

        {requestType === "curso" ? (
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
              Selecciona el curso
            </label>
            <select
              value={selectedCurso}
              onChange={(event) => setSelectedCurso(event.target.value)}
              className={`mt-2 ${inputClass}`}
            >
              {availableCursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <TrainingSelect
              disabledId={selectedCapTwo}
              availableCapacitaciones={availableCapacitaciones}
              inputClass={inputClass}
              isDark={isDark}
              label="Primera capacitación"
              value={selectedCapOne}
              onChange={setSelectedCapOne}
            />
            <TrainingSelect
              disabledId={selectedCapOne}
              availableCapacitaciones={availableCapacitaciones}
              inputClass={inputClass}
              isDark={isDark}
              label="Segunda capacitación"
              value={selectedCapTwo}
              onChange={setSelectedCapTwo}
            />
          </div>
        )}
      </div>

      <aside className={`rounded-xl border p-4 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
          Vista previa
        </p>
        <h3 className={`mt-3 text-base font-semibold leading-snug ${isDark ? "text-white" : "text-slate-950"}`}>
          {selectedRequestLabel}
        </h3>
        <p className={`mt-2 text-sm ${mutedText}`}>{alumnos} alumnos</p>
        <div className="mt-4 grid gap-2">
          {selectedRequestCaps.map((cap) => (
            <span
              key={cap}
              className={`rounded-lg border px-3 py-2 text-sm ${
                isDark ? "border-white/10 bg-[#101010] text-white/70" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {cap}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}

type CourseTypeButtonProps = {
  active: boolean;
  description: string;
  isDark: boolean;
  mutedText: string;
  onClick: () => void;
  title: string;
};

function CourseTypeButton({ active, description, isDark, mutedText, onClick, title }: CourseTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#267F6B] bg-[#267F6B]/10"
          : isDark
            ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
            : "border-slate-200 bg-slate-50 hover:bg-white"
      }`}
    >
      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>{title}</span>
      <span className={`mt-1 block text-sm ${mutedText}`}>{description}</span>
    </button>
  );
}

type TrainingSelectProps = {
  availableCapacitaciones: Capacitacion[];
  disabledId: string;
  inputClass: string;
  isDark: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

function TrainingSelect({
  availableCapacitaciones,
  disabledId,
  inputClass,
  isDark,
  label,
  onChange,
  value,
}: TrainingSelectProps) {
  return (
    <div>
      <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
        {label}
      </label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`mt-2 ${inputClass}`}>
        {availableCapacitaciones.map((cap) => (
          <option key={cap.id} value={cap.id} disabled={cap.id === disabledId}>
            {cap.title}
          </option>
        ))}
      </select>
    </div>
  );
}

type DatesStepProps = {
  availableCalendarEvents: CalendarEvent[];
  bookingCalendarRef: RefObject<FullCalendar | null>;
  bookingPreviewEvents: EventInput[];
  calendarMonth: Date;
  inputClass: string;
  isDark: boolean;
  mutedText: string;
  onCalendarDateClick: (date: Date) => void;
  selectedEndDate: Date | null;
  selectedRangeAvailability: ReturnType<typeof getRangeAvailability>;
  selectedStartDate: Date | null;
  selectedTurno: Turno | "";
  setCalendarMonth: (value: Date) => void;
  setDatePickMode: (value: DatePickMode) => void;
  setEndFromInput: (value: string) => void;
  setSelectedTurno: (value: Turno) => void;
  setStartFromInput: (value: string) => void;
};

function DatesStep({
  availableCalendarEvents,
  bookingCalendarRef,
  bookingPreviewEvents,
  calendarMonth,
  inputClass,
  isDark,
  mutedText,
  onCalendarDateClick,
  selectedEndDate,
  selectedRangeAvailability,
  selectedStartDate,
  selectedTurno,
  setCalendarMonth,
  setDatePickMode,
  setEndFromInput,
  setSelectedTurno,
  setStartFromInput,
}: DatesStepProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
              Selecciona las fechas
            </h3>
            <p className={`mt-1 text-sm ${mutedText}`}>
              Pulsa primero el día de inicio y después el día de fin. La reserva tendrá una duración mínima de dos semanas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MonthButton
              direction="prev"
              isDark={isDark}
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
            />
            <span className={`min-w-36 text-center text-sm font-semibold capitalize ${isDark ? "text-white" : "text-slate-950"}`}>
              {formatMonth(calendarMonth)}
            </span>
            <MonthButton
              direction="next"
              isDark={isDark}
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DateInput
            inputClass={inputClass}
            isDark={isDark}
            label="Fecha de inicio"
            onFocus={() => setDatePickMode("start")}
            onChange={setStartFromInput}
            value={selectedStartDate ? toIsoDate(selectedStartDate) : ""}
          />
          <DateInput
            inputClass={inputClass}
            isDark={isDark}
            label="Fecha de fin"
            min={selectedStartDate ? toIsoDate(getMinimumEndDate(selectedStartDate)) : undefined}
            onFocus={() => setDatePickMode("end")}
            onChange={setEndFromInput}
            value={selectedEndDate ? toIsoDate(selectedEndDate) : ""}
          />
        </div>

        <div className={`booking-calendar-wrapper overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-[#111111]" : "border-slate-200 bg-white"}`}>
          <FullCalendar
            ref={bookingCalendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            initialDate={calendarMonth}
            height="500px"
            fixedWeekCount={false}
            weekends={false}
            editable={false}
            eventDisplay="block"
            displayEventTime={false}
            events={bookingPreviewEvents}
            dateClick={(info) => onCalendarDateClick(info.date)}
            dayCellClassNames={(info) => {
              const availability = getAvailabilityByDay(info.date, availableCalendarEvents);
              const iso = availability.key;
              const startIso = selectedStartDate ? toIsoDate(selectedStartDate) : "";
              const endIso = selectedEndDate ? toIsoDate(selectedEndDate) : "";
              const inRange = Boolean(startIso && endIso && iso >= startIso && iso <= endIso);
              return [
                `availability-${availability.status}`,
                inRange ? "availability-selected-range" : "",
                iso === startIso ? "availability-selected-start" : "",
                iso === endIso ? "availability-selected-end" : "",
              ].filter(Boolean);
            }}
            dayCellContent={(info) => {
              const availability = getAvailabilityByDay(info.date, availableCalendarEvents);
              const label =
                availability.status === "full"
                  ? "Libre"
                  : availability.status === "partial"
                    ? "Parcial"
                    : "No disp.";
              return (
                <div className="flex h-full min-h-[72px] flex-col justify-between p-1">
                  <span className="text-sm font-semibold">{info.dayNumberText}</span>
                  <span className="availability-label rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {label}
                  </span>
                </div>
              );
            }}
          />
        </div>

        <div className={`flex flex-wrap gap-2 text-xs ${isDark ? "text-white/60" : "text-slate-600"}`}>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-medium text-emerald-500">
            Libre: mañana y tarde
          </span>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-medium text-amber-500">
            Parcial: un turno disponible
          </span>
          <span className="rounded-full bg-rose-500/15 px-3 py-1 font-medium text-rose-500">
            No disponible
          </span>
        </div>
      </div>

      <aside className={`rounded-xl border p-4 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
          Fechas seleccionadas
        </p>
        <div className="mt-3 grid gap-3 text-sm">
          <SelectedDate label="Inicio" value={selectedStartDate} mutedText={mutedText} isDark={isDark} />
          <SelectedDate label="Fin" value={selectedEndDate} mutedText={mutedText} isDark={isDark} />
        </div>

        <div className={`mt-4 rounded-lg border p-3 text-sm ${
          selectedRangeAvailability.status === "none"
            ? isDark
              ? "border-rose-300/20 bg-rose-400/10 text-rose-200"
              : "border-rose-200 bg-rose-50 text-rose-700"
            : isDark
              ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}>
          {selectedStartDate && selectedEndDate
            ? selectedRangeAvailability.status === "none"
              ? "El rango elegido no tiene disponibilidad completa o no llega a dos semanas. Ajusta las fechas."
              : "Rango disponible. Selecciona un turno para continuar."
            : "Elige un inicio y un fin para calcular la disponibilidad."}
        </div>

        {selectedRangeAvailability.status !== "none" && (
          <div className="mt-4">
            <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
              Turno
            </label>
            <div className="mt-2 grid gap-2">
              {(["manana", "tarde"] as Turno[]).map((turno) => {
                const enabled = selectedRangeAvailability.availableTurnos.includes(turno);
                return (
                  <button
                    key={turno}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setSelectedTurno(turno)}
                    className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedTurno === turno
                        ? "border-[#267F6B] bg-[#267F6B]/15 text-[#2fa58a]"
                        : isDark
                          ? "border-white/10 bg-[#101010] text-white/75"
                          : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {turno === "manana" ? "Mañana" : "Tarde"}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

type MonthButtonProps = {
  direction: "prev" | "next";
  isDark: boolean;
  onClick: () => void;
};

function MonthButton({ direction, isDark, onClick }: MonthButtonProps) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-lg border ${
        isDark ? "border-white/10 text-white/75" : "border-slate-200 text-slate-700"
      }`}
      aria-label={direction === "prev" ? "Mes anterior" : "Mes siguiente"}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

type DateInputProps = {
  inputClass: string;
  isDark: boolean;
  label: string;
  min?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  value: string;
};

function DateInput({ inputClass, isDark, label, min, onChange, onFocus, value }: DateInputProps) {
  return (
    <div>
      <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        min={min}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 ${inputClass}`}
      />
    </div>
  );
}

type SelectedDateProps = {
  isDark: boolean;
  label: string;
  mutedText: string;
  value: Date | null;
};

function SelectedDate({ isDark, label, mutedText, value }: SelectedDateProps) {
  return (
    <div className={isDark ? "text-white/80" : "text-slate-700"}>
      <span className={mutedText}>{label}</span>
      <p className="mt-1 font-semibold">{value ? formatLongDate(value) : "Sin seleccionar"}</p>
    </div>
  );
}

type SummaryStepProps = {
  alumnos: number;
  isDark: boolean;
  mutedText: string;
  selectedEndDate: Date | null;
  selectedRequestCaps: string[];
  selectedRequestLabel: string;
  selectedStartDate: Date | null;
  selectedTurno: Turno | "";
};

function SummaryStep({
  alumnos,
  isDark,
  mutedText,
  selectedEndDate,
  selectedRequestCaps,
  selectedRequestLabel,
  selectedStartDate,
  selectedTurno,
}: SummaryStepProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className={`rounded-xl border p-5 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
          Resumen de la reserva
        </h3>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <SummaryItem isDark={isDark} label="Curso solicitado" value={selectedRequestLabel} />
          <SummaryItem isDark={isDark} label="Alumnos" value={String(alumnos)} />
          <SummaryItem
            isDark={isDark}
            label="Fechas"
            value={
              selectedStartDate && selectedEndDate
                ? `${formatHumanDate(selectedStartDate)} - ${formatHumanDate(selectedEndDate)}`
                : "-"
            }
          />
          <SummaryItem
            isDark={isDark}
            label="Turno"
            value={selectedTurno === "manana" ? "Mañana" : selectedTurno === "tarde" ? "Tarde" : "-"}
          />
        </dl>
        <div className="mt-5">
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Capacitaciones incluidas
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedRequestCaps.map((cap) => (
              <span
                key={cap}
                className={`rounded-full px-3 py-1 text-sm ${
                  isDark ? "bg-white/[0.05] text-white/70" : "bg-white text-slate-700"
                }`}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <aside className={`rounded-xl border p-4 ${isDark ? "border-[#267F6B]/30 bg-[#267F6B]/10" : "border-[#267F6B]/20 bg-emerald-50"}`}>
        <CheckCircleIcon className={`h-8 w-8 ${isDark ? "text-emerald-200" : "text-[#267F6B]"}`} />
        <h3 className={`mt-3 text-base font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
          Lista para enviar
        </h3>
        <p className={`mt-2 text-sm ${mutedText}`}>
          Al confirmar, la solicitud aparecerá como pendiente en tus reservas activas hasta que el equipo valide aula, profesor y disponibilidad final.
        </p>
      </aside>
    </div>
  );
}

type SummaryItemProps = {
  isDark: boolean;
  label: string;
  value: string;
};

function SummaryItem({ isDark, label, value }: SummaryItemProps) {
  return (
    <div>
      <dt className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
        {label}
      </dt>
      <dd className={`mt-1 text-sm font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
        {value}
      </dd>
    </div>
  );
}
