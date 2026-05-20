import { apiFetch } from "@/lib/api";

export async function getProfesores() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const endpoints = ["/profesores", "/profesor", "/docentes", "/docente"];

  for (const endpoint of endpoints) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await apiFetch<any>(endpoint);

      if (Array.isArray(data)) return data;
      if (data && typeof data === "object" && Array.isArray((data as any).data)) {
        return (data as any).data;
      }
      if (data && typeof data === "object" && Array.isArray((data as any).items)) {
        return (data as any).items;
      }

      return [];
    } catch {
      // Probar siguiente alias sin ensuciar la consola.
    }
  }

  return [];
}