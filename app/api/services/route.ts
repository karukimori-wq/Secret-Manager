import { appendRow, getCatalogData, updateRowById } from "@/lib/google-sheets";

export async function GET() {
  const data = await getCatalogData();
  return Response.json({ services: data.services, source: data.source });
}

export async function POST(request: Request) {
  const body = await request.json();
  const row = [body.id, body.name, body.description].map((value) => String(value ?? ""));
  const result = await appendRow("Services", row);
  return Response.json(result, { status: result.ok ? 201 : 400 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const id = String(body.id ?? "");
  const row = [id, body.name, body.description].map((value) => String(value ?? ""));
  const result = await updateRowById("Services", id, row);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
