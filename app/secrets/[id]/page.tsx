import { DeleteLinkButton, LinkForm } from "@/components/link-form";
import { RelationForm } from "@/components/record-forms";
import { Card, EmptyState, Field, Grid, PageTitle } from "@/components/ui";
import { appsForSecret, byId, linksFor } from "@/lib/catalog";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function SecretDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCatalogData();
  const secret = byId(data.secrets, id);
  if (!secret) notFound();
  const apps = appsForSecret(data, secret.id);
  const links = linksFor(data, "secret", secret.id);
  return (
    <>
      <PageTitle eyebrow="Secret" title={`${icons.secret} ${secret.name}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-5">
          <Field label="説明" value={secret.description} />
          <Field label="所有App" value={secret.owner} />
          <Field label="保存場所" value={secret.storage} />
        </section>
        <aside>
          <h2 className="mb-3 font-bold">利用App</h2>
          {apps.length ? <div className="grid gap-3">{apps.map((app) => <Card key={app.id} href={`/apps/${app.id}`} icon={icons.app} title={app.name}>{app.service}</Card>)}</div> : <EmptyState label="利用Appは未登録です。" />}
          <RelationForm fromId={secret.id} defaultRelation="used_by" options={data.apps.map((app) => ({ id: app.id, name: app.name }))} />
        </aside>
      </div>
      <section className="mt-7">
        <h2 className="mb-3 text-xl font-bold">関連リンク</h2>
        {links.length ? <Grid>{links.map((link) => <Card key={`${link.title}-${link.url}`} icon="🔗" title={link.title}><a className="break-all underline" href={link.url} target="_blank" rel="noreferrer">{link.url}</a><DeleteLinkButton parentType="secret" parentId={secret.id} title={link.title} url={link.url} /></Card>)}</Grid> : <EmptyState label="関連リンクは未登録です。" />}
        <LinkForm parentType="secret" parentId={secret.id} />
      </section>
    </>
  );
}
