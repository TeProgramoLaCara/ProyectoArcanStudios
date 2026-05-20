/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api";

export type CalendarApiData = {
  sesiones: any[];
  profesores: any[];
  empresas: any[];
  aulas: any[];
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

async function safeGet(
  endpoint: string
): Promise<{ ok: boolean; data: any[]; fatal: boolean }> {
  try {
    const data = await apiFetch(endpoint);
    return { ok: true, data: normalizeArray(data), fatal: false };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 500) {
      return { ok: false, data: [], fatal: true };
    }
    return { ok: false, data: [], fatal: false };
  }
}

async function safeGetFromEndpoints(endpoints: string[]): Promise<any[]> {
  for (let index = 0; index < endpoints.length; index += 1) {
    const endpoint = endpoints[index];
    const result = await safeGet(endpoint);
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

export async function getCalendarData(): Promise<CalendarApiData> {
  const [sesiones, profesores, empresas, aulas] = await Promise.all([
     safeGet("/sesion"),
    safeGet("/profesor"),
    safeGet("/empresa"),
    safeGet("/aula"),
  ]);

  return {
    sesiones,
    profesores,
    empresas,
    aulas,
  };
}