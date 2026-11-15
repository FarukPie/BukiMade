"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { saveTextsAction, type FormState } from "@/app/admin/actions";
import { FIXED_ARRAYS, type DictPair } from "@/lib/content-schema";
import { defaults } from "@/lib/i18n";
import { buttonClass, ghostButtonClass, inputClass, Notice } from "./ui";

type Json = string | Json[] | { [k: string]: Json };

const SECTIONS: Record<string, string> = {
  nav: "Menü ve genel",
  hero: "Ana sayfa · Üst bölüm",
  categories: "Kategori adları",
  marquee: "Ana sayfa · Kayan yazı şeridi",
  home: "Ana sayfa · Diğer bölümler",
  product: "Ürün sayfası ve ürün kartları",
  collection: "Koleksiyon sayfası",
  story: "Hikayem sayfası",
  custom: "Özel sipariş sayfası",
  faq: "SSS sayfası",
  contact: "İletişim sayfası",
  favorites: "Favoriler sayfası",
  footer: "Alt bilgi (footer)",
  notFound: "Sayfa bulunamadı (404)",
};

const LABELS: Record<string, string> = {
  title: "Başlık", title1: "Başlık (1. satır)", title2: "Başlık (2. satır, renkli)", subtitle: "Alt başlık", eyebrow: "Üstteki küçük yazı",
  text: "Metin", intro: "Giriş yazısı", quote: "Alıntı", badge: "Rozet", cta: "Buton", cta2: "İkinci buton", stat1: "1. istatistik açıklaması",
  stat2: "2. istatistik açıklaması", stat3: "3. istatistik açıklaması", stat1Value: "1. istatistik değeri", stat2Value: "2. istatistik değeri",
  stat3Value: "3. istatistik değeri", steps: "Süreç adımları", testimonials: "Müşteri yorumları", name: "İsim", items: "Sorular", q: "Soru", a: "Cevap",
  care: "Bakım maddeleri", values: "Değerler", timeline: "Yolculuk (zaman çizelgesi)", year: "Yıl", views: "Galeri görünüm adları",
  whatsappMsg: "WhatsApp sipariş mesajı", count: "Ürün sayısı yazısı", greeting: "WhatsApp selamlama mesajı", skip: "\"İçeriğe geç\" bağlantısı (ekran okuyucu)",
  admin: "Yönetici girişi bağlantısı", made: "Alt satır notu", rights: "Telif yazısı", tagline: "Slogan",
  bracelet: "Bileklik", necklace: "Kolye", earrings: "Küpe", anklet: "Halhal", sortOptions: "Sıralama seçenekleri", patterns: "Örgü desenleri",
};

const HINTS: Record<string, string> = {
  "product.whatsappMsg": "{name}, {price} ve {url} otomatik doldurulur; bunları silmeyin.",
  "collection.count": "{n} yerine ürün sayısı yazılır.",
};

const labelFor = (key: string) => LABELS[key] ?? key;

function blank(template: Json): Json {
  if (typeof template === "string") return "";
  if (Array.isArray(template)) return [];
  return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blank(v)]));
}

function getAt(root: Json | undefined, path: (string | number)[]): Json | undefined {
  return path.reduce<Json | undefined>((node, key) => (node && typeof node === "object" ? (node as Record<string, Json>)[key as string] : undefined), root);
}

function setAt(root: Json, path: (string | number)[], value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setAt(copy[head as number] ?? "", rest, value);
    return copy;
  }
  const obj = (root && typeof root === "object" ? root : {}) as Record<string, Json>;
  return { ...obj, [head]: setAt(obj[head] ?? "", rest, value) };
}

function matches(node: Json | undefined, q: string): boolean {
  if (node === undefined) return false;
  if (typeof node === "string") return node.toLocaleLowerCase("tr").includes(q);
  return Object.values(node).some((v) => matches(v, q));
}

