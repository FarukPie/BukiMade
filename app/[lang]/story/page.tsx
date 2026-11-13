import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { ProductArt } from "@/components/ProductArt";
import { Reveal } from "@/components/Reveal";
import { getDict, isLocale } from "@/lib/i18n";
import { getProduct } from "@/lib/products";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).nav.story : undefined };
}

const valueIcons = ["🌙", "🌿", "♻︎"];

export default async function StoryPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const s = t.story;

  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} />

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            {/* Atölye "fotoğrafı" yerine kolaj: gerçek fotoğrafla değiştirilebilir */}
            <div className="overflow-hidden rounded-t-full rounded-b-[3rem] border-[6px] border-paper shadow-2xl">
              <ProductArt art={getProduct("orman-yolu-kolye")!.art} id="story-main" view={2} className="block aspect-[4/5] w-full" />
            </div>
            <div className="absolute -bottom-10 -right-4 w-1/2 rotate-6 overflow-hidden rounded-[2rem] border-[6px] border-paper shadow-xl sm:-right-10">
              <ProductArt art={getProduct("toprak-ana-bileklik")!.art} id="story-b" className="block aspect-[4/5] w-full" />
            </div>
            <span className="absolute -left-4 top-10 -rotate-12 rounded-full bg-mustard px-5 py-2 font-hand text-2xl text-[#2a1d16] shadow-lg">Buki ✦</span>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="font-serif text-2xl leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-terracotta">
            {s.intro}
          </p>
          <blockquote className="mt-10 border-l-4 border-terracotta pl-6 font-hand text-3xl leading-snug text-terracotta">“{s.quote}”</blockquote>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-36 sm:px-6">
        <Reveal>
          <h2 className="text-center font-serif text-4xl text-ink sm:text-6xl">{s.valuesTitle}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {s.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.12}>
              <div className="group h-full rounded-[2rem] border border-line bg-paper p-8 transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <span className="blob grid size-16 place-items-center bg-mustard/30 text-3xl transition duration-500 group-hover:rotate-12" aria-hidden="true">
                  {valueIcons[i]}
                </span>
                <h3 className="mt-6 font-serif text-2xl text-ink">{v.title}</h3>
                <p className="mt-3 text-muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-36 sm:px-6">
        <Reveal>
          <h2 className="text-center font-serif text-4xl text-ink sm:text-6xl">{s.timelineTitle}</h2>
        </Reveal>
        <ol className="relative mt-14 border-l-2 border-dashed border-terracotta/50 pl-10">
          {s.timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.08}>
              <li className="relative pb-12 last:pb-0">
                <span className="absolute -left-[3.05rem] top-1 grid size-6 place-items-center rounded-full border-4 border-cream bg-terracotta" aria-hidden="true" />
                <p className="font-hand text-3xl text-terracotta">{item.year}</p>
                <p className="mt-1 text-lg text-ink">{item.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-16 text-center">
          <Link
            href={`/${lang}/collection`}
            className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
          >
            {t.hero.cta}
            <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
