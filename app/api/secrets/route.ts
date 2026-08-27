import { appendRow, getCatalogData } from "@/lib/google-sheets";

export async function GET() {
  const data = await getCatalogData();
  return Response.json({ secrets: data.secrets, source: data.source });
}

export async function POST(request: Request) {
  const body = await request.json();
  const row = [body.id, body.name, body.description, body.owner, body.storage].map((value) => String(value ?? ""));
  const result = await appendRow("Secrets", row);
  return Response.json(result, { status: result.ok ? 201 : 400 });
}
