import { SecretForm } from "@/components/record-forms";
import { Card, EmptyState, Grid, PageTitle } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function SecretsPage() {
  const data = await getCatalogData();
  return (
    <>
      <PageTitle eyebrow="Secrets" title="Secret値ではなく、名前と置き場所だけ。" />
      <SecretForm />
      {data.secrets.length ? (
        <Grid>
          {data.secrets.map((secret) => (
            <Card key={secret.id} href={`/secrets/${secret.id}`} icon={icons.secret} title={secret.name}>
              <div>{secret.description}</div>
              <div>保存場所: {secret.storage || "未設定"}</div>
            </Card>
          ))}
        </Grid>
      ) : <EmptyState label="Secretsシートにまだデータがありません。" />}
    </>
  );
}
