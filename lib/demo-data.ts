import type { CatalogData } from "./types";

export const demoData: CatalogData = {
  source: "demo",
  apps: [
    {
      id: "app-secret-manager",
      name: "Secret Manager",
      repository: "https://github.com/karukimori-wq/Secret-Manager",
      service: "Vercel",
      productionUrl: "https://secret-manager.example.com",
      previewUrl: "https://secret-manager-preview.example.com",
    },
    {
      id: "app-ai-platform-core",
      name: "AI Platform Core",
      repository: "https://github.com/karukimori-wq/ai-platform-core",
      service: "Cloudflare",
      productionUrl: "https://ai-platform-core.karukimori.workers.dev",
      previewUrl: "",
    },
  ],
  secrets: [
    {
      id: "secret-google-sheets",
      name: "GOOGLE_SHEETS_SPREADSHEET_ID",
      description: "Secret Manager が台帳シートを読むためのSpreadsheet ID。",
      owner: "Secret Manager",
      storage: "Vercel Environment Variables",
    },
    {
      id: "secret-apc-client",
      name: "AI_PLATFORM_CORE_CLIENT_ID",
      description: "AI Platform Core を呼び出すアプリ識別子。",
      owner: "AI Platform Core",
      storage: "Vercel or Cloudflare environment",
    },
  ],
  services: [
    { id: "service-vercel", name: "Vercel", description: "Next.jsアプリのホスティング先。" },
    { id: "service-google-sheets", name: "Google Sheets", description: "Secret Managerの固定5シート台帳。" },
    { id: "service-cloudflare", name: "Cloudflare", description: "Workers / D1 を使うアプリの運用先。" },
  ],
  relations: [
    { from: "secret-google-sheets", relation: "used_by", to: "app-secret-manager" },
    { from: "app-secret-manager", relation: "uses", to: "service-google-sheets" },
    { from: "app-secret-manager", relation: "deployed_to", to: "service-vercel" },
    { from: "app-ai-platform-core", relation: "deployed_to", to: "service-cloudflare" },
  ],
  links: [
    {
      parentType: "app",
      parentId: "app-secret-manager",
      title: "GitHub Repository",
      url: "https://github.com/karukimori-wq/Secret-Manager",
    },
    {
      parentType: "service",
      parentId: "service-vercel",
      title: "Vercel Dashboard",
      url: "https://vercel.com/dashboard",
    },
  ],
};
