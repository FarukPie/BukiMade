import type { Metadata } from "next";
import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";
import { ImageIcon, PlusIcon } from "@/components/admin/icons";
import { buttonClass, Notice, PageTitle } from "@/components/admin/ui";
import { formatPrice } from "@/lib/site";
import { requireAdmin } from "@/lib/server/auth";
import { fetchFresh, readDict } from "@/lib/server/content";
import { publicImageUrl } from "@/lib/server/db";

export const metadata: Metadata = { title: "Ürünler" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const { deleted } = await searchParams;
  const { products, dict } = await fetchFresh();
  const labels = readDict(dict).tr.categories;

  return (
    <>
      <PageTitle
        eyebrow="Koleksiyon"
        title="Ürünler ve resimler"
        description={`${products.length} ürün. Bir ürüne tıklayarak adını, fiyatını, açıklamasını ve fotoğraflarını değiştirebilirsin.`}
        actions={
          <Link href="/admin/products/new" className={buttonClass}>
            <PlusIcon className="size-4" /> Yeni ürün
          </Link>
        }
      />
      {deleted && (
        <div className="mb-6">
          <Notice state={{ ok: "Ürün silindi." }} />
        </div>
      )}
      {products.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-line p-14 text-center">
          <p className="font-serif text-2xl">Henüz ürün yok</p>
          <p className="mt-2 text-sm text-muted">İlk ürününü ekleyerek başla.</p>
          <Link href="/admin/products/new" className={`${buttonClass} mt-6`}>
            <PlusIcon className="size-4" /> Yeni ürün
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const badges = [p.is_bestseller && "Çok satan", p.is_new && "Yeni", p.one_of_a_kind && "Tek parça"].filter(Boolean) as string[];
            return (
              <li key={p.slug}>
                <Link
                  href={`/admin/products/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-line/80 bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-sand">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publicImageUrl(p.images[0])} alt="" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <ProductArt art={{ ...p.art, kind: p.category }} id={`adm-${p.slug}`} className="block aspect-[4/5] w-full transition duration-500 group-hover:scale-105" />
                    )}
                    {badges.length > 0 && (
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {badges.map((b) => (
                          <span key={b} className="rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-clay shadow-sm backdrop-blur">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
                        p.images.length ? "bg-paper/90 text-ink" : "bg-mustard/90 text-[#2a1d16]"
                      }`}
                    >
                      <ImageIcon className="size-3.5" />
                      {p.images.length ? `${p.images.length}/3` : "Fotoğraf yok"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels[p.category]}</p>
                      <p className="mt-0.5 truncate font-serif text-lg text-ink transition group-hover:text-terracotta">{p.name.tr}</p>
                    </div>
                    <p className="shrink-0 pt-4 text-sm font-bold">{formatPrice(p.price, "tr")}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
