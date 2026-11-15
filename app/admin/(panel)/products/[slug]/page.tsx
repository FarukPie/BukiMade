import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { Notice, PageTitle } from "@/components/admin/ui";
import { imagePathSchema, slugSchema } from "@/lib/content-schema";
import { requireAdmin } from "@/lib/server/auth";
import { readDict, type ProductRow } from "@/lib/server/content";
import { db, publicImageUrl } from "@/lib/server/db";

export const metadata: Metadata = { title: "Ürünü düzenle" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditProductPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { slug } = await params;
  const { created } = await searchParams;
  if (!slugSchema.safeParse(slug).success) notFound();

  const [{ data: row }, { data: content }] = await Promise.all([
    db().from("products").select("*").eq("slug", slug).maybeSingle<ProductRow>(),
    db().from("site_content").select("dict").eq("id", "main").maybeSingle(),
  ]);
  if (!row) notFound();

  return (
    <>
      <PageTitle eyebrow="Ürünü düzenle" title={row.name.tr} description={<Link href="/admin/products" className="text-terracotta hover:underline">← Tüm ürünler</Link>} />
      {created && (
        <div className="mb-4">
          <Notice state={{ ok: "Ürün eklendi. Şimdi fotoğraf yükleyebilirsin." }} />
        </div>
      )}
      <ProductForm
        mode="update"
        initial={{
          slug: row.slug,
          name: row.name,
          category: row.category,
          price: row.price,
          short: row.short,
          description: row.description,
          materials: row.materials,
          size: row.size,
          art: { cord: row.art.cord, accent: row.art.accent, bead: row.art.bead, pattern: row.art.pattern, bg: row.art.bg },
          images: row.images.filter((p) => imagePathSchema.safeParse(p).success),
          isNew: row.is_new,
          isBestseller: row.is_bestseller,
          oneOfAKind: row.one_of_a_kind,
          sortOrder: row.sort_order,
        }}
        categoryLabels={readDict(content?.dict).tr.categories}
        imageBase={publicImageUrl("").replace(/\/$/, "")}
      />
    </>
  );
}
