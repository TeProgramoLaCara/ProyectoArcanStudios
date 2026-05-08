/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CoursesApiData } from "@/services/course.service";
import type { Capacitacion, CourseId, Curso } from "./types";

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
      value.descripcion ??
      value.description ??
      value.id ??
      value.id_curso ??
      value.id_capacitacion;

    if (nested !== undefined && nested !== null) {
      return String(nested);
    }
  }

  return fallback;
}

function pickId(
  item: unknown,
  paths: string[],
  fallback: CourseId
): CourseId {
  const value = pickValue(item, paths);

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return fallback;
}

function normalizeCategory(raw: string, fallbackSource = "") {
  const value = `${raw} ${fallbackSource}`.toLowerCase();

  if (value.includes("blender")) return "Blender";
  if (value.includes("unity")) return "Unity";

  return raw || "General";
}

function getCapacitacionId(item: unknown, fallback: CourseId): CourseId {
  return pickId(
    item,
    [
      "id",
      "id_capacitacion",
      "capacitacionId",
      "idCapacitacion",
      "capacitacion.id",
      "capacitacion.id_capacitacion",
    ],
    fallback
  );
}

function mapCapacitacion(cap: unknown, index: number): Capacitacion {
  const title = pickText(
    cap,
    ["title", "titulo", "nombre", "name"],
    `Capacitación ${index + 1}`
  );

  const categoryRaw = pickText(
    cap,
    ["category", "categoria", "tipo", "area"],
    ""
  );

  return {
    id: getCapacitacionId(cap, `cap-${index + 1}`),
    title,
    description: pickText(
      cap,
      ["description", "descripcion", "desc", "contenido"],
      "Sin descripción disponible."
    ),
    category: normalizeCategory(categoryRaw, title),
    raw: cap,
  };
}

function extractCapacitacionIds(value: unknown): CourseId[] {
  if (!value) return [];

  const source = Array.isArray(value) ? value : [value];

  return source
    .map((item, index) => {
      if (typeof item === "string" || typeof item === "number") return item;

      if (isRecord(item)) {
        return getCapacitacionId(item, `cap-rel-${index + 1}`);
      }

      return null;
    })
    .filter((id): id is CourseId => id !== null);
}

function mapCurso(
  curso: unknown,
  index: number,
  cursoCapacitacionesById: Record<string, any[]>
): Curso {
  const id = pickId(
    curso,
    ["id", "id_curso", "cursoId", "idCurso"],
    `curso-${index + 1}`
  );

  const title = pickText(
    curso,
    ["title", "titulo", "nombre", "name"],
    `Curso ${index + 1}`
  );

  const ownCaps =
    pickValue(curso, [
      "capacitaciones",
      "capacitacion",
      "modulos",
      "modules",
    ]) ?? [];

  const relationCaps = cursoCapacitacionesById[String(id)] ?? [];

  const capIdsFromCourse = extractCapacitacionIds(ownCaps);
  const capIdsFromRelation = extractCapacitacionIds(relationCaps);

  const capIds =
    capIdsFromCourse.length > 0 ? capIdsFromCourse : capIdsFromRelation;

  const categoryRaw = pickText(
    curso,
    ["category", "categoria", "tipo", "area"],
    ""
  );

  return {
    id,
    title,
    description: pickText(
      curso,
      ["description", "descripcion", "desc", "contenido"],
      "Sin descripción disponible."
    ),
    category: normalizeCategory(categoryRaw, title),
    capacitaciones: capIds,
    raw: curso,
  };
}

export function mapCoursesApiData(data: CoursesApiData) {
  const capacitaciones = data.capacitaciones.map(mapCapacitacion);

  const cursos = data.cursos.map((curso, index) =>
    mapCurso(curso, index, data.cursoCapacitacionesById)
  );

  return {
    cursos,
    capacitaciones,
  };
}