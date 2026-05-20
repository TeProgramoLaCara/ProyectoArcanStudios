/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api";

export type DashboardApiData = {
  reservas: any[];
  cursos: any[];
  profesores: any[];
  empresas: any[];
  capacitaciones: any[];
  aulas: any[];
  sesiones: any[];
  usuarios: any[];
  perfiles: any[];
};

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data as T[];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray((value as any).items)
  ) {
    return (value as any).items as T[];
  }

  return [];
}

async function safeGet<T>(
  endpoint: string
): Promise<{ ok: boolean; data: T[]; fatal: boolean }> {
  try {
    const data = await apiFetch<unknown>(endpoint);
    return { ok: true, data: normalizeArray<T>(data), fatal: false };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 500) {
      return { ok: false, data: [], fatal: true };
    }
    return { ok: false, data: [], fatal: false };
  }
}

async function safeGetFromEndpoints<T>(endpoints: string[]): Promise<T[]> {
  for (let index = 0; index < endpoints.length; index += 1) {
    const endpoint = endpoints[index];
    const result = await safeGet<T>(endpoint);
    if (result.ok) return result.data;
    if (result.fatal) {
      console.warn(
        `Error 5xx en ${endpoint}. Se cancela fallback de aliases para este recurso.`
      );
      return [];
    }
  }
  console.warn(`No se pudo cargar ninguno de estos endpoints: ${endpoints.join(" | ")}`);
  return [];
}

export async function getDashboardData(): Promise<DashboardApiData> {
  const [
    reservas,
    cursos,
    profesores,
    empresas,
    capacitaciones,
    aulas,
    sesiones,
    usuarios,
    perfiles,
  ] = await Promise.all([
    safeGetFromEndpoints(["/reservas", "/reserva"]),
    safeGetFromEndpoints(["/cursos", "/curso"]),
    safeGetFromEndpoints(["/profesores", "/profesor", "/docentes", "/docente"]),
    safeGetFromEndpoints(["/empresas", "/empresa"]),
    safeGetFromEndpoints(["/capacitaciones", "/capacitacion"]),
    safeGetFromEndpoints(["/aulas", "/aula"]),
    safeGetFromEndpoints(["/sesiones", "/sesion"]),
    safeGetFromEndpoints(["/usuarios", "/usuario"]),
    safeGetFromEndpoints(["/perfiles", "/perfil"]),
  ]);

  return {
    reservas,
    cursos,
    profesores,
    empresas,
    capacitaciones,
    aulas,
    sesiones,
    usuarios,
    perfiles,
  };
}