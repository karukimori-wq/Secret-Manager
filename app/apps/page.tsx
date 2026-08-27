import { Card, EmptyState, Grid, PageTitle } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function AppsPage() {
  const data = await getCatalogData();
  return (
    <>
      <PageTitle eyebrow="Apps" title="アプリごとのRepositoryとDeployment。" />
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
