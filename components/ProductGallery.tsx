"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";

export function ProductGallery({ product, name, views }: { product: Product; name: string; views: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:flex-col" role="tablist" aria-label={name}>
        {views.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`${name} – ${label}`}
            onClick={() => setActive(i)}
            className={`w-20 overflow-hidden rounded-2xl border-2 transition sm:w-24 ${
              active === i ? "border-terracotta shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <ProductVisual product={product} view={i} alt="" sizes="96px" />
          </button>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-[2.5rem] shadow-[0_30px_60px_-30px_rgba(59,42,32,0.6)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductVisual product={product} view={active} alt={`${name} – ${views[active]}`} priority sizes="(min-width: 1024px) 45vw, 100vw" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
