import { allEvents, capacitaciones, type Curso, type ReservaStatus } from "@/resources/data";
import {
  AULA_CAPACITY_PER_TURNO,
  type DayAvailability,
  type RangeAvailability,
  type Turno,
} from "./types";

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIso(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

export function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

export function getMinimumEndDate(startDate: Date) {
  return addDays(normalizeDate(startDate), 13);
}

export function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function formatHumanDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatMonth(date: Date) {
  return date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

export function parseReservaHumanDate(value: string): Date | null {
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
  const normalized = rangeStart.toLowerCase().replace(".", "");
  const parts = normalized.split(" ");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = months[parts[1]];
  const year = Number(parts[2]);
  if (!day || month === undefined || !year) return null;
  return new Date(year, month, day);
}

export function parseReservaDateRange(value: string): { start: Date; endInclusive: Date } | null {
  const [rawStart, rawEnd] = value.split(" - ").map((part) => part.trim());
  const start = parseReservaHumanDate(rawStart);
  if (!start) return null;
  const endInclusive = rawEnd ? parseReservaHumanDate(rawEnd) ?? start : start;
  return { start, endInclusive };
}

export function getAvailabilityByDay(date: Date): DayAvailability {
  const normalizedDate = normalizeDate(date);
  const dayOfWeek = normalizedDate.getDay();
  const key = toIsoDate(normalizedDate);

  if (isWeekend(normalizedDate)) {
    return { key, date: normalizedDate, status: "none", availableTurnos: [] };
  }

  let occupiedManana = 0;
  let occupiedTarde = 0;

  for (const event of allEvents) {
    const start = parseIso(event.start);
    const endExclusive = parseIso(event.end);
    if (normalizedDate >= start && normalizedDate < endExclusive) {
      if (event.turno === "manana") occupiedManana += 1;
      if (event.turno === "tarde") occupiedTarde += 1;
    }
  }

  const freeManana = occupiedManana < AULA_CAPACITY_PER_TURNO;
  const freeTarde = occupiedTarde < AULA_CAPACITY_PER_TURNO;

  if (freeManana && freeTarde) {
    return { key, date: normalizedDate, status: "full", availableTurnos: ["manana", "tarde"] };
  }
  if (freeManana || freeTarde) {
    return {
      key,
      date: normalizedDate,
      status: "partial",
      availableTurnos: freeManana ? ["manana"] : ["tarde"],
    };
  }
  return { key, date: normalizedDate, status: "none", availableTurnos: [] };
}

export function getRangeAvailability(startDate: Date | null, endDate: Date | null): RangeAvailability {
  if (!startDate || !endDate) {
    return { status: "none", availableTurnos: [], blockedDays: [] };
  }

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  if (end < start) return { status: "none", availableTurnos: [], blockedDays: [] };
  if (end < getMinimumEndDate(start)) return { status: "none", availableTurnos: [], blockedDays: [] };

  const blockedDays: Date[] = [];
  const availableTurnos: Turno[] = [];

  const isTurnoAvailableForWholeRange = (turno: Turno) => {
    for (let day = new Date(start); day <= end; day = addDays(day, 1)) {
      if (isWeekend(day)) continue;
      const availability = getAvailabilityByDay(day);
      if (availability.status === "none") blockedDays.push(new Date(day));
      if (!availability.availableTurnos.includes(turno)) return false;
    }
    return true;
  };

  if (isTurnoAvailableForWholeRange("manana")) availableTurnos.push("manana");
  if (isTurnoAvailableForWholeRange("tarde")) availableTurnos.push("tarde");

  if (availableTurnos.length === 2) return { status: "full", availableTurnos, blockedDays };
  if (availableTurnos.length === 1) return { status: "partial", availableTurnos, blockedDays };
  return { status: "none", availableTurnos: [], blockedDays };
}

export function getCursoCapacitaciones(curso: Curso | undefined) {
  return (
    curso?.capacitaciones.map(
      (capId) => capacitaciones.find((cap) => cap.id === capId)?.title ?? capId,
    ) ?? []
  );
}

export function getStatusClass(status: ReservaStatus, isDark: boolean) {
  if (status === "Pendiente") {
    return isDark
      ? "border-amber-300/25 bg-amber-400/10 text-amber-200"
      : "border-amber-500/25 bg-amber-50 text-amber-700";
  }
  if (status === "Confirmada") {
    return isDark
      ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
      : "border-emerald-500/25 bg-emerald-50 text-emerald-700";
  }
  if (status === "En curso") {
    return isDark
      ? "border-sky-300/25 bg-sky-400/10 text-sky-200"
      : "border-sky-500/25 bg-sky-50 text-sky-700";
  }
  return isDark
    ? "border-white/10 bg-white/5 text-white/65"
    : "border-slate-200 bg-slate-50 text-slate-600";
}
