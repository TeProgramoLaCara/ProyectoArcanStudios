/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";

export type CoursesApiData = {
  cursos: any[];
  capacitaciones: any[];
  cursoCapacitacionesById: Record<string, any[]>;
};

export type CursoPayload = {
  nombre: string;
  descripcion: string;
  categoria: string;
  capacitaciones?: Array<string | number>;
};

export type CapacitacionPayload = {
  nombre: string;
  descripcion: string;
  categoria: string;
};

function normalizeArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;

  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray((value as any).items)
  ) {
    return (value as any).items;
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

function getEntityId(item: unknown, fallback: string | number) {
  if (!isRecord(item)) return fallback;

  return (
    item.id ??
    item.id_curso ??
    item.id_capacitacion ??
    item.cursoId ??
    item.capacitacionId ??
    fallback
  );
}

async function safeGetArray(endpoint: string, silent = false): Promise<any[]> {
  try {
    const data = await apiFetch<unknown>(endpoint);
    return normalizeArray(data);
  } catch (error) {
    if (!silent) {
      console.error(`Error cargando ${endpoint}:`, error);
    }

    return [];
  }
}

export async function getCoursesApiData(): Promise<CoursesApiData> {
  const [cursos, capacitaciones] = await Promise.all([
    safeGetArray("/curso"),
    safeGetArray("/capacitacion"),
  ]);

  const relationEntries = await Promise.all(
    cursos.map(async (curso, index) => {
      const id = getEntityId(curso, `curso-${index + 1}`);
      const relatedCaps = await safeGetArray(
        `/curso/${id}/capacitaciones`,
        true
      );

      return [String(id), relatedCaps] as const;
    })
  );

  return {
    cursos,
    capacitaciones,
    cursoCapacitacionesById: Object.fromEntries(relationEntries),
  };
}

// ─── Curso CRUD ──────────────────────────────────────────────────────────────

export function createCurso(payload: CursoPayload) {
  return apiFetch("/curso", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCurso(id: string | number, payload: CursoPayload) {
  return apiFetch(`/curso/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCurso(id: string | number) {
  return apiFetch(`/curso/${id}`, {
    method: "DELETE",
  });
}

// ─── Capacitacion CRUD ───────────────────────────────────────────────────────

export function createCapacitacion(payload: CapacitacionPayload) {
  return apiFetch("/capacitacion", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCapacitacion(
  id: string | number,
  payload: CapacitacionPayload
) {
  return apiFetch(`/capacitacion/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCapacitacion(id: string | number) {
  return apiFetch(`/capacitacion/${id}`, {
    method: "DELETE",
  });
}