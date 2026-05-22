import {
  type Reserva,
  type ReservationAssignment,
  type ReservationCommunication,
} from "@/resources/data";
import type { CalendarEvent } from "@/resources/calendarData";
import { AULA_META } from "@/resources/calendarData";
import type {
  CalendarEvent as GlobalCalendarEvent,
  CalendarCompanyOption,
  CalendarProfessorOption,
} from "@/components/calendar/types";

const STORAGE_KEY = "arcan.reservation-workflow.v1";
export const RESERVATION_WORKFLOW_EVENT = "arcan:reservation-workflow-updated";

type AssignmentDraft = Omit<ReservationAssignment, "id" | "professorName" | "professorColor">;

type ProfessorOption = {
  id: string;
  name: string;
  color: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseHumanDate(value: string): string | undefined {
  const monthMap: Record<string, number> = {
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
  const match = value.toLowerCase().match(/(\d{1,2})\s+([a-záéíóúñ]{3,})\s+(\d{4})/i);
  if (!match) return undefined;
  const day = Number(match[1]);
  const monthKey = normalizeText(match[2]).slice(0, 3);
  const month = monthMap[monthKey];
  const year = Number(match[3]);
  if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) return undefined;
  return toIsoDate(new Date(year, month, day));
}

function enrichReservation(reserva: Reserva): Reserva {
  const start = reserva.requestedStart ?? parseHumanDate(reserva.fecha) ?? "2026-05-04";
  const end = reserva.requestedEnd ?? (reserva.fecha.includes("-") ? parseHumanDate(reserva.fecha.split("-").at(-1) ?? "") : undefined) ?? addDays(start, 14);

  return {
    ...reserva,
    companyId: reserva.companyId ?? "",
    cursoId: reserva.cursoId ?? "",
    alumnos: reserva.alumnos ?? 12,
    requestedStart: start,
    requestedEnd: end,
    turno: reserva.turno ?? "manana",
    aula: reserva.aula ?? "aula1",
    assignments: reserva.assignments ?? [],
    communications: reserva.communications ?? [],
  };
}

function seedReservations() {
  return [];
}

function emitWorkflowUpdate() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(RESERVATION_WORKFLOW_EVENT));
}

export function getWorkflowReservations(): Reserva[] {
  if (!isBrowser()) return seedReservations();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedReservations();
    saveWorkflowReservations(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as Reserva[];
    return parsed.map(enrichReservation);
  } catch {
    const seeded = seedReservations();
    saveWorkflowReservations(seeded);
    return seeded;
  }
}

