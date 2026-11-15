"use client";

import { useState, useTransition } from "react";
import { deleteProductAction, saveProductAction, type FormState } from "@/app/admin/actions";
import type { ProductInput } from "@/lib/content-schema";
import { categories, patterns, type Category } from "@/lib/products";
import { ProductArt } from "../ProductArt";
import { ImageUpload } from "./ImageUpload";
import { buttonClass, Card, dangerButtonClass, ghostButtonClass, inputClass, Notice } from "./ui";

type L = { tr: string; en: string };

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function LocalizedField({ label, value, onChange, max, multiline }: { label: string; value: L; onChange: (v: L) => void; max: number; multiline?: boolean }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["tr", "en"] as const).map((lang) => (
          <label key={lang} className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">{lang === "tr" ? "Türkçe" : "English"}</span>
            <Tag value={value[lang]} maxLength={max} rows={multiline ? 5 : undefined} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} className={inputClass} />
          </label>
        ))}
      </div>
    </div>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-line bg-paper" />
      {label}
    </label>
  );
}

export function ProductForm({
  mode,
  initial,
  categoryLabels,
  imageBase,
}: {
  mode: "create" | "update";
  initial: ProductInput;
  categoryLabels: Record<Category, string>;
  imageBase: string;
}) {
  const [p, setP] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(mode === "update");
  const [state, setState] = useState<FormState>();
  const [pending, start] = useTransition();
  const set = (patch: Partial<ProductInput>) => {
    setState(undefined);
    setP((cur) => ({ ...cur, ...patch }));
  };
  const viewNames = ["Ön", "Detay", "Doku"];

  const save = () => start(async () => setState(await saveProductAction(JSON.stringify(p), mode)));
  const remove = () => {
    if (!confirm(`"${p.name.tr}" silinsin mi? Fotoğrafları da silinir. Bu işlem geri alınamaz.`)) return;
    start(async () => setState(await deleteProductAction(p.slug)));
  };
  const moveImage = (i: number, dir: -1 | 1) => {
    const next = [...p.images];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    set({ images: next });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6 pb-24"
    >
      <Card title="Fotoğraflar" description="En fazla 3 fotoğraf. Sıra: ön görünüm, detay, doku. Fotoğraf olmayan görünümlerde çizim gösterilir. Dikey (4:5) fotoğraflar en iyi sonucu verir.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {p.images.map((path, i) => (
            <div key={path} className="space-y-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${imageBase}/${path}`} alt={`${viewNames[i]} görünüm`} className="size-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-0.5 text-xs font-semibold">{i + 1}. {viewNames[i]}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <button type="button" disabled={i === 0} onClick={() => moveImage(i, -1)} className="rounded border border-line px-2 py-1 disabled:opacity-40" aria-label="Sola taşı">←</button>
                <button type="button" disabled={i === p.images.length - 1} onClick={() => moveImage(i, 1)} className="rounded border border-line px-2 py-1 disabled:opacity-40" aria-label="Sağa taşı">→</button>
                <button type="button" onClick={() => set({ images: p.images.filter((x) => x !== path) })} className="ml-auto text-red-700 hover:underline">Kaldır</button>
              </div>
            </div>
          ))}
          {p.images.length < 3 && (
            <div className="grid aspect-[4/5] place-items-center rounded-xl border-2 border-dashed border-line p-3 text-center">
              <div>
                <p className="mb-3 text-xs text-muted">{p.images.length + 1}. {viewNames[p.images.length]} görünüm</p>
                <ImageUpload folder="products" label="Fotoğraf yükle" onUploaded={(path) => set({ images: [...p.images, path].slice(0, 3) })} />
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">Kaldırdığın fotoğraflar Kaydet&apos;e bastığında kalıcı olarak silinir.</p>
      </Card>

      <Card title="Temel bilgiler">
        <div className="space-y-5">
          <LocalizedField
            label="Ürün adı"
            value={p.name}
            max={120}
            onChange={(name) => set({ name, ...(slugTouched ? {} : { slug: slugify(name.tr) }) })}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Kategori</span>
              <select value={p.category} onChange={(e) => set({ category: e.target.value as Category })} className={inputClass}>
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Fiyat (₺)</span>
              <input type="number" min={0} max={1000000} step={1} value={Number.isFinite(p.price) ? p.price : ""} onChange={(e) => set({ price: e.target.valueAsNumber })} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Sıra</span>
              <input type="number" step={10} value={Number.isFinite(p.sortOrder) ? p.sortOrder : ""} onChange={(e) => set({ sortOrder: e.target.valueAsNumber })} className={inputClass} />
              <span className="mt-1 block text-xs text-muted">Küçük sayı önce gösterilir</span>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Sayfa adresi</span>
            <div className="flex items-center gap-1 text-sm text-muted">
              /collection/
              <input
                value={p.slug}
                disabled={mode === "update"}
                onChange={(e) => {
                  setSlugTouched(true);
                  set({ slug: e.target.value.toLowerCase() });
                }}
                maxLength={80}
                className={inputClass}
              />
            </div>
            <span className="mt-1 block text-xs text-muted">
              {mode === "update" ? "Paylaşılmış linkler ve favoriler bozulmasın diye adres sonradan değiştirilemez." : "Ad yazınca otomatik oluşur. Küçük harf, rakam ve tire."}
            </span>
          </label>
          <fieldset className="flex flex-wrap gap-5 text-sm">
            <legend className="mb-2 text-sm font-semibold">Rozetler</legend>
            {([["isNew", "Yeni"], ["isBestseller", "Çok satan (ana sayfada öne çıkar)"], ["oneOfAKind", "Tek parça"]] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={p[k]} onChange={(e) => set({ [k]: e.target.checked })} className="size-4 accent-[var(--c-terracotta)]" />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
      </Card>

      <Card title="Açıklamalar">
        <div className="space-y-5">
          <LocalizedField label="Kısa açıklama (adın altında)" value={p.short} max={200} onChange={(short) => set({ short })} />
          <LocalizedField label="Uzun açıklama" value={p.description} max={3000} multiline onChange={(description) => set({ description })} />
          <LocalizedField label="Ölçü" value={p.size} max={120} onChange={(size) => set({ size })} />
          <div>
            <p className="mb-2 text-sm font-semibold">Malzemeler</p>
            <div className="space-y-3">
              {p.materials.map((m, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <LocalizedField label={`${i + 1}. malzeme`} value={m} max={120} onChange={(v) => set({ materials: p.materials.map((x, j) => (j === i ? v : x)) })} />
                  </div>
                  <button type="button" onClick={() => set({ materials: p.materials.filter((_, j) => j !== i) })} className="mb-1 text-xs font-semibold text-red-700 hover:underline">Sil</button>
                </div>
              ))}
              {p.materials.length < 10 && (
                <button type="button" onClick={() => set({ materials: [...p.materials, { tr: "", en: "" }] })} className={ghostButtonClass}>+ Malzeme ekle</button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Çizim renkleri" description="Fotoğraf yüklenmemiş görünümlerde gösterilen illüstrasyonun renkleri.">
        <div className="grid gap-6 sm:grid-cols-[1fr_12rem]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Color label="İp" value={p.art.cord} onChange={(cord) => set({ art: { ...p.art, cord } })} />
            <Color label="Vurgu" value={p.art.accent} onChange={(accent) => set({ art: { ...p.art, accent } })} />
            <Color label="Boncuk / taş" value={p.art.bead} onChange={(bead) => set({ art: { ...p.art, bead } })} />
            <Color label="Arka plan 1" value={p.art.bg[0]} onChange={(c) => set({ art: { ...p.art, bg: [c, p.art.bg[1]] } })} />
            <Color label="Arka plan 2" value={p.art.bg[1]} onChange={(c) => set({ art: { ...p.art, bg: [p.art.bg[0], c] } })} />
            <label className="block text-sm">
              <span className="mb-1 block">Desen</span>
              <select value={p.art.pattern} onChange={(e) => set({ art: { ...p.art, pattern: e.target.value as ProductInput["art"]["pattern"] } })} className={inputClass}>
                {patterns.map((x) => (
                  <option key={x} value={x}>{{ square: "Kare düğüm", spiral: "Spiral", chevron: "Zikzak" }[x]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
            <ProductArt art={{ ...p.art, kind: p.category }} id="admin-preview" className="block aspect-[4/5] w-full" />
          </div>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-paper/90 shadow-[0_-12px_32px_-20px_rgba(59,42,32,0.35)] backdrop-blur lg:left-[17rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <button type="submit" disabled={pending} className={buttonClass}>
            {pending ? "Kaydediliyor…" : mode === "create" ? "Ürünü ekle" : "Kaydet"}
          </button>
          {mode === "update" && (
            <a href={`/tr/collection/${p.slug}`} target="_blank" rel="noopener noreferrer" className={ghostButtonClass}>Sitede gör ↗</a>
          )}
          <div className="min-w-0 flex-1">
            <Notice state={state} />
          </div>
          {mode === "update" && (
            <button type="button" onClick={remove} disabled={pending} className={dangerButtonClass}>Ürünü sil</button>
          )}
        </div>
      </div>
    </form>
  );
}
