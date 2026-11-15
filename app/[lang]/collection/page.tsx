import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionGrid } from "@/components/CollectionGrid";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { isLocale } from "@/lib/i18n";
import { categories, type Category } from "@/lib/products";
import { getDict, getSiteData } from "@/lib/server/content";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? (await getDict(lang)).collection.title : undefined };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { category } = await searchParams;
  const { dict, products } = await getSiteData();
  const t = dict[lang].collection;
  const initial = categories.includes(category as Category) ? (category as Category) : "all";

  return (
    <>
      <PageHeader eyebrow={`${products.length} ✦`} title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <CollectionGrid
          key={initial}
          t={t}
          initialCategory={initial}
          categories={categories.map((c) => ({ id: c, label: dict[lang].categories[c] }))}
          items={products.map((p) => ({ product: p, card: <ProductCard product={p} locale={lang} /> }))}
        />
      </section>
    </>
  );
}
