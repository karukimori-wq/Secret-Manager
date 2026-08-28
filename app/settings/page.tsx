import { PageTitle } from "@/components/ui";
import { sheetStatus } from "@/lib/google-sheets";

export default function SettingsPage() {
  const status = sheetStatus();
  return (
    <>
      <PageTitle eyebrow="Settings" title="Google Sheets接続情報">
        DBは使わず、固定5シートだけをデータストアとして扱います。
      </PageTitle>
      <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-5">
        <div className="grid gap-3 text-sm">
          <div>接続状態: <strong>{status.configured ? "設定済み" : "未設定"}</strong></div>
          <div>書き込み状態: <strong>{status.writeConfigured ? "設定済み" : "未設定"}</strong></div>
          <div>GOOGLE_SHEETS_SPREADSHEET_ID: {status.spreadsheetId}</div>
          <div>GOOGLE_SHEETS_API_KEY: {status.apiKey}</div>
          <div>GOOGLE_SERVICE_ACCOUNT_EMAIL: {status.serviceAccountEmail}</div>
          <div>GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: {status.serviceAccountPrivateKey}</div>
          <div>使用シート: {status.sheets.join(", ")}</div>
        </div>
      </div>
    </>
  );
}
