import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
const normalizedApiUrl = API_URL?.replace(/\/+$/, "");

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!normalizedApiUrl) {
    return NextResponse.json(
      { error: "API_URL no está configurada" },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${normalizedApiUrl}/${path.join("/")}${incomingUrl.search}`;

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method,
      body,
      headers: {
        "Content-Type": request.headers.get("Content-Type") ?? "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";

    console.error(`Error conectando con backend ${targetUrl}: ${message}`);

    return NextResponse.json(
      {
        error: "No se pudo conectar con el backend.",
        detail: message,
      },
      { status: 502 }
    );
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
