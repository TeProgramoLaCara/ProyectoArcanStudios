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

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method,
    body,
    headers: {
      "Content-Type": request.headers.get("Content-Type") ?? "application/json",
    },
    cache: "no-store",
  });

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