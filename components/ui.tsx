import Link from "next/link";
import type { ReactNode } from "react";
import { icons } from "@/lib/types";

export function Shell({ children }: { children: ReactNode }) {
  const nav = [
    ["Home", "/"],
    ["Apps", "/apps"],
    ["Secrets", "/secrets"],
    ["Services", "/services"],
    ["Search", "/search"],
    ["Settings", "/settings"],
  ];
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5">
      <header className="mb-8 flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#dcebe8] text-xl">{icons.secret}</span>
          <div>
            <div className="text-lg font-bold">Secret Manager</div>
            <div className="text-sm text-[var(--muted)]">値を保存しない、設定リンクの図鑑</div>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 hover:border-[#2f6f73]">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mb-7">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2f6f73]">{eyebrow}</p>
      <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">{title}</h1>
      {children ? <div className="mt-3 max-w-3xl text-[var(--muted)]">{children}</div> : null}
    </section>
  );
}

export function Card({ href, icon, title, children }: { href?: string; icon: string; title: string; children?: ReactNode }) {
  const body = (
    <div className="h-full rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 transition hover:border-[#2f6f73]">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-[#eee8d8] text-lg">{icon}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="text-sm leading-6 text-[var(--muted)]">{children}</div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  const isUrl = value.startsWith("http");
  return (
    <div className="border-b border-[var(--line)] py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</div>
      {isUrl ? (
        <a className="break-all text-[#225f63] underline" href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <div className="mt-1 break-words">{value}</div>
      )}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-lg border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">{label}</div>;
}

export function SourceBadge({ source }: { source: "google-sheets" | "demo" }) {
  return <span className="rounded-full bg-[#e8e1cf] px-3 py-1 text-xs font-semibold">{source === "google-sheets" ? "Google Sheets接続中" : "デモデータ表示中"}</span>;
}
