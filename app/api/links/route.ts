import { appendRow, getCatalogData } from "@/lib/google-sheets";

export async function GET() {
  const data = await getCatalogData();
  return Response.json({ links: data.links, source: data.source });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parentType = String(body.parentType ?? "");
  if (!["app", "secret", "service"].includes(parentType)) {
    return Response.json({ ok: false, reason: "Invalid parentType." }, { status: 400 });
  }
  const row = [parentType, body.parentId, body.title, body.url].map((value) => String(value ?? ""));
  const result = await appendRow("Links", row);
  return Response.json(result, { status: result.ok ? 201 : 400 });
}
