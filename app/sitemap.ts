import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/collection", "/story", "/custom", "/faq", "/contact", ...products.map((p) => `/collection/${p.slug}`)];
  return locales.flatMap((l) => paths.map((p) => ({ url: `${site.url}/${l}${p}` })));
}
