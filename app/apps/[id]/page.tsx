import { DeleteLinkButton, LinkForm } from "@/components/link-form";
import { Card, EmptyState, Field, Grid, PageTitle } from "@/components/ui";
import { byId, linksFor, secretsForApp } from "@/lib/catalog";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function AppDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCatalogData();
  const app = byId(data.apps, id);
  if (!app) notFound();
  const secrets = secretsForApp(data, app.id);
  const links = linksFor(data, "app", app.id);
  return (
    <>
      <PageTitle eyebrow="App" title={`${icons.app} ${app.name}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-5">
          <Field label="Repository" value={app.repository} />
          <Field label="GitHubリンク" value={app.repository} />
          <Field label="Production URL" value={app.productionUrl} />
          <Field label="Preview URL" value={app.previewUrl} />
          <Field label="利用Service" value={app.service} />
        </section>
        <aside>
          <h2 className="mb-3 font-bold">利用Secret一覧</h2>
          {secrets.length ? (
            <div className="grid gap-3">{secrets.map((secret) => <Card key={secret.id} href={`/secrets/${secret.id}`} icon={icons.secret} title={secret.name}>{secret.storage}</Card>)}</div>
          ) : <EmptyState label="関連Secretは未登録です。" />}
        </aside>
      </div>
      <section className="mt-7">
        <h2 className="mb-3 text-xl font-bold">関連リンク</h2>
        {links.length ? <Grid>{links.map((link) => <Card key={`${link.title}-${link.url}`} icon="🔗" title={link.title}><a className="break-all underline" href={link.url} target="_blank" rel="noreferrer">{link.url}</a><DeleteLinkButton parentType="app" parentId={app.id} title={link.title} url={link.url} /></Card>)}</Grid> : <EmptyState label="関連リンクは未登録です。" />}
        <LinkForm parentType="app" parentId={app.id} />
      </section>
    </>
  );
}
