import { apiFetch } from "@/lib/api";

export type ReservaEstado = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface ApiUsuario {
  id_usuario: number;
  nombre: string;
  email?: string;
  empresa?: { id_empresa: number; nombre: string } | null;
}

export interface ApiCurso {
  id_curso: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
}

export interface ApiSesion {
  id_sesion: number;
  fecha_ini?: string | null;
  fecha_fin?: string | null;
  turno?: string | null;
  profesor?: { id_profesor: number; nombre: string } | null;
  aula?: { id_aula: number; nombre: string } | null;
  capacitacion?: { id_capacitacion: number; nombre: string } | null;
}

export interface ApiReserva {
  id_reserva: number;
  usuario: ApiUsuario | null;
  curso: ApiCurso | null;
  n_estudiantes?: number | null;
  fecha_ini?: string | null;
  fecha_fin?: string | null;
  factura?: string | null;
  observaciones?: string | null;
  estado: ReservaEstado;
  created_at: string;
  updated_at?: string;
  sesiones?: ApiSesion[];
}

export interface CreateReservaInput {
  usuario_id?: number;
  curso_id: number;
  n_estudiantes?: number;
  fecha_ini?: string;
  fecha_fin?: string;
  factura?: string;
  observaciones?: string;
}

export type UpdateReservaInput = Partial<CreateReservaInput>;

export function listReservas() {
  return apiFetch<ApiReserva[]>("/reserva");
}

export function getReserva(id: number) {
  return apiFetch<ApiReserva>(`/reserva/${id}`);
}

export function createReserva(payload: CreateReservaInput) {
  return apiFetch<ApiReserva>("/reserva", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateReserva(id: number, payload: UpdateReservaInput) {
  return apiFetch<ApiReserva>(`/reserva/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function changeEstado(id: number, estado: ReservaEstado, motivo?: string) {
  return apiFetch<ApiReserva>(`/reserva/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado, motivo }),
  });
}

export function removeReserva(id: number) {
  return apiFetch<null>(`/reserva/${id}`, { method: "DELETE" });
}

// ─── Helpers de formato para la UI ──────────────────────────────────────────

export const ESTADO_LABEL: Record<ReservaEstado, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

export function formatFecha(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function uniqueProfesores(reserva: ApiReserva): string[] {
  const names = new Set<string>();
  reserva.sesiones?.forEach((s) => {
    if (s.profesor?.nombre) names.add(s.profesor.nombre);
  });
  return Array.from(names);
}

export function uniqueCapacitaciones(reserva: ApiReserva): string[] {
  const names = new Set<string>();
  reserva.sesiones?.forEach((s) => {
    if (s.capacitacion?.nombre) names.add(s.capacitacion.nombre);
  });
  return Array.from(names);
}
