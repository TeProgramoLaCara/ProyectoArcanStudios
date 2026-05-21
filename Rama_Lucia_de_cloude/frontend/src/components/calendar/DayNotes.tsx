"use client";

import { useEffect, useRef, useState } from "react";

export type DayNote = { title: string; message: string; color: string };

export type DayNotesHandle = {
  dayNotes: Record<string, DayNote>;
  editingDateKey: string | null;
  openDayNoteEditor: (dateKey: string) => void;
  isEditMode: boolean;
};

type DayNotesProps = {
  aulaId: string;
  isEditMode: boolean;
  onNotesChange: (notes: Record<string, DayNote>) => void;
  editingDateKey: string | null;
  onEditingDateChange: (key: string | null) => void;
  openedNote: (DayNote & { dateKey: string }) | null;
  onCloseNote: () => void;
};

export default function DayNotes({
  aulaId,
  isEditMode,
  onNotesChange,
  editingDateKey,
  onEditingDateChange,
  openedNote,
  onCloseNote,
}: DayNotesProps) {
  const [dayNotes, setDayNotes] = useState<Record<string, DayNote>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(`arcan-day-notes-${aulaId}`);
      return stored ? (JSON.parse(stored) as Record<string, DayNote>) : {};
    } catch {
      return {};
    }
  });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteColor, setNoteColor] = useState("#f59e0b");

  const onNotesChangeRef = useRef(onNotesChange);
  onNotesChangeRef.current = onNotesChange;

  useEffect(() => {
    try {
      localStorage.setItem(`arcan-day-notes-${aulaId}`, JSON.stringify(dayNotes));
    } catch {
      // ignore storage errors
    }
    onNotesChangeRef.current(dayNotes);
  }, [dayNotes, aulaId]);

  // Pre-fill form fields when the editing date changes
  useEffect(() => {
    if (!editingDateKey) return;
    const note = dayNotes[editingDateKey];
    setNoteTitle(note?.title ?? "");
    setNoteMessage(note?.message ?? "");
    setNoteColor(note?.color ?? "#f59e0b");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingDateKey]);

  const saveDayNote = () => {
    if (!editingDateKey) return;
    const title = noteTitle.trim();
    const message = noteMessage.trim();
    if (!title || !message) return;
    setDayNotes((prev) => ({
      ...prev,
      [editingDateKey]: { title, message, color: noteColor },
    }));
    onEditingDateChange(null);
  };

  const deleteDayNote = () => {
    if (!editingDateKey) return;
    setDayNotes((prev) => {
      const next = { ...prev };
      delete next[editingDateKey];
      return next;
    });
    onEditingDateChange(null);
  };

  return (
    <>
      {isEditMode && (
        <div className="mb-3 rounded-xl border border-amber-300/25 bg-amber-500/10 p-3 text-xs text-black-50">
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
                <label
                  className="text-[11px] text-white/80"
                  htmlFor={`${aulaId}-note-color`}
                >
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
                onClick={onCloseNote}
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
    </>
  );
}
