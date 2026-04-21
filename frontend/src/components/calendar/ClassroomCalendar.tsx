"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { CalendarEvent } from "@/app/admin/calendario/page";
import { PROFESSOR_COLORS } from "@/resources/data";
import EventDetailCard from "./EventDetailCard";

type ClassroomCalendarProps = {
  title: string;
  aulaId: string;
  events: CalendarEvent[];
  currentDate: Date;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
};

type DayNote = {
  title: string;
  message: string;
  color: string;
};

export default function ClassroomCalendar({
  title,
  aulaId,
  events,
  currentDate,
  onDeleteEvent,
  onUpdateEvent,
}: ClassroomCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dayNotes, setDayNotes] = useState<Record<string, DayNote>>({});
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteColor, setNoteColor] = useState("#f59e0b");
  const [openedNote, setOpenedNote] = useState<(DayNote & { dateKey: string }) | null>(
    null,
  );
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [cardPosition, setCardPosition] = useState({
    x: 0,
    y: 0,
    openUpward: false,
  });
  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      }),
    [currentDate],
  );
  const calendarRenderKey = useMemo(() => {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
    const notesKey = Object.entries(dayNotes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, note]) => `${dateKey}:${note.title}:${note.color}:${note.message}`)
      .join("|");
    return `${monthKey}__${notesKey}`;
  }, [currentDate, dayNotes]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(currentDate);
    }
  }, [currentDate]);

  const fcEvents = useMemo(
    () => {
      const toLocalKey = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      const addDays = (date: Date, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
      };

      const isWeekday = (date: Date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5;
      };

      const busyEvents = events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        order: e.turno === "manana" ? 0 : 1,
        backgroundColor: e.color,
        borderColor: e.color,
        textColor: "#ffffff",
        extendedProps: {
          isAvailable: false,
          color: e.color,
          turno: e.turno,
          sortOrder: e.turno === "manana" ? 0 : 1,
          professorId: e.professorId,
          professorName: e.professorName,
          professorColor: PROFESSOR_COLORS[e.professorId] ?? "#9ca3af",
          companyId: e.companyId,
          companyName: e.companyName,
          capacitaciones: e.capacitaciones,
        },
      }));

      const occupied = {
        manana: new Set<string>(),
        tarde: new Set<string>(),
      };

      for (const event of events) {
        const start = new Date(`${event.start}T00:00:00`);
        const endExclusive = new Date(`${event.end}T00:00:00`);
        for (
          const cursor = new Date(start);
          cursor < endExclusive;
          cursor.setDate(cursor.getDate() + 1)
        ) {
          if (!isWeekday(cursor)) continue;
          occupied[event.turno].add(toLocalKey(cursor));
        }
      }

      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const createAvailabilityRanges = (turno: CalendarEvent["turno"]) => {
        const ranges: Array<{ start: string; end: string }> = [];
        let rangeStart: Date | null = null;
        let previousDate: Date | null = null;
        const otherTurno: CalendarEvent["turno"] =
          turno === "manana" ? "tarde" : "manana";

        for (
          const cursor = new Date(monthStart);
          cursor <= monthEnd;
          cursor.setDate(cursor.getDate() + 1)
        ) {
          if (!isWeekday(cursor)) continue;
          const key = toLocalKey(cursor);
          const thisTurnoIsFree = !occupied[turno].has(key);
          const otherTurnoIsOccupied = occupied[otherTurno].has(key);
          const isPartiallyReserved = thisTurnoIsFree && otherTurnoIsOccupied;

          if (isPartiallyReserved) {
            if (!rangeStart) {
              rangeStart = new Date(cursor);
            } else if (previousDate && toLocalKey(addDays(previousDate, 1)) !== key) {
              ranges.push({
                start: toLocalKey(rangeStart),
                end: toLocalKey(addDays(previousDate, 1)),
              });
              rangeStart = new Date(cursor);
            }
            previousDate = new Date(cursor);
          } else if (rangeStart && previousDate) {
            ranges.push({
              start: toLocalKey(rangeStart),
              end: toLocalKey(addDays(previousDate, 1)),
            });
            rangeStart = null;
            previousDate = null;
          }
        }

        if (rangeStart && previousDate) {
          ranges.push({
            start: toLocalKey(rangeStart),
            end: toLocalKey(addDays(previousDate, 1)),
          });
        }

        return ranges;
      };

      const availabilityColor = "rgba(34, 197, 94, 0.33)";

      const availabilityEvents = (["manana", "tarde"] as const).flatMap((turno) =>
        createAvailabilityRanges(turno).map((range, idx) => ({
          id: `available-${turno}-${range.start}-${idx}`,
          title: "Disponible",
          start: range.start,
          end: range.end,
          allDay: true,
          order: turno === "manana" ? 0 : 1,
          backgroundColor: availabilityColor,
          borderColor: "transparent",
          textColor: "#dcfce7",
          extendedProps: {
            isAvailable: true,
            color: availabilityColor,
            turno,
            sortOrder: turno === "manana" ? 0 : 1,
            professorColor: "transparent",
          },
        })),
      );

      return [...busyEvents, ...availabilityEvents];
    },
    [events, currentDate],
  );

  const handlePrevMonth = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNextMonth = () => {
    calendarRef.current?.getApi().next();
  };

  const openDayNoteEditor = (dateKey: string) => {
    const note = dayNotes[dateKey];
    setEditingDateKey(dateKey);
    setNoteTitle(note?.title ?? "");
    setNoteMessage(note?.message ?? "");
    setNoteColor(note?.color ?? "#f59e0b");
  };

  const saveDayNote = () => {
    if (!editingDateKey) return;
    const title = noteTitle.trim();
    const message = noteMessage.trim();
    if (!title || !message) return;
    setDayNotes((prev) => ({
      ...prev,
      [editingDateKey]: {
        title,
        message,
        color: noteColor,
      },
    }));
    setEditingDateKey(null);
  };

  const deleteDayNote = () => {
    if (!editingDateKey) return;
    setDayNotes((prev) => {
      const next = { ...prev };
      delete next[editingDateKey];
      return next;
    });
    setEditingDateKey(null);
  };

  const handleDeleteSelectedEvent = () => {
    if (!selectedEvent) return;
    onDeleteEvent(selectedEvent.id);
    setSelectedEvent(null);
  };

  const handleStartEditSelectedEvent = () => {
    if (!selectedEvent) return;
    setEditingEvent(selectedEvent);
    setSelectedEvent(null);
  };

  const handleSaveEditedEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEvent) return;
    onUpdateEvent(editingEvent);
    setEditingEvent(null);
  };

  return (
    <div className="flex flex-col rounded-[28px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs capitalize text-white/50">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditMode((prev) => !prev);
              setEditingDateKey(null);
            }}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isEditMode
                ? "border-amber-300/40 bg-amber-500/20 text-amber-100"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
            aria-label={`Editar anotaciones de ${title}`}
            title="Anotar imprevistos por día"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
            aria-label={`Mes anterior en ${title}`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
            aria-label={`Mes siguiente en ${title}`}
          >
            →
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="mb-3 rounded-xl border border-amber-300/25 bg-amber-500/10 p-3 text-xs text-amber-50">
          <p className="mb-2">
            Modo edición activo. Pulsa un día del calendario para crear o editar una
            anotación.
          </p>
          {editingDateKey && (
            <div className="grid gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-100/90">
                {editingDateKey}
              </p>
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Título de la anotación"
                className="rounded-md border border-white/20 bg-black/30 px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/45 focus:border-amber-200/60"
              />
              <textarea
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                placeholder="Escribe una anotación para este día..."
                className="min-h-[72px] rounded-md border border-white/20 bg-black/30 px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/45 focus:border-amber-200/60"
              />
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-white/80" htmlFor={`${aulaId}-note-color`}>
                  Color
                </label>
                <input
                  id={`${aulaId}-note-color`}
                  type="color"
                  value={noteColor}
                  onChange={(e) => setNoteColor(e.target.value)}
                  className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                />
                <button
                  type="button"
                  onClick={saveDayNote}
                  className="rounded-md border border-emerald-300/40 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={deleteDayNote}
                  className="rounded-md border border-rose-300/40 bg-rose-500/20 px-2.5 py-1 text-[11px] font-semibold text-rose-100 transition hover:bg-rose-500/30"
                >
                  Borrar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className="calendar-modern-wrapper overflow-hidden rounded-[22px] border border-white/10 bg-[#121212]"
        style={{ height: "600px" }}
      >
        <FullCalendar
          key={calendarRenderKey}
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          initialDate={currentDate}
          height="100%"
          fixedWeekCount={false}
          dayMaxEventRows={2}
          weekends={false}
          editable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          defaultAllDay={true}
          eventDisplay="block"
          displayEventTime={false}
          events={fcEvents}
          eventOrder="order,title"
          eventOrderStrict={true}
          eventDidMount={(info) => {
            const turno = info.event.extendedProps.turno as CalendarEvent["turno"];
            const isAvailable = Boolean(info.event.extendedProps.isAvailable);
            const harness = info.el.closest(".fc-daygrid-event-harness");
            if (!harness) return;
            harness.classList.remove(
              "turno-manana-slot",
              "turno-tarde-slot",
              "availability-slot",
            );
            harness.classList.add(
              turno === "manana" ? "turno-manana-slot" : "turno-tarde-slot",
            );
            if (isAvailable) {
              harness.classList.add("availability-slot");
            }
          }}
          eventContent={(arg) => {
            const professorColor = arg.event.extendedProps.professorColor as string;
            const turno = arg.event.extendedProps.turno as CalendarEvent["turno"];
            const isAvailable = Boolean(arg.event.extendedProps.isAvailable);
            const turnoIcon = turno === "manana" ? "☀" : "☾";
            const titleText = arg.event.title;
            const showLabel = arg.isStart;
            if (!showLabel) return null;

            return (
              <div
                style={{
                  padding: "3px 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  minHeight: "22px",
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                title={titleText}
              >
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    flexShrink: 0,
                    opacity: 0.95,
                  }}
                  aria-hidden
                >
                  {turnoIcon}
                </span>
                {!isAvailable && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "9999px",
                      backgroundColor: professorColor,
                      flexShrink: 0,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.22)",
                    }}
                    aria-hidden
                  />
                )}
                <span>{titleText}</span>
              </div>
            );
          }}
          eventClick={(info) => {
            const ep = info.event.extendedProps;
            if (ep.isAvailable) return;
            const reconstructed: CalendarEvent = {
              id: info.event.id,
              title: info.event.title,
              start: info.event.startStr,
              end: info.event.endStr,
              aula: aulaId as CalendarEvent["aula"],
              turno: ep.turno as CalendarEvent["turno"],
              color: ep.color as string,
              professorId: ep.professorId as string,
              professorName: ep.professorName as string,
              companyId: ep.companyId as string,
              companyName: ep.companyName as string,
              capacitaciones: ep.capacitaciones as string[],
            };

            const rect = info.el.getBoundingClientRect();
            const cardHeight = 320;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const y =
              spaceBelow >= cardHeight || spaceBelow >= spaceAbove
                ? rect.bottom
                : rect.top;

            setCardPosition({
              x: rect.left + rect.width / 2,
              y,
              openUpward: spaceBelow < cardHeight && spaceAbove > spaceBelow,
            });
            setSelectedEvent(reconstructed);
          }}
          dateClick={(info) => {
            if (!isEditMode) return;
            openDayNoteEditor(info.dateStr);
          }}
          dayCellDidMount={(info) => {
            const y = info.date.getFullYear();
            const m = String(info.date.getMonth() + 1).padStart(2, "0");
            const d = String(info.date.getDate()).padStart(2, "0");
            const dateKey = `${y}-${m}-${d}`;
            const note = dayNotes[dateKey];

            info.el.classList.remove("has-day-note");
            const existing = info.el.querySelector(".fc-day-note-chip");
            if (existing) {
              existing.remove();
            }
            if (!note) return;

            info.el.classList.add("has-day-note");
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "fc-day-note-chip";
            chip.style.background = note.color;
            chip.textContent = note.title;
            chip.title = `${note.title}: ${note.message}`;
            chip.addEventListener("click", (ev) => {
              ev.stopPropagation();
              setOpenedNote({ ...note, dateKey });
            });
            const frame = info.el.querySelector(".fc-daygrid-day-frame");
            frame?.appendChild(chip);
          }}
        />
      </div>

      {selectedEvent && (
        <EventDetailCard
          event={selectedEvent}
          position={cardPosition}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleStartEditSelectedEvent}
          onDelete={handleDeleteSelectedEvent}
        />
      )}
      {editingEvent && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 p-4">
          <form
            onSubmit={handleSaveEditedEvent}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#121212] p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Editar evento</h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
            <div className="grid gap-2">
              <input
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev,
                  )
                }
                placeholder="Título"
                className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={editingEvent.start}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, start: e.target.value } : prev,
                    )
                  }
                  className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                />
                <input
                  type="date"
                  value={editingEvent.end}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, end: e.target.value } : prev,
                    )
                  }
                  className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <select
                value={editingEvent.turno}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev
                      ? {
                          ...prev,
                          turno: e.target.value as CalendarEvent["turno"],
                        }
                      : prev,
                  )
                }
                className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}
      {openedNote && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#121212] p-4 shadow-2xl">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/50">
                  {openedNote.dateKey}
                </p>
                <h3 className="text-sm font-semibold text-white">{openedNote.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenedNote(null)}
                className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
            <div
              className="rounded-lg p-3 text-sm text-white"
              style={{ background: openedNote.color }}
            >
              {openedNote.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}