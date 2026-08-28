import { appendRow, getCatalogData } from "@/lib/google-sheets";

export async function GET() {
  const data = await getCatalogData();
  return Response.json({ relations: data.relations, source: data.source });
}

export async function POST(request: Request) {
  const body = await request.json();
  const row = [body.from, body.relation, body.to].map((value) => String(value ?? ""));
  const result = await appendRow("Relations", row);
  return Response.json(result, { status: result.ok ? 201 : 400 });
}
