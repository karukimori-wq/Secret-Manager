export async function GET() {
  return Response.json({ app: "secret-manager", version: "0.1.0", storage: "google-sheets" });
}