export function TextsEditor({ initial }: { initial: DictPair }) {
  const [data, setData] = useState<{ tr: Json; en: Json }>(initial as unknown as { tr: Json; en: Json });
  const [saved, setSaved] = useState(data);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<FormState>();
  const [pending, start] = useTransition();
  const dirty = data !== saved;
  const q = query.trim().toLocaleLowerCase("tr");

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (lang: "tr" | "en", path: (string | number)[], value: Json) => {
    setState(undefined);
    setData((d) => ({ ...d, [lang]: setAt(d[lang], path, value) }));
  };
  const both = (fn: (node: Json, lang: "tr" | "en") => Json, path: (string | number)[]) =>
    setData((d) => ({ tr: setAt(d.tr, path, fn(getAt(d.tr, path) ?? [], "tr")), en: setAt(d.en, path, fn(getAt(d.en, path) ?? [], "en")) }));

  const save = () =>
    start(async () => {
      const result = await saveTextsAction(JSON.stringify(data));
      setState(result);
      if (result?.ok) setSaved(data);
    });

  const sections = useMemo(() => Object.keys(data.tr as Record<string, Json>), [data.tr]);

  function renderNode(path: (string | number)[], depth: number): React.ReactNode {
    const tr = getAt(data.tr, path);
    const en = getAt(data.en, path);
    const key = path.join(".");
    const schemaPath = path.filter((p) => typeof p === "string").join(".");
    if (q && !matches(tr, q) && !matches(en, q)) return null;

    if (typeof tr === "string") {
      const long = Math.max(tr.length, typeof en === "string" ? en.length : 0) > 70;
      const last = path[path.length - 1];
      return (
        <div key={key} className="grid gap-2 sm:grid-cols-[10rem_1fr_1fr] sm:items-start">
          <p className="pt-2 text-xs font-semibold text-muted">{typeof last === "number" ? `${last + 1}.` : labelFor(last)}</p>
          {(["tr", "en"] as const).map((lang) => (
            <label key={lang} className="block">
              <span className="sr-only">{`${key} (${lang})`}</span>
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:hidden">{lang}</span>
              <textarea
                rows={long ? 3 : 1}
                maxLength={5000}
                value={typeof getAt(data[lang], path) === "string" ? (getAt(data[lang], path) as string) : ""}
                onChange={(e) => update(lang, path, e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </label>
          ))}
          {HINTS[schemaPath] && <p className="text-xs text-clay sm:col-start-2 sm:col-span-2">{HINTS[schemaPath]}</p>}
        </div>
      );
    }

    if (Array.isArray(tr)) {
      const fixed = FIXED_ARRAYS.has(schemaPath);
      const length = Math.max(tr.length, Array.isArray(en) ? en.length : 0);
      // Yeni öğenin şekli varsayılan sözlükteki ilk öğeden alınır.
      const template = (getAt(defaults.tr as unknown as Json, path.map((p) => (typeof p === "number" ? 0 : p))) as Json[] | undefined)?.[0];
      return (
        <fieldset key={key} className="space-y-3 rounded-xl border border-dashed border-line p-3">
          <legend className="px-1 text-sm font-bold">{labelFor(String(path[path.length - 1]))}</legend>
          {Array.from({ length }, (_, i) => (
            <div key={i} className="space-y-2 rounded-lg bg-cream/60 p-3">
              {typeof tr[i] === "object" ? (
                <>
                  <p className="text-xs font-bold text-muted">{i + 1}. öğe</p>
                  {renderNode([...path, i], depth + 1)}
                </>
              ) : (
                renderNode([...path, i], depth + 1)
              )}
              {!fixed && !q && (
                <button type="button" onClick={() => both((arr) => (arr as Json[]).filter((_, j) => j !== i), path)} className="text-xs font-semibold text-red-700 hover:underline">
                  Bu öğeyi sil
                </button>
              )}
            </div>
          ))}
          {!fixed && !q && (
            <button
              type="button"
              onClick={() => both((arr) => [...(arr as Json[]), blank(template ?? "")], path)}
              className={ghostButtonClass}
            >
              + Yeni öğe ekle
            </button>
          )}
        </fieldset>
      );
    }

    if (tr && typeof tr === "object") {
      const children = Object.keys(tr).map((k) => renderNode([...path, k], depth + 1));
      if (depth === 0 || typeof path[path.length - 1] === "number") return children;
      return (
        <fieldset key={key} className="space-y-3 rounded-xl border border-line p-3">
          <legend className="px-1 text-sm font-bold">{labelFor(String(path[path.length - 1]))}</legend>
          {children}
        </fieldset>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Metin ara… (ör. kargo)"
          className={`${inputClass} max-w-sm`}
          aria-label="Metinlerde ara"
        />
        <p className="hidden text-xs text-muted sm:block">Her satırda sol kutu Türkçe, sağ kutu İngilizce.</p>
      </div>

      {sections.map((section) => {
        const visible = !q || matches(getAt(data.tr, [section]), q) || matches(getAt(data.en, [section]), q);
        if (!visible) return null;
        return (
          <details key={section} open={!!q} className="group rounded-2xl border border-line bg-paper shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-bold">
              {SECTIONS[section] ?? section}
              <span className="text-muted transition group-open:rotate-90">›</span>
            </summary>
            <div className="space-y-3 border-t border-line px-5 py-5">
              <div className="hidden gap-2 text-[11px] font-bold uppercase tracking-wider text-muted sm:grid sm:grid-cols-[10rem_1fr_1fr]">
                <span />
                <span>Türkçe</span>
                <span>English</span>
              </div>
              {renderNode([section], Array.isArray(getAt(data.tr, [section])) ? 1 : 0)}
            </div>
          </details>
        );
      })}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-paper/90 shadow-[0_-12px_32px_-20px_rgba(59,42,32,0.35)] backdrop-blur lg:left-[17rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">{state ? <Notice state={state} /> : <p className="text-sm text-muted">{dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}</p>}</div>
          <button type="button" onClick={save} disabled={pending || !dirty} className={buttonClass}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
