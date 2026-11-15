"use client";

import { useState, useTransition } from "react";
import { saveSettingsAction, type FormState } from "@/app/admin/actions";
import type { Category } from "@/lib/products";
import type { Settings } from "@/lib/site";
import { ImageUpload } from "./ImageUpload";
import { buttonClass, Card, inputClass, Notice } from "./ui";

export function SettingsForm({
  initial,
  categoryLabels,
  imageBase,
}: {
  initial: Settings;
  categoryLabels: Record<Category, string>;
  imageBase: string;
}) {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<FormState>();
  const [pending, start] = useTransition();
  const set = (patch: Partial<Settings>) => {
    setState(undefined);
    setForm((f) => ({ ...f, ...patch }));
  };

  const save = () => start(async () => setState(await saveSettingsAction(JSON.stringify(form))));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      <Card title="İletişim bilgileri" description="Sipariş ve iletişim butonları bu bilgileri kullanır.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">WhatsApp numarası</span>
            <input value={form.whatsapp} onChange={(e) => set({ whatsapp: e.target.value.replace(/\D/g, "") })} inputMode="numeric" maxLength={15} className={inputClass} />
            <span className="mt-1 block text-xs text-muted">Ülke koduyla, yalnızca rakam: 905321234567</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Instagram kullanıcı adı</span>
            <input value={form.instagram} onChange={(e) => set({ instagram: e.target.value.replace(/^@/, "").trim() })} maxLength={30} className={inputClass} />
            <span className="mt-1 block text-xs text-muted">@ olmadan</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">E-posta</span>
            <input type="email" value={form.email} onChange={(e) => set({ email: e.target.value.trim() })} maxLength={254} className={inputClass} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Şehir (TR)</span>
              <input value={form.city.tr} onChange={(e) => set({ city: { ...form.city, tr: e.target.value } })} maxLength={80} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">City (EN)</span>
              <input value={form.city.en} onChange={(e) => set({ city: { ...form.city, en: e.target.value } })} maxLength={80} className={inputClass} />
            </label>
          </div>
        </div>
      </Card>

      <Card
        title="Kategori kapak görselleri"
        description="Ana sayfadaki “Kendi tarzını bul” bölümünde görünür. Görsel yüklenmezse o kategorinin ilk ürünü gösterilir. Dikey (4:5) fotoğraflar en iyi sonucu verir."
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(Object.keys(categoryLabels) as Category[]).map((c) => {
            const path = form.categoryImages[c];
            return (
              <div key={c} className="space-y-2">
                <p className="text-sm font-semibold">{categoryLabels[c]}</p>
                <div className="aspect-[4/5] overflow-hidden rounded-xl border border-line bg-sand">
                  {path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${imageBase}/${path}`} alt="" className="size-full object-cover" />
                  ) : (
                    <p className="grid size-full place-items-center p-3 text-center text-xs text-muted">Görsel yok</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <ImageUpload folder="categories" label={path ? "Değiştir" : "Yükle"} onUploaded={(p) => set({ categoryImages: { ...form.categoryImages, [c]: p } })} />
                  {path && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...form.categoryImages };
                        delete next[c];
                        set({ categoryImages: next });
                      }}
                      className="text-xs font-semibold text-red-700 hover:underline"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <div className="min-w-0 flex-1">
          <Notice state={state} />
        </div>
      </div>
    </form>
  );
}
