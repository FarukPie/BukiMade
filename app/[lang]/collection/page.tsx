import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionGrid } from "@/components/CollectionGrid";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { getDict, isLocale } from "@/lib/i18n";
import { categories, products, type Category } from "@/lib/products";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).collection.title : undefined };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { category } = await searchParams;
  const t = getDict(lang).collection;
  const initial = categories.some((c) => c.id === category) ? (category as Category) : "all";

  return (
    <>
      <PageHeader eyebrow={`${products.length} ✦`} title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <CollectionGrid
          key={initial}
          locale={lang}
          initialCategory={initial}
          categories={categories.map((c) => ({ id: c.id, label: c.label[lang] }))}
          items={products.map((p) => ({ product: p, card: <ProductCard product={p} locale={lang} /> }))}
        />
      </section>
    </>
  );
}
