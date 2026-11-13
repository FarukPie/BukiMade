"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useFavorites } from "@/lib/favorites";
import { getDict, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { formatPrice, whatsappLink } from "@/lib/site";
import { HeartIcon, WhatsappIcon } from "./Icons";

/** Favori slug'ları tarayıcıda; kartlar sunucuda render edilip slug ile eşleştirilir. */
export function FavoritesList({ locale, items }: { locale: Locale; items: { product: Product; card: React.ReactNode }[] }) {
  const t = getDict(locale).favorites;
  const favs = useFavorites();
  const chosen = items.filter(({ product }) => favs.includes(product.slug));

  if (chosen.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="blob grid size-28 place-items-center bg-terracotta/15 text-terracotta">
          <HeartIcon className="size-12" />
        </span>
        <p className="mt-8 font-serif text-2xl text-ink">{t.empty}</p>
        <Link
          href={`/${locale}/collection`}
          className="mt-8 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
        >
          {t.emptyCta}
        </Link>
      </div>
    );
  }

  const message = [t.askAllMsg, ...chosen.map(({ product }) => `• ${product.name[locale]} (${formatPrice(product.price, locale)})`)].join("\n");

  return (
    <div>
      <div className="mb-10 flex justify-end">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
        >
          <WhatsappIcon className="size-5" />
          {t.askAll}
        </a>
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {chosen.map(({ product, card }) => (
            <motion.div key={product.slug} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              {card}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
