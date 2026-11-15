import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getProducts } from "@/lib/server/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const paths = ["", "/collection", "/story", "/custom", "/faq", "/contact", ...products.map((p) => `/collection/${p.slug}`)];
  return locales.flatMap((l) => paths.map((p) => ({ url: `${site.url}/${l}${p}` })));
}
