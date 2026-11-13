"use client";

import { motion } from "motion/react";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import { HeartIcon } from "./Icons";

export function FavoriteButton({
  slug,
  labels,
  className = "",
}: {
  slug: string;
  labels: { add: string; remove: string };
  className?: string;
}) {
  const active = useFavorites().includes(slug);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-pressed={active}
      aria-label={active ? labels.remove : labels.add}
      title={active ? labels.remove : labels.add}
      className={`grid size-11 place-items-center rounded-full bg-paper/85 text-terracotta shadow-sm backdrop-blur transition hover:scale-110 hover:bg-paper ${className}`}
    >
      <motion.span key={String(active)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <HeartIcon className="size-5" filled={active} />
      </motion.span>
    </motion.button>
  );
}
