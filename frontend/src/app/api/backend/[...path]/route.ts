import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!API_URL) {
    return NextResponse.json(
      { error: "API_URL no está configurada" },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const incomingUrl = new URL(request.url);

  const targetUrl = `${API_URL}/${path.join("/")}${incomingUrl.search}`;
  const debugEnabled = process.env.NODE_ENV !== "production";

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const body = hasBody ? await request.text() : undefined;

  const outgoingHeaders = new Headers();
  const incomingContentType = request.headers.get("Content-Type");
  const incomingAuthorization = request.headers.get("Authorization");
  const incomingCookie = request.headers.get("Cookie");

  if (incomingContentType) outgoingHeaders.set("Content-Type", incomingContentType);
  if (incomingAuthorization) outgoingHeaders.set("Authorization", incomingAuthorization);
  if (incomingCookie) outgoingHeaders.set("Cookie", incomingCookie);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method,
      body,
      headers: outgoingHeaders,
      cache: "no-store",
    });
  } catch (error) {
    if (debugEnabled) {
      console.error("[API_PROXY] Backend unreachable", {
        method,
        path: `/${path.join("/")}`,
        targetUrl,
        error: String(error),
      });
    }
    return NextResponse.json(
      { error: "No se pudo conectar con el backend", detail: String(error) },
      { status: 502 }
    );
  }

  if (debugEnabled && response.status >= 400) {
    console.error("[API_PROXY] Backend error response", {
      method,
      path: `/${path.join("/")}`,
      targetUrl,
      status: response.status,
      statusText: response.statusText,
    });
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  }

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;