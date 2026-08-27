import { appendRow, getCatalogData } from "@/lib/google-sheets";

export async function GET() {
  const data = await getCatalogData();
  return Response.json({ apps: data.apps, source: data.source });
}

export async function POST(request: Request) {
  const body = await request.json();
  const row = [body.id, body.name, body.repository, body.service, body.productionUrl, body.previewUrl].map((value) => String(value ?? ""));
  const result = await appendRow("Apps", row);
  return Response.json(result, { status: result.ok ? 201 : 400 });
}
