import type { L, Locale } from "./i18n";
import type { Category } from "./products";

/** Koda sabit bilgiler. Site adresi Vercel'de NEXT_PUBLIC_SITE_URL ile verilebilir. */
export const site = {
  name: "BukiMade",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bukimade.vercel.app").replace(/\/+$/, ""),
} as const;

/** Admin panelinden değiştirilebilen iletişim bilgileri ve kategori görselleri. */
export type Settings = {
  /** Ülke koduyla, boşluksuz ve + olmadan: 90 5XX XXX XX XX -> "905000000000" */
  whatsapp: string;
  instagram: string;
  email: string;
  city: L;
  /** Kategori kapak fotoğrafı adresleri; boşsa o kategorinin ilk ürünü gösterilir. */
  categoryImages: Partial<Record<Category, string>>;
};

export const defaultSettings: Settings = {
  whatsapp: "905000000000",
  instagram: "bukimade",
  email: "merhaba@bukimade.com",
  city: { tr: "İstanbul", en: "Istanbul" },
  categoryImages: {},
};

/** İstemci bileşenlerine geçen iletişim bilgileri (görseller hariç). */
export type Contact = Pick<Settings, "whatsapp" | "instagram" | "email">;

export function whatsappLink(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function instagramLink(instagram: string) {
  return `https://instagram.com/${instagram}`;
}

export function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}
