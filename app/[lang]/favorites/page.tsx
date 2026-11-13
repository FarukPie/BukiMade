import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoritesList } from "@/components/FavoritesList";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { getDict, isLocale } from "@/lib/i18n";
import { products } from "@/lib/products";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).nav.favorites : undefined, robots: { index: false } };
}

export default async function FavoritesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).favorites;
  return (
    <>
      <PageHeader eyebrow="♡" title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <FavoritesList locale={lang} items={products.map((p) => ({ product: p, card: <ProductCard product={p} locale={lang} /> }))} />
      </section>
    </>
  );
}
