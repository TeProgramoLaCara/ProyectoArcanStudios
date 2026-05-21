import { apiFetch } from "@/lib/api";

export async function getProfesores() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiFetch<any[]>("/profesor");
}