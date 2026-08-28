import { ServiceForm } from "@/components/record-forms";
import { Card, EmptyState, Grid, PageTitle } from "@/components/ui";
import { getCatalogData } from "@/lib/google-sheets";
import { icons } from "@/lib/types";

export default async function ServicesPage() {
  const data = await getCatalogData();
  return (
    <>
      <PageTitle eyebrow="Services" title="設定先とデプロイ先を迷わないための一覧。" />
      <ServiceForm />
      {data.services.length ? (
        <Grid>{data.services.map((service) => <Card key={service.id} href={`/services/${service.id}`} icon={icons.service} title={service.name}>{service.description}</Card>)}</Grid>
      ) : <EmptyState label="Servicesシートにまだデータがありません。" />}
    </>
  );
}
