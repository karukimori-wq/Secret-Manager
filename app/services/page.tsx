import { ActionNote, Card, EmptyState, Grid, PageTitle } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function ServicesPage() {
  const data = await getCatalogData();
  return (
    <>
      <PageTitle eyebrow="Services" title="設定先とデプロイ先を迷わないための一覧。" />
      <ActionNote>ここは確認画面です。Serviceを追加する場合は上部メニューの「追加」を使います。編集は各Serviceの詳細画面で行います。</ActionNote>
      {data.services.length ? (
        <Grid>{data.services.map((service) => <Card key={service.id} href={`/services/${service.id}`} icon={icons.service} title={service.name}>{service.description}</Card>)}</Grid>
      ) : <EmptyState label="Servicesシートにまだデータがありません。" />}
    </>
  );
}
