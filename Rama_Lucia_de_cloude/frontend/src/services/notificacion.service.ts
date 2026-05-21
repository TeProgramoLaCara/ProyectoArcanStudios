import { apiFetch } from "@/lib/api";

export interface Notificacion {
  id_notificacion: number;
  destinatario_tipo: "usuario" | "profesor";
  destinatario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  ref_tipo: string | null;
  ref_id: number | null;
  leida: number;
  created_at: string;
}

export function listNotificaciones() {
  return apiFetch<Notificacion[]>("/notificacion");
}

export function getUnreadCount() {
  return apiFetch<{ count: number }>("/notificacion/unread-count");
}

export function markAsRead(id: number) {
  return apiFetch<Notificacion>(`/notificacion/${id}/leer`, {
    method: "PATCH",
  });
}

export function markAllAsRead() {
  return apiFetch<{ ok: true }>("/notificacion/leer-todas", {
    method: "PATCH",
  });
}
