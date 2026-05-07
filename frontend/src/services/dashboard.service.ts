/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";

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

async function safeGet<T>(endpoint: string): Promise<T[]> {
  try {
    const data = await apiFetch<unknown>(endpoint);
    return normalizeArray<T>(data);
  } catch (error) {
    console.error(`Error cargando ${endpoint}:`, error);
    return [];
  }
}

async function safeGetFromEndpoints<T>(endpoints: string[]): Promise<T[]> {
  for (const endpoint of endpoints) {
    const data = await safeGet<T>(endpoint);
    if (data.length > 0) return data;
  }
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
    safeGet("/reserva"),
    safeGet("/curso"),
    safeGet("/profesor"),
    safeGet("/empresa"),
    safeGet("/capacitacion"),
    safeGet("/aula"),
    safeGetFromEndpoints(["/sesiones", "/sesion"]),
    safeGet("/usuario"),
    safeGet("/perfil"),
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