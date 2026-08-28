import { Card, Grid, PageTitle, SourceBadge } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function Home() {
  const data = await getCatalogData();
  const recent = [
    ...data.apps.map((item) => ({ id: item.id, name: item.name })),
    ...data.secrets.map((item) => ({ id: item.id, name: item.name })),
    ...data.services.map((item) => ({ id: item.id, name: item.name })),
  ].slice(0, 5);
  return (
    <>
      <PageTitle eyebrow="Home" title="Secretの実値を持たず、置き場所とリンクだけを整理する。">
        <div className="flex flex-wrap items-center gap-3">
          <SourceBadge source={data.source} />
          <span>Apps {data.apps.length} / Secrets {data.secrets.length} / Services {data.services.length}</span>
        </div>
      </PageTitle>
      <Grid>
        <Card href="/add" icon="＋" title="追加記録">新しいApp、Secret、Serviceを登録します。</Card>
        <Card href="/apps" icon={icons.app} title="Apps">Repository、Deployment、利用Service、利用Secretをまとめます。</Card>
        <Card href="/secrets" icon={icons.secret} title="Secrets">Secret名、説明、保存場所、所有者、関連リンクだけを扱います。</Card>
        <Card href="/services" icon={icons.service} title="Services">Vercel、Cloudflare、Google Sheetsなど設定先を整理します。</Card>
        <Card href="/search" icon="⌕" title="確認・検索">名前、Repository、URL、Serviceを横断して探します。</Card>
      </Grid>
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">最近更新</h2>
        <div className="grid gap-2">
          {recent.map((item) => (
            <div key={item.id} className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-3">
              <div className="font-semibold">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
