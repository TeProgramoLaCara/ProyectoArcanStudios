/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDashboardData } from "@/services/dashboard.service";
import { getCalendarData } from "@/services/calendar.service";
import { mapCalendarApiData } from "@/components/calendar/calendar.mapper";
import type {
  Capacitacion,
  Curso,
  Empresa,
  Reserva,
  ReservaStatus,
} from "@/resources/data";

export type ClientCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  aula: "aula1" | "aula2" | "aula3";
  turno: "manana" | "tarde";
  color: string;
  professorId: string;
  professorName: string;
  companyId: string;
  companyName: string;
  capacitaciones: string[];
};

export type ClientApiData = {
  reservas: Reserva[];
  cursos: Curso[];
  capacitaciones: Capacitacion[];
  empresas: Empresa[];
  calendarEvents: ClientCalendarEvent[];
};

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

function readPath(item: unknown, path: string): unknown {
  if (!isRecord(item)) return undefined;
  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined;
    return current[key];
  }, item);
}

function pickValue(item: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = readPath(item, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function pickText(item: unknown, paths: string[], fallback = ""): string {
  const value = pickValue(item, paths);
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  return fallback;
}

function toIsoDate(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHumanDateFromIso(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeReservaStatus(value: string): ReservaStatus {
  const normalized = value.toLowerCase().trim();
  if (normalized === "pendiente") return "Pendiente";
  if (normalized === "confirmada" || normalized === "confirmado") return "Confirmada";
  if (normalized === "en curso") return "En curso";
  if (normalized === "completada" || normalized === "completado") return "Completada";
  if (normalized === "cancelada" || normalized === "cancelado") return "Cancelada";
  return "Pendiente";
}

function mapCapacitacion(item: unknown, index: number): Capacitacion {
  return {
    id: pickText(item, ["id", "id_capacitacion", "capacitacionId"], `cap-${index + 1}`),
    title: pickText(item, ["title", "titulo", "nombre"], `Capacitación ${index + 1}`),
    description: pickText(
      item,
      ["description", "descripcion", "detalle"],
      "Sin descripción disponible.",
    ),
    category: pickText(item, ["category", "categoria", "tool"], "General"),
  };
}

function mapCurso(item: unknown, index: number): Curso {
  const rawCaps = pickValue(item, [
    "capacitaciones",
    "capacitacionesIds",
    "capacitacion_ids",
    "modulos",
  ]);

  const capIds = Array.isArray(rawCaps)
    ? rawCaps.map((cap, capIndex) =>
        pickText(cap, ["id", "id_capacitacion", "capacitacionId"], `cap-${capIndex + 1}`),
      )
    : [];

  return {
    id: pickText(item, ["id", "id_curso", "cursoId"], `curso-${index + 1}`),
    title: pickText(item, ["title", "titulo", "nombre"], `Curso ${index + 1}`),
    description: pickText(
      item,
      ["description", "descripcion", "detalle"],
      "Sin descripción disponible.",
    ),
    category: pickText(item, ["category", "categoria", "tool"], "General"),
    capacitaciones: capIds,
  };
}

function mapReserva(item: unknown, index: number): Reserva {
  const startIso = toIsoDate(
    pickValue(item, ["fecha_inicio", "fechaInicio", "fecha_ini", "start", "fecha"]),
  );
  const endIso = toIsoDate(
    pickValue(item, ["fecha_fin", "fechaFin", "fecha_final", "end"]),
  );

  const fecha =
    startIso && endIso
      ? `${formatHumanDateFromIso(startIso)} - ${formatHumanDateFromIso(endIso)}`
      : startIso
        ? formatHumanDateFromIso(startIso)
        : pickText(item, ["fecha"], "Sin fecha");

  const capacitacionesRaw = pickValue(item, ["capacitaciones", "modulos"]);
  const capacitaciones = Array.isArray(capacitacionesRaw)
    ? capacitacionesRaw.map((cap, capIndex) =>
        pickText(cap, ["title", "titulo", "nombre"], `Capacitación ${capIndex + 1}`),
      )
    : [];

  return {
    id: pickText(item, ["id", "id_reserva", "reservaId"], `reserva-${index + 1}`),
    clientName: pickText(
      item,
      ["clientName", "cliente", "usuario.nombre", "usuario.name", "nombre"],
      "Cliente",
    ),
    company: pickText(
      item,
      ["company", "empresa.nombre", "empresa.name", "empresa"],
      "Sin empresa",
    ),
    curso: pickText(item, ["curso", "curso.nombre", "curso.title", "title"], "Curso"),
    capacitaciones,
    status: normalizeReservaStatus(pickText(item, ["status", "estado"], "pendiente")),
    fecha,
  };
}

function mapEmpresa(item: unknown, index: number): Empresa {
  const rawUsuarios = pickValue(item, ["usuarios", "miembros", "users"]);
  const usuarios = Array.isArray(rawUsuarios)
    ? rawUsuarios.map((user, userIndex) => ({
        id: pickText(user, ["id", "id_usuario", "usuarioId"], `user-${userIndex + 1}`),
        username: pickText(user, ["username", "usuario", "name", "nombre"], `usuario_${userIndex + 1}`),
      }))
    : [];

  return {
    id: pickText(item, ["id", "id_empresa", "empresaId"], `empresa-${index + 1}`),
    name: pickText(item, ["name", "nombre"], `Empresa ${index + 1}`),
    phone: pickText(item, ["phone", "telefono", "tel"], "No disponible"),
    usuarios,
  };
}

function mapCalendarEventsToClientShape(
  events: ReturnType<typeof mapCalendarApiData>["events"],
): ClientCalendarEvent[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    aula: event.aula,
    turno: event.turno === "mañana" ? "manana" : "tarde",
    color: event.color,
    professorId: event.professorId,
    professorName: event.professorName,
    companyId: event.companyId,
    companyName: event.companyName,
    capacitaciones: event.capacitaciones,
  }));
}

export async function getClientApiData(): Promise<ClientApiData> {
  const [dashboardData, calendarData] = await Promise.all([
    getDashboardData(),
    getCalendarData(),
  ]);

  const mappedCalendarData = mapCalendarApiData(calendarData);

  return {
    reservas: dashboardData.reservas.map(mapReserva),
    cursos: dashboardData.cursos.map(mapCurso),
    capacitaciones: dashboardData.capacitaciones.map(mapCapacitacion),
    empresas: dashboardData.empresas.map(mapEmpresa),
    calendarEvents: mapCalendarEventsToClientShape(mappedCalendarData.events),
  };
}
