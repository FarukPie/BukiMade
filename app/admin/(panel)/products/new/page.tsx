import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/ui";
import type { ProductInput } from "@/lib/content-schema";
import { requireAdmin } from "@/lib/server/auth";
import { fetchFresh, readDict } from "@/lib/server/content";
import { publicImageUrl } from "@/lib/server/db";

export const metadata: Metadata = { title: "Yeni ürün" };

export default async function NewProductPage() {
  await requireAdmin();
  const { products, dict } = await fetchFresh();
  const empty = { tr: "", en: "" };
  const initial: ProductInput = {
    slug: "",
    name: empty,
    category: "bracelet",
    price: 300,
    short: empty,
    description: empty,
    materials: [{ tr: "Pamuk makrome ip", en: "Cotton macramé cord" }],
    size: empty,
    art: { cord: "#c2643c", accent: "#e3cba8", bead: "#8b5a3c", pattern: "square", bg: ["#f6e3cf", "#e9b896"] },
    images: [],
    isNew: true,
    isBestseller: false,
    oneOfAKind: false,
    sortOrder: Math.max(0, ...products.map((p) => p.sort_order)) + 10,
  };
  return (
    <>
      <PageTitle eyebrow="Koleksiyon" title="Yeni ürün" description="Tüm alanları Türkçe ve İngilizce doldur, sonra Ürünü ekle'ye bas." />
      <ProductForm mode="create" initial={initial} categoryLabels={readDict(dict).tr.categories} imageBase={publicImageUrl("").replace(/\/$/, "")} />
    </>
  );
}
