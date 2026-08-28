import { DeleteLinkButton, LinkForm } from "@/components/link-form";
import { Card, EmptyState, Field, Grid, PageTitle } from "@/components/ui";
import { appsForService, byId, linksFor } from "@/lib/catalog";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function ServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCatalogData();
  const service = byId(data.services, id);
  if (!service) notFound();
  const apps = appsForService(data, service.id).concat(appsForService(data, service.name)).filter((app, index, all) => all.findIndex((candidate) => candidate.id === app.id) === index);
  const links = linksFor(data, "service", service.id);
  return (
    <>
      <PageTitle eyebrow="Service" title={`${icons.service} ${service.name}`} />
      <section className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-5">
        <Field label="説明" value={service.description} />
      </section>
      <section className="mt-7">
        <h2 className="mb-3 text-xl font-bold">関連App</h2>
        {apps.length ? <Grid>{apps.map((app) => <Card key={app.id} href={`/apps/${app.id}`} icon={icons.app} title={app.name}>{app.productionUrl}</Card>)}</Grid> : <EmptyState label="関連Appは未登録です。" />}
      </section>
      <section className="mt-7">
        <h2 className="mb-3 text-xl font-bold">関連リンク</h2>
        {links.length ? <Grid>{links.map((link) => <Card key={`${link.title}-${link.url}`} icon="🔗" title={link.title}><a className="break-all underline" href={link.url} target="_blank" rel="noreferrer">{link.url}</a><DeleteLinkButton parentType="service" parentId={service.id} title={link.title} url={link.url} /></Card>)}</Grid> : <EmptyState label="関連リンクは未登録です。" />}
        <LinkForm parentType="service" parentId={service.id} />
      </section>
    </>
  );
}
