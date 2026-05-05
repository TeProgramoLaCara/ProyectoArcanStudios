/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";

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

async function safeGet(endpoint: string): Promise<any[]> {
  try {
    const data = await apiFetch(endpoint);
    return normalizeArray(data);
  } catch (error) {
    console.error(`Error cargando ${endpoint}:`, error);
    return [];
  }
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