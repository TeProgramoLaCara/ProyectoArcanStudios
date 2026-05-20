import { apiFetch } from "@/lib/api";

export interface ApiEmpresa {
  id_empresa: number;
  nombre: string;
  e_mail?: string | null;
  contraseña?: string | null;
}

export interface ApiUsuario {
  id_usuario: number;
  nombre: string;
  email?: string | null;
  rol?: string;
  jefe_sn?: number;
  empresa?: { id_empresa: number; nombre: string } | null;
}

export function listEmpresas() {
  return apiFetch<ApiEmpresa[]>("/empresa");
}

export function createEmpresa(payload: { nombre: string; e_mail?: string }) {
  return apiFetch<ApiEmpresa>("/empresa", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmpresa(
  id: number,
  payload: { nombre?: string; e_mail?: string },
) {
  return apiFetch<ApiEmpresa>(`/empresa/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEmpresa(id: number) {
  return apiFetch<void>(`/empresa/${id}`, { method: "DELETE" });
}

export function listUsuarios() {
  return apiFetch<ApiUsuario[]>("/usuario");
}

export interface CreateUsuarioInput {
  nombre: string;
  email: string;
  password: string;
  empresa_id: number;
  jefe_sn?: number;
}
export function createUsuario(payload: CreateUsuarioInput) {
  return apiFetch<ApiUsuario>("/usuario", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteUsuario(id: number) {
  return apiFetch<void>(`/usuario/${id}`, { method: "DELETE" });
}
