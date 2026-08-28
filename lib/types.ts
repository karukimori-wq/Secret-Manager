export type AppRecord = {
  id: string;
  name: string;
  repository: string;
  service: string;
  productionUrl: string;
  previewUrl: string;
  description: string;
};

export type SecretRecord = {
  id: string;
  name: string;
  description: string;
  owner: string;
  storage: string;
};

export type ServiceRecord = {
  id: string;
  name: string;
  description: string;
};

export type RelationRecord = {
  from: string;
  relation: string;
  to: string;
};

export type LinkRecord = {
  parentType: "app" | "secret" | "service";
  parentId: string;
  title: string;
  url: string;
};

export type CatalogData = {
  apps: AppRecord[];
  secrets: SecretRecord[];
  services: ServiceRecord[];
  relations: RelationRecord[];
  links: LinkRecord[];
  source: "google-sheets" | "demo";
};

export type CatalogKind = "app" | "secret" | "service";

export const icons = {
  secret: "🔐",
  app: "🧩",
  service: "☁️",
  repository: "🔗",
  deployment: "🌐",
  project: "📦",
} as const;
