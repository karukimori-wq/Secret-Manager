import { AppForm, SecretForm, ServiceForm } from "@/components/record-forms";
import { PageTitle } from "@/components/ui";

export default function AddPage() {
  return (
    <>
      <PageTitle eyebrow="Add" title="追加記録">
        App、Secret、Serviceをここから追加します。確認は各一覧、編集は詳細画面で行います。
      </PageTitle>
      <div className="grid gap-5 lg:grid-cols-3">
        <AppForm />
        <SecretForm />
        <ServiceForm />
      </div>
    </>
  );
}
