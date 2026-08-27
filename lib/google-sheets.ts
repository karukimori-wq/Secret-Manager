import { demoData } from "./demo-data";
import type { AppRecord, CatalogData, LinkRecord, RelationRecord, SecretRecord, ServiceRecord } from "./types";

const SHEET_HEADERS = {
  Apps: ["id", "name", "repository", "service", "productionUrl", "previewUrl"],
  Secrets: ["id", "name", "description", "owner", "storage"],
  Services: ["id", "name", "description"],
  Relations: ["from", "relation", "to"],
  Links: ["parentType", "parentId", "title", "url"],
} as const;

type SheetName = keyof typeof SHEET_HEADERS;

const apiBase = "https://sheets.googleapis.com/v4/spreadsheets";

function env() {
  return {
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    apiKey: process.env.GOOGLE_SHEETS_API_KEY,
  };
}

function isConfigured() {
  const { spreadsheetId, apiKey } = env();
  return Boolean(spreadsheetId && apiKey);
}

function rowsToObjects<T extends Record<string, string>>(headers: readonly string[], values: string[][] = []) {
  return values.slice(1).filter((row) => row.some(Boolean)).map((row) => {
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = row[index] ?? "";
      return acc;
    }, {}) as T;
  });
}

async function readSheet<T extends Record<string, string>>(sheet: SheetName) {
  const { spreadsheetId, apiKey } = env();
  const range = `${sheet}!A:Z`;
  const url = `${apiBase}/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const response = await fetch(url, { next: { revalidate: 15 } });
  if (!response.ok) throw new Error(`Google Sheets read failed: ${sheet}`);
  const payload = (await response.json()) as { values?: string[][] };
  return rowsToObjects<T>(SHEET_HEADERS[sheet], payload.values);
}

export async function getCatalogData(): Promise<CatalogData> {
  if (!isConfigured()) return demoData;
  try {
    const [apps, secrets, services, relations, links] = await Promise.all([
      readSheet<AppRecord>("Apps"),
      readSheet<SecretRecord>("Secrets"),
      readSheet<ServiceRecord>("Services"),
      readSheet<RelationRecord>("Relations"),
      readSheet<LinkRecord>("Links"),
    ]);
    return { apps, secrets, services, relations, links, source: "google-sheets" };
  } catch {
    return demoData;
  }
}

export async function appendRow(sheet: SheetName, row: string[]) {
  const { spreadsheetId, apiKey } = env();
  if (!spreadsheetId || !apiKey) {
    return { ok: false, reason: "Google Sheets is not configured." };
  }
  const range = `${sheet}!A:Z`;
  const url = `${apiBase}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
  return { ok: response.ok, reason: response.ok ? undefined : await response.text() };
}

export function sheetStatus() {
  return {
    configured: isConfigured(),
    spreadsheetId: env().spreadsheetId ? "set" : "missing",
    apiKey: env().apiKey ? "set" : "missing",
    sheets: Object.keys(SHEET_HEADERS),
  };
}
