"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function slugify(value: string, prefix: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${prefix}-${slug || Date.now()}`;
}

function useSubmit(endpoint: string) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(payload: Record<string, string>, reset: () => void) {
    setMessage("保存中...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMessage(response.ok ? "追加しました。" : "Google Sheets未設定、または保存に失敗しました。");
    if (response.ok) {
      reset();
      router.refresh();
    }
  }
  return { message, submit };
}

export function AppForm() {
  const [name, setName] = useState("");
  const [repository, setRepository] = useState("");
  const [service, setService] = useState("");
  const [productionUrl, setProductionUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { message, submit } = useSubmit("/api/apps");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit({ id: slugify(name, "app"), name, repository, service, productionUrl, previewUrl }, () => {
          setName("");
          setRepository("");
          setService("");
          setProductionUrl("");
          setPreviewUrl("");
        });
      }}
      className="mb-6 grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4"
    >
      <div className="font-bold">Appを追加</div>
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="名前" value={name} onChange={(event) => setName(event.target.value)} required />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="Repository URL" value={repository} onChange={(event) => setRepository(event.target.value)} />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="Service 例: Vercel" value={service} onChange={(event) => setService(event.target.value)} />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="Production URL" value={productionUrl} onChange={(event) => setProductionUrl(event.target.value)} />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="Preview URL" value={previewUrl} onChange={(event) => setPreviewUrl(event.target.value)} />
      <button className="rounded-md bg-[#2f6f73] px-4 py-2 font-semibold text-white" type="submit">追加</button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}

export function SecretForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [storage, setStorage] = useState("");
  const { message, submit } = useSubmit("/api/secrets");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit({ id: slugify(name, "secret"), name, description, owner, storage }, () => {
          setName("");
          setDescription("");
          setOwner("");
          setStorage("");
        });
      }}
      className="mb-6 grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4"
    >
      <div className="font-bold">Secretを追加</div>
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="名前" value={name} onChange={(event) => setName(event.target.value)} required />
      <textarea className="min-h-20 rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="説明・用途。実値は入力しない。" value={description} onChange={(event) => setDescription(event.target.value)} />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="所有者 / 所有App" value={owner} onChange={(event) => setOwner(event.target.value)} />
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="保存場所 例: Vercel Environment Variables" value={storage} onChange={(event) => setStorage(event.target.value)} />
      <button className="rounded-md bg-[#2f6f73] px-4 py-2 font-semibold text-white" type="submit">追加</button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}

export function ServiceForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { message, submit } = useSubmit("/api/services");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit({ id: slugify(name, "service"), name, description }, () => {
          setName("");
          setDescription("");
        });
      }}
      className="mb-6 grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4"
    >
      <div className="font-bold">Serviceを追加</div>
      <input className="rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="名前" value={name} onChange={(event) => setName(event.target.value)} required />
      <textarea className="min-h-20 rounded-md border border-[var(--line)] bg-white px-3 py-2" placeholder="説明" value={description} onChange={(event) => setDescription(event.target.value)} />
      <button className="rounded-md bg-[#2f6f73] px-4 py-2 font-semibold text-white" type="submit">追加</button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}

export function RelationForm({ fromId, defaultRelation, options }: { fromId: string; defaultRelation: string; options: { id: string; name: string }[] }) {
  const [relation, setRelation] = useState(defaultRelation);
  const [to, setTo] = useState(options[0]?.id ?? "");
  const { message, submit } = useSubmit("/api/relations");

  if (!options.length) return null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit({ from: fromId, relation, to }, () => {
          setRelation(defaultRelation);
          setTo(options[0]?.id ?? "");
        });
      }}
      className="mt-4 grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4"
    >
      <div className="font-bold">関係を追加</div>
      <select className="rounded-md border border-[var(--line)] bg-white px-3 py-2" value={relation} onChange={(event) => setRelation(event.target.value)}>
        <option value="uses">uses</option>
        <option value="used_by">used_by</option>
        <option value="deployed_to">deployed_to</option>
        <option value="owned_by">owned_by</option>
      </select>
      <select className="rounded-md border border-[var(--line)] bg-white px-3 py-2" value={to} onChange={(event) => setTo(event.target.value)}>
        {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
      </select>
      <button className="rounded-md bg-[#2f6f73] px-4 py-2 font-semibold text-white" type="submit">追加</button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
