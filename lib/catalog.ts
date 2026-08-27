import type { AppRecord, CatalogData, CatalogKind, LinkRecord, SecretRecord, ServiceRecord } from "./types";

export function byId<T extends { id: string }>(records: T[], id: string) {
  return records.find((record) => record.id === id);
}

export function linksFor(data: CatalogData, parentType: LinkRecord["parentType"], parentId: string) {
  return data.links.filter((link) => link.parentType === parentType && link.parentId === parentId);
}

export function appsForSecret(data: CatalogData, secretId: string) {
  const appIds = data.relations
    .filter((relation) => relation.from === secretId || relation.to === secretId)
    .flatMap((relation) => [relation.from, relation.to]);
  return data.apps.filter((app) => appIds.includes(app.id));
}

export function secretsForApp(data: CatalogData, appId: string) {
  const secretIds = data.relations
    .filter((relation) => relation.from === appId || relation.to === appId)
    .flatMap((relation) => [relation.from, relation.to]);
  return data.secrets.filter((secret) => secretIds.includes(secret.id));
}

export function appsForService(data: CatalogData, serviceIdOrName: string) {
  const appIds = data.relations
    .filter((relation) => relation.from === serviceIdOrName || relation.to === serviceIdOrName)
    .flatMap((relation) => [relation.from, relation.to]);
  return data.apps.filter((app) => appIds.includes(app.id) || app.service.toLowerCase() === serviceIdOrName.toLowerCase());
}

export type SearchResult = {
  kind: CatalogKind;
  id: string;
  title: string;
  description: string;
  href: string;
};

export function searchCatalog(data: CatalogData, query: string): SearchResult[] {
  const needle = query.trim().toLowerCase();
  const rows: SearchResult[] = [
    ...data.apps.map((app: AppRecord) => ({
      kind: "app" as const,
      id: app.id,
      title: app.name,
      description: [app.repository, app.productionUrl, app.previewUrl, app.service].filter(Boolean).join(" / "),
      href: `/apps/${app.id}`,
    })),
    ...data.secrets.map((secret: SecretRecord) => ({
      kind: "secret" as const,
      id: secret.id,
      title: secret.name,
      description: [secret.description, secret.owner, secret.storage].filter(Boolean).join(" / "),
      href: `/secrets/${secret.id}`,
    })),
    ...data.services.map((service: ServiceRecord) => ({
      kind: "service" as const,
      id: service.id,
      title: service.name,
      description: service.description,
      href: `/services/${service.id}`,
    })),
  ];
  if (!needle) return rows;
  return rows.filter((row) => `${row.title} ${row.description}`.toLowerCase().includes(needle));
}
