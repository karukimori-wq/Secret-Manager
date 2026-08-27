import { sheetStatus } from "@/lib/google-sheets";

export async function GET() {
  return Response.json(sheetStatus());
}
