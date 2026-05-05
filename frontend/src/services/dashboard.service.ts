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

async function safeGet<T>(endpoint: string): Promise<T[]> {
  try {
    return await apiFetch<T[]>(endpoint);
  } catch (error) {
    console.error(`Error cargando ${endpoint}:`, error);
    return [];
  }
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
    safeGet("/sesion"),
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