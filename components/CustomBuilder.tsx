"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";
import { beadOptions, categories, cordColors, type Art, type Category, type Pattern } from "@/lib/products";
import { formatPrice, whatsappLink } from "@/lib/site";
import { WhatsappIcon } from "./Icons";
import { ProductArt, shade } from "./ProductArt";

const lengths: Record<Category, { min: number; max: number; def: number }> = {
  bracelet: { min: 14, max: 22, def: 17 },
  necklace: { min: 38, max: 70, def: 45 },
  earrings: { min: 4, max: 10, def: 6 },
  anklet: { min: 20, max: 28, def: 24 },
};
const basePrice: Record<Category, number> = { bracelet: 300, necklace: 480, earrings: 240, anklet: 220 };
const beadExtra: Record<string, number> = { wood: 0, gold: 60, amethyst: 80, turquoise: 70, pearl: 50 };
const patterns: Pattern[] = ["square", "spiral", "chevron"];

function Swatch({ hex, label, selected, onClick }: { hex: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      className={`group flex flex-col items-center gap-1.5 text-xs font-medium ${selected ? "text-ink" : "text-muted"}`}
    >
      <span
        className={`grid size-11 place-items-center rounded-full shadow-inner ring-2 ring-offset-2 ring-offset-paper transition ${
          selected ? "scale-110 ring-terracotta" : "ring-transparent group-hover:ring-line"
        }`}
        style={{ background: `radial-gradient(circle at 35% 30%, ${shade(hex, 0.4)}, ${hex} 55%, ${shade(hex, -0.3)})` }}
      >
        {selected && <span className="size-2 rounded-full bg-white/90 shadow" />}
      </span>
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-7">
      <legend className="mb-4 font-serif text-xl text-ink">{label}</legend>
      {children}
    </fieldset>
  );
}

export function CustomBuilder({ locale }: { locale: Locale }) {
  const t = getDict(locale).custom;
  const [kind, setKind] = useState<Category>("bracelet");
  const [cord, setCord] = useState(cordColors[0]);
  const [bead, setBead] = useState(beadOptions[0]);
  const [pattern, setPattern] = useState<Pattern>("square");
  const [length, setLength] = useState(lengths.bracelet.def);
  const [note, setNote] = useState("");

  const range = lengths[kind];
  const price = basePrice[kind] + beadExtra[bead.id] + (pattern === "square" ? 0 : 30);
  const art: Art = {
    kind,
    cord: cord.hex,
    accent: shade(cord.hex, 0.55),
    bead: bead.hex,
    pattern,
    bg: [shade(cord.hex, 0.85), shade(cord.hex, 0.45)],
  };
  const kindLabel = categories.find((c) => c.id === kind)!.label[locale];

  const message = [
    t.message,
    `• ${t.type}: ${kindLabel}`,
    `• ${t.cord}: ${cord.label[locale]}`,
    `• ${t.bead}: ${bead.label[locale]}`,
    `• ${t.pattern}: ${t.patterns[pattern]}`,
    `• ${t.length}: ${length}`,
    note.trim() && `• ${note.trim()}`,
    `(${t.estimate}: ~${formatPrice(price, locale)})`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      {/* Önizleme */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-paper shadow-[0_30px_60px_-30px_rgba(59,42,32,0.6)]">
          <motion.div key={`${kind}-${pattern}`} initial={{ opacity: 0.4, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <ProductArt art={art} id="custom" className="block aspect-[4/5] w-full" />
          </motion.div>
          <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-4 py-1.5 font-hand text-xl text-terracotta backdrop-blur">{t.preview}</span>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-3xl bg-sand px-6 py-5">
          <span className="text-muted">{t.estimate}</span>
          <motion.span key={price} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif text-3xl text-ink">
            ~{formatPrice(price, locale)}
          </motion.span>
        </div>
        <p className="mt-3 text-sm text-muted">{t.note2}</p>
      </div>

      {/* Seçenekler */}
      <form className="space-y-7 rounded-[2.5rem] border border-line bg-paper p-6 sm:p-10" onSubmit={(e) => e.preventDefault()}>
        <Field label={t.type}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={kind === c.id}
                onClick={() => {
                  setKind(c.id);
                  setLength(lengths[c.id].def);
                }}
                className={`rounded-2xl border-2 px-4 py-3 font-semibold transition ${
                  kind === c.id ? "border-terracotta bg-terracotta/10 text-terracotta" : "border-line text-ink hover:border-muted"
                }`}
              >
                {c.label[locale]}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t.cord}>
          <div className="flex flex-wrap gap-4">
            {cordColors.map((c) => (
              <Swatch key={c.id} hex={c.hex} label={c.label[locale]} selected={cord.id === c.id} onClick={() => setCord(c)} />
            ))}
          </div>
        </Field>

        <Field label={t.bead}>
          <div className="flex flex-wrap gap-4">
            {beadOptions.map((b) => (
              <Swatch key={b.id} hex={b.hex} label={b.label[locale]} selected={bead.id === b.id} onClick={() => setBead(b)} />
            ))}
          </div>
        </Field>

        <Field label={t.pattern}>
          <div className="grid grid-cols-3 gap-3">
            {patterns.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={pattern === p}
                onClick={() => setPattern(p)}
                className={`overflow-hidden rounded-2xl border-2 transition ${pattern === p ? "border-terracotta" : "border-line hover:border-muted"}`}
              >
                <ProductArt art={{ ...art, pattern: p }} id={`swatch-${p}`} view={2} className="block aspect-[2/1] w-full" />
                <span className={`block py-2 text-sm font-semibold ${pattern === p ? "text-terracotta" : "text-ink"}`}>{t.patterns[p]}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label={`${t.length}: ${length}`}>
          <input
            type="range"
            min={range.min}
            max={range.max}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            aria-label={t.length}
            className="w-full accent-[var(--c-terracotta)]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{range.min}</span>
            <span>{range.max}</span>
          </div>
        </Field>

        <div>
          <label htmlFor="note" className="mb-3 block font-serif text-xl text-ink">
            {t.note}
          </label>
          <textarea
            id="note"
            rows={3}
            maxLength={400}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notePlaceholder}
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:border-terracotta"
          />
        </div>

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
        >
          <WhatsappIcon className="size-5" />
          {t.send}
        </a>
      </form>
    </div>
  );
}
