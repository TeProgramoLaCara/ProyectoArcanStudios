"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import styles from "./ClassroomCalendar.module.css";
import type { CalendarEvent } from "./types";
import EventDetailCard from "./EventDetailCard";
import DayNotes, { type DayNote } from "./DayNotes";

type ClassroomCalendarProps = {
  title: string;
  aulaId: string;
  events: CalendarEvent[];
  currentDate?: Date;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
};

export default function ClassroomCalendar({
  title,
  aulaId,
  events,
  currentDate: globalCurrentDate,
  onDeleteEvent,
  onUpdateEvent,
}: ClassroomCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(globalCurrentDate ?? new Date());

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);
  const [dayNotes, setDayNotes] = useState<Record<string, DayNote>>({});
  const [openedNote, setOpenedNote] = useState<
    (DayNote & { dateKey: string }) | null
  >(null);
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
    [currentDate]
  );

  const calendarRenderKey = useMemo(() => {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const notesKey = Object.entries(dayNotes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([dateKey, note]) =>
          `${dateKey}:${note.title}:${note.color}:${note.message}`
      )
      .join("|");

    return `${monthKey}__${notesKey}`;
  }, [currentDate, dayNotes]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();

    if (api) {
      api.gotoDate(currentDate);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!globalCurrentDate) return;
    setCurrentDate(globalCurrentDate);
  }, [globalCurrentDate]);

  useEffect(() => {
    if (!editingDateKey) return;

    const selector = `[data-date="${editingDateKey}"]`;
    const cell = document.querySelector(selector);

    if (!cell) return;

    cell.classList.add("fc-day-editing-pulse");

    return () => {
      cell.classList.remove("fc-day-editing-pulse");
    };
  }, [editingDateKey]);

  const fcEvents = useMemo(() => {
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

    const splitRangeByWeeks = (startStr: string, endStr: string) => {
      const segments: Array<{ start: string; end: string }> = [];

      const start = new Date(`${startStr}T00:00:00`);
      const endExclusive = new Date(`${endStr}T00:00:00`);

      let segmentStart: Date | null = null;
      let previousDate: Date | null = null;

      for (
        const cursor = new Date(start);
        cursor < endExclusive;
        cursor.setDate(cursor.getDate() + 1)
      ) {
        const key = toLocalKey(cursor);
        const startsNewWeek = cursor.getDay() === 1;

        if (!segmentStart) {
          segmentStart = new Date(cursor);
        } else if (startsNewWeek && previousDate) {
          segments.push({
            start: toLocalKey(segmentStart),
            end: toLocalKey(addDays(previousDate, 1)),
          });

          segmentStart = new Date(cursor);
        } else if (
          previousDate &&
          toLocalKey(addDays(previousDate, 1)) !== key
        ) {
          segments.push({
            start: toLocalKey(segmentStart),
            end: toLocalKey(addDays(previousDate, 1)),
          });

          segmentStart = new Date(cursor);
        }

        previousDate = new Date(cursor);
      }

      if (segmentStart && previousDate) {
        segments.push({
          start: toLocalKey(segmentStart),
          end: toLocalKey(addDays(previousDate, 1)),
        });
      }

      return segments;
    };

    const busyEvents = events.flatMap((event) =>
      splitRangeByWeeks(event.start, event.end).map((segment, index) => ({
        id: `${event.id}-seg-${index}`,
        title: event.title,
        start: segment.start,
        end: segment.end,
        allDay: true,
        order: event.turno === "mañana" ? 0 : 1,
        backgroundColor: event.color,
        borderColor: event.color,
        textColor: "#ffffff",
        extendedProps: {
          baseId: event.id,
          originalStart: event.start,
          originalEnd: event.end,
          isAvailable: false,
          color: event.color,
          turno: event.turno,
          sortOrder: event.turno === "mañana" ? 0 : 1,
          professorId: event.professorId,
          professorName: event.professorName,
          professorColor: event.professorColor ?? event.color,
          companyId: event.companyId,
          companyName: event.companyName,
          capacitaciones: event.capacitaciones,
        },
      }))
    );

    const isWeekday = (date: Date) => {
      const day = date.getDay();
      return day >= 1 && day <= 5;
    };

    const occupied = {
      mañana: new Set<string>(),
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

    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const createAvailabilityRanges = (turno: CalendarEvent["turno"]) => {
      const ranges: Array<{ start: string; end: string }> = [];

      let rangeStart: Date | null = null;
      let previousDate: Date | null = null;

      const otherTurno: CalendarEvent["turno"] =
        turno === "mañana" ? "tarde" : "mañana";

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
          } else if (
            previousDate &&
            toLocalKey(addDays(previousDate, 1)) !== key
          ) {
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

    const availabilityEvents = (["mañana", "tarde"] as const).flatMap(
      (turno) =>
        createAvailabilityRanges(turno).map((range, index) => ({
          id: `available-${turno}-${range.start}-${index}`,
          title: "Disponible",
          start: range.start,
          end: range.end,
          allDay: true,
          order: turno === "mañana" ? 0 : 1,
          backgroundColor: availabilityColor,
          borderColor: "transparent",
          textColor: "#dcfce7",
          extendedProps: {
            isAvailable: true,
            color: availabilityColor,
            turno,
            sortOrder: turno === "mañana" ? 0 : 1,
            professorColor: "transparent",
          },
        }))
    );

    return [...busyEvents, ...availabilityEvents];
  }, [events, currentDate]);

  function handleDeleteSelectedEvent() {
    if (!selectedEvent) return;

    onDeleteEvent(selectedEvent.id);
    setSelectedEvent(null);
  }

  function handleStartEditSelectedEvent() {
    if (!selectedEvent) return;

    setEditingEvent(selectedEvent);
    setSelectedEvent(null);
  }

  function handleSaveEditedEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingEvent) return;

    onUpdateEvent(editingEvent);
    setEditingEvent(null);
  }

  return (
    <div className="flex flex-col rounded-[28px] border border-(--border) bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-(--text-primary)">
            {title}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
              className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
              aria-label={`Mes anterior en ${title}`}
            >
              ←
            </button>
            <p className="text-xs capitalize text-(--text-muted)">{monthLabel}</p>
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
              className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/80"
              aria-label={`Mes siguiente en ${title}`}
            >
              →
            </button>
          </div>
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
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
            aria-label={`Editar anotaciones de ${title}`}
            title="Anotar imprevistos por día"
          >
            ✎
          </button>
        </div>
      </div>

      <DayNotes
        aulaId={aulaId}
        isEditMode={isEditMode}
        onNotesChange={setDayNotes}
        editingDateKey={editingDateKey}
        onEditingDateChange={setEditingDateKey}
        openedNote={openedNote}
        onCloseNote={() => setOpenedNote(null)}
      />

      <div
        className={`${styles.wrapper} overflow-hidden rounded-[22px] border border-(--border) bg-background`}
        style={{ height: "700px" }}
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
          dayMaxEventRows={3}
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
            const turno = info.event.extendedProps
              .turno as CalendarEvent["turno"];

            const isAvailable = Boolean(info.event.extendedProps.isAvailable);

            const harness = info.el.closest(".fc-daygrid-event-harness");

            if (!harness) return;

            harness.classList.remove(
              "turno-mañana-slot",
              "turno-tarde-slot",
              "availability-slot"
            );

            harness.classList.add(
              turno === "mañana" ? "turno-mañana-slot" : "turno-tarde-slot"
            );

            if (isAvailable) {
              harness.classList.add("availability-slot");
            }
          }}
          eventContent={(arg) => {
            const turno = arg.event.extendedProps
              .turno as CalendarEvent["turno"];

            const turnoIcon = turno === "mañana" ? "☀" : "☾";
            const titleText = arg.event.title;
            const showLabel = arg.isStart;

            return (
              <div
                style={{
                  padding: "3px 8px",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1,
                  minHeight: "18px",
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
                  {showLabel ? turnoIcon : ""}
                </span>

                <span>{showLabel ? titleText : ""}</span>
              </div>
            );
          }}
          eventClick={(info) => {
            const ep = info.event.extendedProps;

            if (ep.isAvailable) return;

            const reconstructed: CalendarEvent = {
              id: ep.baseId as string,
              title: info.event.title,
              start: ep.originalStart as string,
              end: ep.originalEnd as string,
              aula: aulaId as CalendarEvent["aula"],
              turno: ep.turno as CalendarEvent["turno"],
              color: ep.color as string,
              professorId: ep.professorId as string,
              professorName: ep.professorName as string,
              professorColor: ep.professorColor as string,
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

            setEditingDateKey(info.dateStr);
          }}
          dayCellDidMount={(info) => {
            const y = info.date.getFullYear();
            const m = String(info.date.getMonth() + 1).padStart(2, "0");
            const d = String(info.date.getDate()).padStart(2, "0");
            const dateKey = `${y}-${m}-${d}`;

            const note = dayNotes[dateKey];

            info.el.classList.remove("has-day-note");

            const existing = info.el.querySelector(".fc-day-note-wrapper");

            if (existing) {
              existing.remove();
            }

            if (!note) return;

            info.el.classList.add("has-day-note");

            const wrapper = document.createElement("div");
            wrapper.className = "fc-day-note-wrapper";
            wrapper.title = `${note.title}: ${note.message}`;
            wrapper.addEventListener("click", (event) => {
              event.stopPropagation();
              setOpenedNote({ ...note, dateKey });
            });

            const dot = document.createElement("span");
            dot.className = "fc-day-note-dot";
            dot.style.background = note.color;

            const label = document.createElement("span");
            label.className = "fc-day-note-label";
            label.textContent = note.title;

            const preview = document.createElement("span");
            preview.className = "fc-day-note-preview";
            preview.textContent = note.message;

            wrapper.appendChild(dot);
            wrapper.appendChild(label);
            wrapper.appendChild(preview);

            const topArea = info.el.querySelector(".fc-daygrid-day-top");
            topArea?.insertAdjacentElement("afterend", wrapper);
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
              <h3 className="text-sm font-semibold text-white">
                Editar evento
              </h3>

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
                onChange={(event) =>
                  setEditingEvent((prev) =>
                    prev ? { ...prev, title: event.target.value } : prev
                  )
                }
                placeholder="Título"
                className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={editingEvent.start}
                  onChange={(event) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, start: event.target.value } : prev
                    )
                  }
                  className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                />

                <input
                  type="date"
                  value={editingEvent.end}
                  onChange={(event) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, end: event.target.value } : prev
                    )
                  }
                  className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <select
                value={editingEvent.turno}
                onChange={(event) =>
                  setEditingEvent((prev) =>
                    prev
                      ? {
                          ...prev,
                          turno: event.target
                            .value as CalendarEvent["turno"],
                        }
                      : prev
                  )
                }
                className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="mañana">Mañana</option>
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
    </div>
  );
}