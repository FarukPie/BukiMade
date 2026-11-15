import { z } from "zod";
import type { Dict } from "./i18n";
import { categories, patterns } from "./products";

const MAX_TEXT = 5000;
const MAX_ITEMS = 50;
/** Eleman sayısı değiştirilemeyen listeler (ör. galeri görünüm adları: Ön / Detay / Doku). */
export const FIXED_ARRAYS = new Set(["product.views"]);

// Satır sonu ve sekme dışındaki kontrol karakterlerini temizler.
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, MAX_TEXT);

/**
 * Gelen değeri varsayılan sözlüğün şekline zorlar: bilinmeyen anahtarlar atılır, eksik veya
 * yanlış tipteki alanlar varsayılanla doldurulur. Hem kaydederken (güvenlik) hem okurken
 * (koda yeni metin eklendiğinde eski kayıtlarla uyum) kullanılır.
 */
export function conform<T>(input: unknown, template: T, path = ""): T {
  if (typeof template === "string") return (typeof input === "string" ? clean(input) : template) as T;
  if (Array.isArray(template)) {
    if (!Array.isArray(input)) return template;
    if (FIXED_ARRAYS.has(path)) return template.map((t, i) => conform(input[i], t, `${path}[]`)) as T;
    return input.slice(0, MAX_ITEMS).map((v) => conform(v, template[0], `${path}[]`)) as T;
  }
  if (template && typeof template === "object") {
    const src = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(template)) {
      out[key] = conform(Object.hasOwn(src, key) ? src[key] : undefined, value, path ? `${path}.${key}` : key);
    }
    return out as T;
  }
  return template;
}

export type DictPair = { tr: Dict; en: Dict };

/** Supabase Storage içindeki yollar: <klasör>/<uuid>.<uzantı> */
export const imagePathSchema = z
  .string()
  .regex(/^(products|categories)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg|png)$/);

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Renk #RRGGBB biçiminde olmalı");
const text = (max: number) => z.string().trim().min(1, "Boş bırakılamaz").max(max, `En fazla ${max} karakter`);
const localized = (max: number) => z.object({ tr: text(max), en: text(max) });

export const settingsSchema = z.object({
  whatsapp: z.string().regex(/^[1-9]\d{7,14}$/, "WhatsApp numarası ülke koduyla, yalnızca rakam olmalı (ör. 905321234567)"),
  instagram: z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Instagram kullanıcı adı geçersiz (@ olmadan yazın)"),
  email: z.email("E-posta adresi geçersiz").max(254),
  city: localized(80),
  categoryImages: z.partialRecord(z.enum(categories), imagePathSchema),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

export const slugSchema = z
  .string()
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Adres yalnızca küçük harf, rakam ve tire içerebilir (ör. gunes-kolye)");

export const productSchema = z.object({
  slug: slugSchema,
  name: localized(120),
  category: z.enum(categories),
  price: z.number().int("Fiyat tam sayı olmalı").min(0).max(1_000_000),
  short: localized(200),
  description: localized(3000),
  materials: z.array(localized(120)).max(10),
  size: localized(120),
  art: z.object({ cord: hex, accent: hex, bead: hex, pattern: z.enum(patterns), bg: z.tuple([hex, hex]) }),
  images: z.array(imagePathSchema).max(3),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  oneOfAKind: z.boolean(),
  sortOrder: z.number().int().min(-100000).max(100000),
});
export type ProductInput = z.infer<typeof productSchema>;