export function saveWorkflowReservations(reservas: Reserva[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
  emitWorkflowUpdate();
}

export function createWorkflowReservation(reserva: Reserva) {
  const reservas = getWorkflowReservations();
  const enriched = enrichReservation(reserva);
  saveWorkflowReservations([enriched, ...reservas.filter((item) => item.id !== reserva.id)]);
  return enriched;
}

function getKnownProfessors(): ProfessorOption[] {
  const map = new Map<string, ProfessorOption>();
  for (const reserva of getWorkflowReservations()) {
    for (const assignment of reserva.assignments ?? []) {
      if (!map.has(assignment.professorId)) {
        map.set(assignment.professorId, {
          id: assignment.professorId,
          name: assignment.professorName,
          color: assignment.professorColor,
        });
      }
    }
  }
  return Array.from(map.values());
}

export function getCapacitacionIdFromTitle(title: string) {
  const normalized = normalizeText(title);
  return normalized || undefined;
}

export function getProfessorCandidates(_capacitacionTitleOrId: string): ProfessorOption[] {
  return getKnownProfessors();
}

export function buildDefaultAssignments(reserva: Reserva): ReservationAssignment[] {
  const enriched = enrichReservation(reserva);
  const start = enriched.requestedStart ?? "2026-05-04";
  const end = enriched.requestedEnd ?? addDays(start, 14);
  const turno = enriched.turno ?? "manana";
  const aula = enriched.aula ?? "aula1";
  const knownProfessors = getKnownProfessors();
  const fallbackProfessor = knownProfessors[0] ?? {
    id: "sin-asignar",
    name: "Sin asignar",
    color: "#9ca3af",
  };

  return enriched.capacitaciones.map((capTitle, index) => {
    const capId = getCapacitacionIdFromTitle(capTitle);
    const candidates = getProfessorCandidates(capId ?? capTitle);
    const professor =
      candidates.length === 1
        ? candidates[0]
        : candidates[index % Math.max(1, candidates.length)] ?? fallbackProfessor;

    return {
      id: `${enriched.id}-assignment-${index}`,
      capacitacionId: capId,
      capacitacionTitle: capTitle,
      professorId: professor.id,
      professorName: professor.name,
      professorColor: professor.color,
      start,
      end,
      turno,
      aula,
    };
  });
}

export function approveWorkflowReservation(
  reservationId: string,
  drafts: AssignmentDraft[],
  message: string,
) {
  const reservas = getWorkflowReservations();
  const now = new Date().toISOString();
  const knownProfessors = getKnownProfessors();

  const updated = reservas.map((reserva) => {
    if (reserva.id !== reservationId) return reserva;

    const assignments = drafts.map((draft, index) => {
      const professor = knownProfessors.find((item) => item.id === draft.professorId) ?? {
        id: draft.professorId,
        name: draft.professorId || "Sin asignar",
        color: "#9ca3af",
      };
      return {
        ...draft,
        id: `${reservationId}-assignment-${index}`,
        professorName: professor.name,
        professorColor: professor.color,
      };
    });

    const communication: ReservationCommunication = {
      id: `${reservationId}-comm-${Date.now()}`,
      createdAt: now,
      author: "admin",
      channel: "email",
      message,
      visibleToClient: true,
    };

    return {
      ...reserva,
      status: "Confirmada" as const,
      assignments,
      communications: [communication, ...(reserva.communications ?? [])],
      confirmedAt: now,
      fecha: `${assignments[0]?.start ?? reserva.requestedStart} - ${assignments[0]?.end ?? reserva.requestedEnd}`,
    };
  });

  saveWorkflowReservations(updated);
  return updated.find((reserva) => reserva.id === reservationId);
}

export function addWorkflowCommunication(
  reservationId: string,
  message: string,
  channel: ReservationCommunication["channel"] = "email",
  visibleToClient = true,
) {
  const reservas = getWorkflowReservations();
  const communication: ReservationCommunication = {
    id: `${reservationId}-comm-${Date.now()}`,
    createdAt: new Date().toISOString(),
    author: "admin",
    channel,
    message,
    visibleToClient,
  };

  const updated = reservas.map((reserva) =>
    reserva.id === reservationId
      ? { ...reserva, communications: [communication, ...(reserva.communications ?? [])] }
      : reserva,
  );

  saveWorkflowReservations(updated);
}

export function getWorkflowProfessorEvents(professorId: string): CalendarEvent[] {
  return getWorkflowReservations()
    .filter((reserva) => reserva.status === "Confirmada" || reserva.status === "En curso")
    .flatMap((reserva) =>
      (reserva.assignments ?? []).filter((assignment) => assignment.professorId === professorId).map((assignment) => ({
        id: assignment.id,
        title: `${assignment.capacitacionTitle} - ${reserva.company}`,
        empresa: reserva.company,
        empresaId: reserva.companyId ?? "e1",
        profesor: assignment.professorName,
        profesorId: assignment.professorId,
        start: assignment.start,
        end: addDays(assignment.end, 1),
        aula: assignment.aula,
        turno: assignment.turno === "manana" ? "mañana" : "tarde",
        tool: capacitaciones.find((cap) => cap.id === assignment.capacitacionId)?.category ?? "Blender",
        color: AULA_META[assignment.aula].color,
      })),
    );
}

export function getWorkflowGlobalCalendar() {
  const reservations = getWorkflowReservations();
  const events: GlobalCalendarEvent[] = reservations
    .filter((reserva) => reserva.status === "Confirmada" || reserva.status === "En curso")
    .flatMap((reserva) =>
      (reserva.assignments ?? []).map((assignment) => ({
        id: assignment.id,
        title: `${assignment.capacitacionTitle} - ${reserva.company}`,
        start: assignment.start,
        end: addDays(assignment.end, 1),
        aula: assignment.aula,
        turno: assignment.turno === "manana" ? "mañana" : "tarde",
        color: assignment.professorColor,
        professorId: assignment.professorId,
        professorName: assignment.professorName,
        professorColor: assignment.professorColor,
        companyId: reserva.companyId ?? "e1",
        companyName: reserva.company,
        capacitaciones: [assignment.capacitacionTitle],
      })),
    );

  const professors: CalendarProfessorOption[] = profesoresCatalogo.map((professor) => ({
    id: professor.id,
    name: professor.name,
    color: professor.color,
  }));

  const companies: CalendarCompanyOption[] = empresas.map((company) => ({
    id: company.id,
    name: company.name,
  }));

  return { events, professors, companies };
}
