import { Card, Grid, PageTitle } from "@/components/ui";
import { searchCatalog } from "@/lib/catalog";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const data = await getCatalogData();
  const results = searchCatalog(data, q);
  const iconFor = { app: icons.app, secret: icons.secret, service: icons.service };
  return (
    <>
      <PageTitle eyebrow="Search" title="Secret、App、Service、Repository、URLを横断検索。" />
      <form className="mb-5">
        <input name="q" defaultValue={q} className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3" placeholder="例: Vercel, GOOGLE, Repository URL" />
      </form>
      <Grid>{results.map((result) => <Card key={`${result.kind}-${result.id}`} href={result.href} icon={iconFor[result.kind]} title={result.title}>{result.description}</Card>)}</Grid>
    </>
  );
}
