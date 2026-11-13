// Tüm iletişim bilgileri tek yerde. Gerçek bilgilerinizi buraya yazın.
export const site = {
  name: "BukiMade",
  url: "https://bukimade.vercel.app",
  // Ülke koduyla, boşluksuz ve + olmadan: 90 5XX XXX XX XX -> "905000000000"
  whatsapp: "905000000000",
  instagram: "bukimade",
  email: "merhaba@bukimade.com",
  city: { tr: "İstanbul", en: "Istanbul" },
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const instagramLink = `https://instagram.com/${site.instagram}`;

export function formatPrice(price: number, locale: "tr" | "en") {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}
