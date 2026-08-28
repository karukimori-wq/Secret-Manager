"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LinkForm({ parentType, parentId }: { parentType: "app" | "secret" | "service"; parentId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("保存中...");
    const response = await fetch("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ parentType, parentId, title, url }),
    });
    setMessage(response.ok ? "リンクを追加しました。" : "Google Sheets未設定、または保存に失敗しました。");
    if (response.ok) {
      setTitle("");
      setUrl("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
      <div className="font-bold">関連リンクを追加</div>
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="タイトル" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="https://..." value={url} onChange={(event) => setUrl(event.target.value)} required />
      <button className="rounded-md bg-[#2f6f73] px-4 py-2 font-semibold text-white" type="submit">追加</button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}

export function DeleteLinkButton({ parentType, parentId, title, url }: { parentType: "app" | "secret" | "service"; parentId: string; title: string; url: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function remove() {
    setMessage("削除中...");
    const response = await fetch("/api/links", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ parentType, parentId, title, url }),
    });
    setMessage(response.ok ? "削除しました。" : "削除に失敗しました。");
    if (response.ok) router.refresh();
  }

  return (
    <div className="mt-2">
      <button type="button" onClick={remove} className="rounded-md border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
        削除
      </button>
      {message ? <span className="ml-2 text-xs text-[var(--muted)]">{message}</span> : null}
    </div>
  );
}
