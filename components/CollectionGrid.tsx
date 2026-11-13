"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { getDict, type Dict, type Locale } from "@/lib/i18n";
import type { Category, Product } from "@/lib/products";

type Sort = keyof Dict["collection"]["sortOptions"];

/** Kategori filtresi + sıralama. Kartlar sunucuda render edilip buraya verilir. */
export function CollectionGrid({
  items,
  categories,
  initialCategory,
  locale,
}: {
  items: { product: Product; card: React.ReactNode }[];
  categories: { id: Category; label: string }[];
  initialCategory: Category | "all";
  locale: Locale;
}) {
  const t = getDict(locale).collection;
  const [category, setCategory] = useState<Category | "all">(initialCategory);
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = items
    .filter(({ product }) => category === "all" || product.category === category)
    .sort((a, b) => {
      if (sort === "priceAsc") return a.product.price - b.product.price;
      if (sort === "priceDesc") return b.product.price - a.product.price;
      if (sort === "new") return Number(!!b.product.isNew) - Number(!!a.product.isNew);
      return Number(!!b.product.isBestseller) - Number(!!a.product.isBestseller);
    });

  const changeCategory = (c: Category | "all") => {
    setCategory(c);
    const url = new URL(window.location.href);
    if (c === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", c);
    window.history.replaceState(null, "", url);
  };

  const tabs: { id: Category | "all"; label: string }[] = [{ id: "all", label: t.all }, ...categories];

  return (
    <div>
      <div className="sticky top-[68px] z-30 -mx-4 flex flex-wrap items-center justify-between gap-4 bg-cream/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.title}>
          {tabs.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => changeCategory(c.id)}
              aria-pressed={category === c.id}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === c.id ? "text-[#fffaf3]" : "text-ink hover:bg-sand"
              }`}
            >
              {category === c.id && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-terracotta" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted" aria-live="polite">
            {t.count(filtered.length)}
          </span>
          <label className="sr-only" htmlFor="sort">
            {t.sort}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-line bg-paper px-4 py-2.5 font-medium text-ink outline-none focus:border-terracotta"
          >
            {(Object.keys(t.sortOptions) as Sort[]).map((k) => (
              <option key={k} value={k}>
                {t.sortOptions[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted">{t.empty}</p>
      ) : (
        <motion.div layout className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(({ product, card }, i) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                {card}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
