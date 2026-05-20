export const AUTH_COOKIE = "arcan_token";

/** Decodifica el payload (claims) de un JWT sin verificar firma.
 *  Sólo para leer rol/sub en cliente y middleware — la verificación
 *  real la hace el backend.
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
