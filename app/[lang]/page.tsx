import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroVisual } from "@/components/HeroVisual";
import { ArrowIcon } from "@/components/Icons";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getDict, isLocale } from "@/lib/i18n";
import { categories, getProduct, products, type Art } from "@/lib/products";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  const featured = [...products.filter((p) => p.isBestseller), ...products.filter((p) => p.isNew)].slice(0, 4);
  const heroArts: [Art, Art, Art] = [getProduct("gunes-kolye")!.art, getProduct("ege-esintisi-bileklik")!.art, getProduct("gun-batimi-kupe")!.art];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div aria-hidden="true" className="blob absolute -right-40 -top-40 size-[36rem] bg-mustard/30 blur-3xl" />
        <div aria-hidden="true" className="blob absolute -left-40 bottom-0 size-[28rem] bg-terracotta/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-hand text-3xl text-terracotta">{t.hero.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tight text-ink sm:text-8xl">
                {t.hero.title1}
                <br />
                <span className="relative inline-block italic text-terracotta">
                  {t.hero.title2}
                  <svg className="absolute -bottom-3 left-0 w-full text-mustard" viewBox="0 0 300 20" preserveAspectRatio="none" fill="none" aria-hidden="true">
                    <path d="M3 14 C 60 2, 120 18, 180 8 S 270 4, 297 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">{t.hero.subtitle}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/${lang}/collection`}
                  className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
                >
                  {t.hero.cta}
                  <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${lang}/custom`}
                  className="inline-flex items-center rounded-full border-2 border-ink/80 px-7 py-4 font-semibold text-ink transition hover:bg-ink hover:text-cream"
                >
                  {t.hero.cta2}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <dl className="mt-14 flex gap-10 border-t border-line pt-8">
                {[
                  ["600+", t.hero.stat1],
                  ["500+", t.hero.stat2],
                  ["%100", t.hero.stat3],
                ].map(([n, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-serif text-4xl text-ink">{n}</dd>
                    <dd className="mt-1 text-sm text-muted">{label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <HeroVisual arts={heroArts} badge={t.marquee[0]} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 -rotate-2 overflow-hidden bg-terracotta py-5 text-[#fffaf3] shadow-xl" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-serif text-2xl italic sm:text-3xl">
          {[...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee].map((word, i) => (
            <span key={i} className="flex items-center gap-10">
              {word} <span className="text-mustard not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* KATEGORİLER */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <Reveal className="text-center">
          <p className="font-hand text-2xl text-terracotta">{t.home.categoriesSub}</p>
          <h2 className="mt-2 font-serif text-4xl text-ink sm:text-6xl">{t.home.categoriesTitle}</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((c, i) => {
            const sample = products.find((p) => p.category === c.id)!;
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <Link href={`/${lang}/collection?category=${c.id}`} className="group block text-center">
                  <div className="overflow-hidden rounded-t-full rounded-b-3xl border-4 border-paper shadow-lg transition duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    <ProductArt art={sample.art} id={`cat-${c.id}`} className="block aspect-[4/5] w-full transition duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-ink transition group-hover:text-terracotta">{c.label[lang]}</h3>
                  <p className="text-sm text-muted">{products.filter((p) => p.category === c.id).length} ✦</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ÖNE ÇIKANLAR */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="font-hand text-2xl text-terracotta">{t.home.featuredSub}</p>
            <h2 className="mt-2 font-serif text-4xl text-ink sm:text-6xl">{t.home.featuredTitle}</h2>
          </Reveal>
          <Link href={`/${lang}/collection`} className="group inline-flex items-center gap-2 font-semibold text-terracotta">
            {t.home.viewAll}
            <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <ProductCard product={p} locale={lang} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="relative mt-32 overflow-hidden bg-sand py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="font-hand text-2xl text-terracotta">{t.home.processSub}</p>
            <h2 className="mt-2 font-serif text-4xl text-ink sm:text-6xl">{t.home.processTitle}</h2>
          </Reveal>
          <div className="relative mt-16">
            <svg className="absolute left-0 top-10 hidden h-12 w-full text-terracotta/50 lg:block" viewBox="0 0 1000 40" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M 40 20 C 200 -10, 300 50, 500 20 S 800 -10, 960 20" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
            </svg>
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {t.home.steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.12}>
                  <li className="text-center">
                    <span className="mx-auto grid size-20 place-items-center rounded-full border-4 border-cream bg-terracotta font-serif text-3xl italic text-[#fffaf3] shadow-lg">
                      {i + 1}
                    </span>
                    <h3 className="mt-6 font-serif text-2xl text-ink">{s.title}</h3>
                    <p className="mx-auto mt-3 max-w-xs text-muted">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ÖZEL SİPARİŞ ÇAĞRISI */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-[3rem] bg-[#2a1d16] text-[#f7efe3] lg:grid-cols-2">
            <div className="relative z-10 p-10 sm:p-16">
              <p className="font-hand text-3xl text-mustard">{t.custom.eyebrow}</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{t.home.customTitle}</h2>
              <p className="mt-6 max-w-md text-lg opacity-75">{t.home.customText}</p>
              <Link
                href={`/${lang}/custom`}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-mustard px-7 py-4 font-semibold text-[#2a1d16] transition hover:-translate-y-0.5 hover:bg-[#f0c060]"
              >
                {t.home.customCta}
                <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative grid grid-cols-3 gap-3 p-6 opacity-90 lg:p-10" aria-hidden="true">
              {products.slice(0, 6).map((p, i) => (
                <div key={p.slug} className={`overflow-hidden rounded-2xl ${i % 2 ? "translate-y-6" : ""}`}>
                  <ProductArt art={p.art} id={`cta-${p.slug}`} view={2} className="block aspect-[4/5] w-full" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* YORUMLAR */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <Reveal className="text-center">
          <h2 className="font-serif text-4xl text-ink sm:text-6xl">{t.home.testimonialsTitle}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.home.testimonials.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.12}>
              <figure className={`h-full rounded-[2rem] border border-line bg-paper p-8 shadow-sm ${i === 1 ? "md:-translate-y-6" : ""}`}>
                <div className="text-mustard" aria-label="5/5">★★★★★</div>
                <blockquote className="mt-4 font-serif text-xl leading-relaxed text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-6 font-hand text-2xl text-terracotta">— {r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
