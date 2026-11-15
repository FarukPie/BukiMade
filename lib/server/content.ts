import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { conform, imagePathSchema, settingsSchema, type DictPair } from "../content-schema";
import { defaults, type Locale } from "../i18n";
import { categories, type Category, type Product } from "../products";
import { defaultSettings, type Settings } from "../site";
import { db, publicImageUrl } from "./db";

const TAG = "site-content";

export type ProductRow = {
  slug: string;
  name: Product["name"];
  category: Category;
  price: number;
  short: Product["short"];
  description: Product["description"];
  materials: Product["materials"];
  size: Product["size"];
  art: Omit<Product["art"], "kind">;
  images: string[];
  is_new: boolean;
  is_bestseller: boolean;
  one_of_a_kind: boolean;
  sort_order: number;
};

const validPaths = (paths: unknown) => (Array.isArray(paths) ? paths.filter((p) => imagePathSchema.safeParse(p).success) : []);

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    short: row.short,
    description: row.description,
    materials: row.materials,
    size: row.size,
    art: { ...row.art, kind: row.category },
    images: validPaths(row.images).map(publicImageUrl),
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
    oneOfAKind: row.one_of_a_kind,
  };
}

/** Kayıtlı ayarları okur; bozuk alanlar varsayılana döner. */
export function readSettings(raw: unknown): Settings {
  const merged = { ...defaultSettings, ...(raw && typeof raw === "object" ? raw : {}) };
  const parsed = settingsSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaultSettings;
}

export function readDict(raw: unknown): DictPair {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return { tr: conform(src.tr, defaults.tr), en: conform(src.en, defaults.en) };
}

async function fetchSiteData() {
  const [content, products] = await Promise.all([
    db().from("site_content").select("dict, settings").eq("id", "main").maybeSingle(),
    db().from("products").select("*").order("sort_order").order("created_at"),
  ]);
  if (content.error) throw new Error(`İçerik okunamadı: ${content.error.message}`);
  if (products.error) throw new Error(`Ürünler okunamadı: ${products.error.message}`);
  return { dict: content.data?.dict, settings: content.data?.settings, products: products.data as ProductRow[] };
}

/** Herkese açık sayfalar için önbellekli okuma. Panelden kayıt yapılınca refreshSite() temizler. */
const loadSiteData = unstable_cache(fetchSiteData, ["site-data-v1"], { tags: [TAG] });

export const getSiteData = cache(async () => {
  const raw = await loadSiteData();
  const settings = readSettings(raw.settings);
  return {
    dict: readDict(raw.dict),
    settings,
    categoryImages: Object.fromEntries(
      categories.flatMap((c) => (settings.categoryImages[c] ? [[c, publicImageUrl(settings.categoryImages[c]!)]] : [])),
    ) as Partial<Record<Category, string>>,
    products: raw.products.map(rowToProduct),
  };
});

export async function getDict(locale: Locale) {
  return (await getSiteData()).dict[locale];
}

export async function getProducts() {
  return (await getSiteData()).products;
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

/** Panelden kayıttan sonra tüm sayfaları yeni içerikle yeniden oluşturur. */
export function refreshSite() {
  revalidateTag(TAG, { expire: 0 });
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
}

/** Panel için önbelleksiz, ham okuma. */
export async function fetchFresh() {
  return fetchSiteData();
}
