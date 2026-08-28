import { ActionNote, Card, EmptyState, Grid, PageTitle } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function AppsPage() {
  const data = await getCatalogData();
  return (
    <>
      <PageTitle eyebrow="Apps" title="アプリごとのRepositoryとDeployment。" />
      <ActionNote>ここは確認画面です。新しく追加する場合は上部メニューの「追加」を使います。編集は各Appの詳細画面で行います。</ActionNote>
      {data.apps.length ? (
        <Grid>
          {data.apps.map((app) => (
            <Card key={app.id} href={`/apps/${app.id}`} icon={icons.app} title={app.name}>
              <div>{icons.repository} {app.repository || "Repository未設定"}</div>
              <div>{icons.deployment} {app.productionUrl || "Production未設定"}</div>
              <div>{icons.service} {app.service || "Service未設定"}</div>
            </Card>
          ))}
        </Grid>
      ) : <EmptyState label="Appsシートにまだデータがありません。" />}
    </>
  );
}
