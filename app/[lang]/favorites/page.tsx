import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoritesList } from "@/components/FavoritesList";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { isLocale } from "@/lib/i18n";
import { getDict, getSiteData } from "@/lib/server/content";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? (await getDict(lang)).nav.favorites : undefined, robots: { index: false } };
}

export default async function FavoritesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { dict, settings, products } = await getSiteData();
  const t = dict[lang].favorites;
  return (
    <>
      <PageHeader eyebrow="♡" title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <FavoritesList locale={lang} t={t} whatsapp={settings.whatsapp} items={products.map((p) => ({ product: p, card: <ProductCard product={p} locale={lang} /> }))} />
      </section>
    </>
  );
}
