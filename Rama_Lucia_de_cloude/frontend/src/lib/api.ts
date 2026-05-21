export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Si es true, no se envía Content-Type: application/json por defecto. */
  raw?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const { raw, headers, ...rest } = options ?? {};
  const finalHeaders: Record<string, string> = raw
    ? { ...(headers as Record<string, string>) }
    : {
        "Content-Type": "application/json",
        ...(headers as Record<string, string>),
      };

  const response = await fetch(`/api/backend${endpoint}`, {
    ...rest,
    headers: finalHeaders,
    credentials: "same-origin",
  });

  const text = await response.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    const message =
      (typeof parsed === "object" &&
        parsed !== null &&
        "message" in (parsed as Record<string, unknown>) &&
        ((parsed as Record<string, unknown>).message as string)) ||
      `Error ${response.status} en ${endpoint}`;
    throw new ApiError(
      Array.isArray(message) ? message.join(". ") : message,
      response.status,
      parsed,
    );
  }

  return parsed as T;
}
