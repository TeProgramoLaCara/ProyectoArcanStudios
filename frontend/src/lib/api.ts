export class ApiError extends Error {
  status: number;
  endpoint: string;
  payload?: unknown;

  constructor(status: number, endpoint: string, payload?: unknown) {
    super(`Error API ${status} en ${endpoint}`);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.payload = payload;
  }
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(`/api/backend${endpoint}`, {
      ...options,
      signal: options?.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      cache: "no-store",
    })
    .finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type") ?? "";
    let payload: unknown;
    try {
      payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      payload = undefined;
    }
    throw new ApiError(response.status, endpoint, payload);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}
