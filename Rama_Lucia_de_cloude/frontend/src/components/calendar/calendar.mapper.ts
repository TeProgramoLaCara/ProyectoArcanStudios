/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CalendarApiData } from "@/services/calendar.service";
import type {
  CalendarAulaId,
  CalendarCompanyOption,
  CalendarEvent,
  CalendarProfessorOption,
  CalendarTurno,
} from "./types";

const PROFESSOR_COLORS = [
  "#267F6B",
  "#2fa58a",
  "#f59e0b",
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

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

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function pickText(item: unknown, paths: string[], fallback = ""): string {
  const value = pickValue(item, paths);

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

  if (isRecord(value)) {
    const nested =
      value.nombre ??
      value.name ??
      value.titulo ??
      value.title ??
      value.email ??
      value.id ??
      value.id_usuario ??
      value.id_empresa ??
      value.id_profesor ??
      value.id_aula ??
      value.id_sesion;

    if (nested !== undefined && nested !== null) {
      return String(nested);
    }
  }

  return fallback;
}

function pickId(item: unknown, paths: string[], fallback: string): string {
  return String(pickValue(item, paths) ?? fallback);
}

function toDateKey(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }

    const date = new Date(trimmed);

    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return null;
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeTurno(raw: string): CalendarTurno {
  const value = raw.toLowerCase().trim();

  if (
    value.includes("tarde") ||
    value === "pm" ||
    value === "2" ||
    value === "evening"
  ) {
    return "tarde";
  }

  return "mañana";
}

function normalizeAulaId(raw: string): CalendarAulaId {
  const value = raw.toLowerCase().trim();

  if (value.includes("3")) return "aula3";
  if (value.includes("2")) return "aula2";

  return "aula1";
}

function getProfessorColor(professorId: string, index: number) {
  const numericPart = Number(String(professorId).replace(/\D/g, ""));

  if (Number.isFinite(numericPart) && numericPart > 0) {
    return PROFESSOR_COLORS[(numericPart - 1) % PROFESSOR_COLORS.length];
  }

  return PROFESSOR_COLORS[index % PROFESSOR_COLORS.length];
}

function mapSesionToCalendarEvent(
  sesion: unknown,
  index: number
): CalendarEvent | null {
  const start = toDateKey(
    pickValue(sesion, [
      "start",
      "fecha_inicio",
      "fechaInicio",
      "fecha_ini",
      "inicio",
      "fecha",
      "dia",
    ])
  );

  if (!start) return null;

  const end =
    toDateKey(
      pickValue(sesion, [
        "end",
        "fecha_fin",
        "fechaFin",
        "fecha_final",
        "fin",
      ])
    ) ?? addDays(start, 14);

  const professorId = pickId(
    sesion,
    [
      "professorId",
      "profesorId",
      "id_profesor",
      "profesor.id",
      "profesor.id_profesor",
      "profesores.id_profesor",
      "profesores.id",
    ],
    `profesor-${index + 1}`
  );

  const professorName = pickText(
    sesion,
    [
      "professorName",
      "profesorName",
      "profesor.nombre_completo",
      "profesor.nombre",
      "profesor.name",
      "profesores.nombre_completo",
      "profesores.nombre",
      "profesores.name",
    ],
    `Profesor ${professorId}`
  );

  const companyId = pickId(
    sesion,
    [
      "companyId",
      "empresaId",
      "id_empresa",
      "empresa.id",
      "empresa.id_empresa",
      "reserva.empresa.id_empresa",
      "reserva.empresa.id",
      "usuario.empresa.id_empresa",
      "usuario.empresa.id",
    ],
    "sin-empresa"
  );

  const companyName = pickText(
    sesion,
    [
      "companyName",
      "empresaName",
      "empresa.nombre",
      "empresa.name",
      "reserva.empresa.nombre",
      "reserva.empresa.name",
      "usuario.empresa.nombre",
      "usuario.empresa.name",
    ],
    "Sin empresa"
  );

  const aulaRaw = pickText(
    sesion,
    [
      "aula",
      "aula.nombre",
      "aula.name",
      "aula.id_aula",
      "aula.id",
      "id_aula",
      "aulaId",
    ],
    "aula1"
  );

  const cursoName = pickText(
    sesion,
    [
      "title",
      "titulo",
      "nombre",
      "curso.nombre",
      "curso.titulo",
      "curso.title",
      "cursos.nombre",
      "cursos.titulo",
      "capacitacion.nombre",
      "capacitacion.titulo",
    ],
    "Sesión programada"
  );

  const turno = normalizeTurno(
    pickText(sesion, ["turno", "franja", "horario"], "manana")
  );

  const professorColor = getProfessorColor(professorId, index);

  return {
    id: pickId(
      sesion,
      ["id", "id_sesion", "sesionId", "idSesion"],
      `sesion-${index + 1}`
    ),
    title:
      companyName && companyName !== "Sin empresa"
        ? `${cursoName} - ${companyName}`
        : cursoName,
    start,
    end,
    aula: normalizeAulaId(aulaRaw),
    turno,
    color: professorColor,
    professorId,
    professorName,
    professorColor,
    companyId,
    companyName,
    capacitaciones: [],
  };
}

function mapProfesorOption(
  profesor: unknown,
  index: number
): CalendarProfessorOption {
  const id = pickId(
    profesor,
    ["id", "id_profesor", "profesorId", "idProfesor"],
    `profesor-${index + 1}`
  );

  const name = pickText(
    profesor,
    ["nombre_completo", "name", "nombre", "email"],
    `Profesor ${index + 1}`
  );

  return {
    id,
    name,
    color: getProfessorColor(id, index),
  };
}

function mapCompanyOption(
  empresa: unknown,
  index: number
): CalendarCompanyOption {
  const id = pickId(
    empresa,
    ["id", "id_empresa", "empresaId", "idEmpresa"],
    `empresa-${index + 1}`
  );

  const name = pickText(
    empresa,
    ["name", "nombre", "razon_social", "empresa"],
    `Empresa ${index + 1}`
  );

  return {
    id,
    name,
  };
}

function mergeProfessorOptions(
  apiProfesores: CalendarProfessorOption[],
  events: CalendarEvent[]
) {
  const map = new Map<string, CalendarProfessorOption>();

  apiProfesores.forEach((prof) => {
    map.set(prof.id, prof);
  });

  events.forEach((event, index) => {
    if (!map.has(event.professorId)) {
      map.set(event.professorId, {
        id: event.professorId,
        name: event.professorName,
        color: event.professorColor ?? getProfessorColor(event.professorId, index),
      });
    }
  });

  return Array.from(map.values());
}

function mergeCompanyOptions(
  apiCompanies: CalendarCompanyOption[],
  events: CalendarEvent[]
) {
  const map = new Map<string, CalendarCompanyOption>();

  apiCompanies.forEach((company) => {
    map.set(company.id, company);
  });

  events.forEach((event) => {
    if (!map.has(event.companyId)) {
      map.set(event.companyId, {
        id: event.companyId,
        name: event.companyName,
      });
    }
  });

  return Array.from(map.values());
}

export function mapCalendarApiData(data: CalendarApiData) {
  const events = data.sesiones
    .map((sesion, index) => mapSesionToCalendarEvent(sesion, index))
    .filter(Boolean) as CalendarEvent[];

  const apiProfessors = data.profesores.map(mapProfesorOption);
  const apiCompanies = data.empresas.map(mapCompanyOption);

  const professors = mergeProfessorOptions(apiProfessors, events);
  const companies = mergeCompanyOptions(apiCompanies, events);

  return {
    events,
    professors,
    companies,
  };
}