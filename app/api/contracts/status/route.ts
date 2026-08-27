export async function GET() {
  return Response.json({
    status: "success",
    app: "secret-manager",
    storesSecretValues: false,
    databaseUsed: false,
    dataStore: "google-sheets",
    fixedSheets: ["Apps", "Secrets", "Services", "Relations", "Links"],
    apiSync: {
      github: false,
      vercel: false,
      cloudflare: false,
      google: false,
    },
  });
}
