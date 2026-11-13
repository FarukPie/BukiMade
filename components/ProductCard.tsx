import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { FavoriteButton } from "./FavoriteButton";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDict(locale).product;
  const category = categories.find((c) => c.id === product.category)!.label[locale];
  const badge = product.isNew ? t.new : product.isBestseller ? t.bestseller : product.oneOfAKind ? t.oneOfAKind : null;

  return (
    <Link href={`/${locale}/collection/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[2rem] bg-sand shadow-[0_10px_40px_-20px_rgba(59,42,32,0.45)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_25px_50px_-20px_rgba(59,42,32,0.55)]">
        <ProductVisual product={product} alt={product.name[locale]} className="transition duration-700 ease-out group-hover:scale-[1.06]" />
        {/* Üzerine gelince yakın detay görünümü */}
        <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" aria-hidden="true">
          <ProductVisual product={product} view={1} alt="" />
        </div>
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clay backdrop-blur">
            {badge}
          </span>
        )}
        <FavoriteButton slug={product.slug} labels={{ add: t.addFav, remove: t.removeFav }} className="absolute right-4 top-4" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{category}</p>
          <h3 className="mt-1 font-serif text-xl text-ink transition group-hover:text-terracotta">{product.name[locale]}</h3>
        </div>
        <p className="mt-5 shrink-0 font-semibold text-ink">{formatPrice(product.price, locale)}</p>
      </div>
    </Link>
  );
}
