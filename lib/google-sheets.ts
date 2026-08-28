import { demoData } from "./demo-data";
import type { AppRecord, CatalogData, LinkRecord, RelationRecord, SecretRecord, ServiceRecord } from "./types";
import { google } from "googleapis";

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
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

function isConfigured() {
  const { spreadsheetId, apiKey, clientEmail, privateKey } = env();
  return Boolean(spreadsheetId && (apiKey || (clientEmail && privateKey)));
}

function isWriteConfigured() {
  const { spreadsheetId, clientEmail, privateKey } = env();
  return Boolean(spreadsheetId && clientEmail && privateKey);
}

async function sheetsClient() {
  const { clientEmail, privateKey } = env();
  if (!clientEmail || !privateKey) return null;
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
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
  const client = await sheetsClient();
  if (client && spreadsheetId) {
    const response = await client.spreadsheets.values.get({ spreadsheetId, range });
    return rowsToObjects<T>(SHEET_HEADERS[sheet], response.data.values as string[][] | undefined);
  }
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
  const range = `${sheet}!A:Z`;
  const client = await sheetsClient();
  if (client && spreadsheetId) {
    await client.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    return { ok: true };
  }
  if (!spreadsheetId || !apiKey) {
    return { ok: false, reason: "Google Sheets write requires Service Account environment variables." };
  }
  const url = `${apiBase}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
  return { ok: response.ok, reason: response.ok ? undefined : await response.text() };
}

export async function updateRowById(sheet: "Apps" | "Secrets" | "Services", id: string, row: string[]) {
  const { spreadsheetId } = env();
  const client = await sheetsClient();
  if (!client || !spreadsheetId) {
    return { ok: false, reason: "Google Sheets update requires Service Account environment variables." };
  }
  const response = await client.spreadsheets.values.get({ spreadsheetId, range: `${sheet}!A:A` });
  const rows = response.data.values ?? [];
  const rowIndex = rows.findIndex((entry, index) => index > 0 && entry[0] === id);
  if (rowIndex < 1) return { ok: false, reason: `${sheet} row was not found.` };
  const endColumn = String.fromCharCode("A".charCodeAt(0) + row.length - 1);
  await client.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheet}!A${rowIndex + 1}:${endColumn}${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
  return { ok: true };
}

async function sheetIdFor(sheet: SheetName) {
  const { spreadsheetId } = env();
  const client = await sheetsClient();
  if (!client || !spreadsheetId) return null;
  const response = await client.spreadsheets.get({ spreadsheetId });
  return response.data.sheets?.find((entry) => entry.properties?.title === sheet)?.properties?.sheetId ?? null;
}

export async function deleteLink(parentType: string, parentId: string, title: string, url: string) {
  const { spreadsheetId } = env();
  const client = await sheetsClient();
  if (!client || !spreadsheetId) {
    return { ok: false, reason: "Google Sheets delete requires Service Account environment variables." };
  }
  const response = await client.spreadsheets.values.get({ spreadsheetId, range: "Links!A:D" });
  const rows = response.data.values ?? [];
  const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === parentType && row[1] === parentId && row[2] === title && row[3] === url);
  if (rowIndex < 1) return { ok: false, reason: "Link row was not found." };
  const sheetId = await sheetIdFor("Links");
  if (sheetId == null) return { ok: false, reason: "Links sheet was not found." };
  await client.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: rowIndex, endIndex: rowIndex + 1 },
        },
      }],
    },
  });
  return { ok: true };
}

export function sheetStatus() {
  return {
    configured: isConfigured(),
    writeConfigured: isWriteConfigured(),
    spreadsheetId: env().spreadsheetId ? "set" : "missing",
    apiKey: env().apiKey ? "set" : "missing",
    serviceAccountEmail: env().clientEmail ? "set" : "missing",
    serviceAccountPrivateKey: env().privateKey ? "set" : "missing",
    sheets: Object.keys(SHEET_HEADERS),
  };
}
