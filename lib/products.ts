import type { L } from "./i18n";

// Ürünler veritabanında (Supabase "products" tablosu) tutulur ve admin panelinden yönetilir.

export type Category = "bracelet" | "necklace" | "earrings" | "anklet";
export type Pattern = "square" | "spiral" | "chevron";

export type Art = {
  kind: Category;
  cord: string;
  accent: string;
  bead: string;
  pattern: Pattern;
  bg: [string, string];
};

export type Product = {
  slug: string;
  name: L;
  category: Category;
  price: number;
  short: L;
  description: L;
  materials: L[];
  size: L;
  art: Art;
  /** Fotoğraf adresleri (sıra: ön, detay, doku). Boşsa illüstrasyon gösterilir. */
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  oneOfAKind?: boolean;
};

/** Kategori sırası. Görünen adlar sözlükte (dict.categories), panelden değiştirilebilir. */
export const categories = ["bracelet", "necklace", "earrings", "anklet"] as const satisfies readonly Category[];
export const patterns = ["square", "spiral", "chevron"] as const satisfies readonly Pattern[];

/** Özel sipariş için seçilebilir ip renkleri */
export const cordColors: { id: string; hex: string; label: L }[] = [
  { id: "terracotta", hex: "#c2643c", label: { tr: "Kiremit", en: "Terracotta" } },
  { id: "sand", hex: "#e3cba8", label: { tr: "Kum", en: "Sand" } },
  { id: "sage", hex: "#8a9a5b", label: { tr: "Adaçayı", en: "Sage" } },
  { id: "mustard", hex: "#d9a441", label: { tr: "Hardal", en: "Mustard" } },
  { id: "sea", hex: "#3f8f8c", label: { tr: "Deniz", en: "Sea" } },
  { id: "lilac", hex: "#a68bb8", label: { tr: "Lila", en: "Lilac" } },
  { id: "indigo", hex: "#34416e", label: { tr: "Gece Mavisi", en: "Indigo" } },
  { id: "rose", hex: "#d98f8f", label: { tr: "Gül Kurusu", en: "Dusty Rose" } },
];

export const beadOptions: { id: string; hex: string; label: L }[] = [
  { id: "wood", hex: "#8b5a3c", label: { tr: "Ahşap", en: "Wood" } },
  { id: "gold", hex: "#d4af37", label: { tr: "Altın Kaplama", en: "Gold Plated" } },
  { id: "amethyst", hex: "#8e5ba6", label: { tr: "Ametist", en: "Amethyst" } },
  { id: "turquoise", hex: "#40b5ad", label: { tr: "Turkuaz", en: "Turquoise" } },
  { id: "pearl", hex: "#f3ece0", label: { tr: "İnci", en: "Pearl" } },
];
