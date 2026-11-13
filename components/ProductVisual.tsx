import Image from "next/image";
import type { Product } from "@/lib/products";
import { ProductArt } from "./ProductArt";

/** Gerçek fotoğraf varsa onu, yoksa illüstrasyonu gösterir. */
export function ProductVisual({
  product,
  view = 0,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: {
  product: Product;
  view?: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = product.images?.[view] ?? (view === 0 ? product.images?.[0] : undefined);
  return (
    <div className={`relative aspect-[4/5] overflow-hidden ${className}`} role="img" aria-label={alt}>
      {photo ? (
        <Image src={photo} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <ProductArt art={product.art} id={`${product.slug}-${view}`} view={view} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
