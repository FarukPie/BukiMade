"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { Art } from "@/lib/products";
import { ProductArt } from "./ProductArt";

/** Ana sayfa kahraman görseli: kemer çerçeveler, paralaks ve dönen rozet */
export function HeroVisual({ arts, badge }: { arts: [Art, Art, Art]; badge: string }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -80]);
  const y2 = useTransform(scrollY, [0, 600], [0, 60]);
  const rotate = useTransform(scrollY, [0, 600], [0, 25]);
  const text = `${badge} • ${badge} • `;

  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-xl">
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[8%] top-0 w-[58%] overflow-hidden rounded-t-full rounded-b-[2.5rem] border-[6px] border-paper shadow-2xl"
      >
        <ProductArt art={arts[0]} id="hero-a" className="block aspect-[4/5] w-full" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[2%] right-0 w-[48%] rotate-3 overflow-hidden rounded-[2.5rem] border-[6px] border-paper shadow-2xl"
      >
        <ProductArt art={arts[1]} id="hero-b" className="block aspect-[4/5] w-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-[8%] left-0 w-[34%] -rotate-6"
      >
        <div className="animate-float overflow-hidden rounded-full border-[6px] border-paper shadow-xl">
          <ProductArt art={arts[2]} id="hero-c" view={1} className="block aspect-square w-full" />
        </div>
      </motion.div>

      {/* Dönen el yapımı rozeti */}
      <motion.div style={{ rotate }} className="absolute right-[6%] top-[6%] size-28 sm:size-32">
        <div className="relative size-full animate-spin-slow rounded-full bg-mustard text-ink shadow-lg">
          <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M 50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0" />
            </defs>
            <text className="fill-current font-sans text-[10.5px] font-bold uppercase tracking-[0.18em]">
              <textPath href="#badge-circle">{text}</textPath>
            </text>
          </svg>
        </div>
        <span className="absolute inset-0 grid place-items-center text-3xl" aria-hidden="true">
          ✦
        </span>
      </motion.div>

      {/* Dekoratif ip */}
      <svg className="absolute -left-6 top-1/3 -z-10 h-2/3 w-1/2 text-terracotta/40" viewBox="0 0 200 300" fill="none" aria-hidden="true">
        <motion.path
          d="M 180 0 C 0 60, 220 140, 40 200 S 120 290, 10 300"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
