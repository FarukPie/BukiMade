import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ArrowIcon, InstagramIcon, PlusIcon, WhatsappIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { getDict, isLocale } from "@/lib/i18n";
import { categories, getProduct, products } from "@/lib/products";
import { formatPrice, instagramLink, site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(lang)) return {};
  return { title: product.name[lang], description: product.short[lang] };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(lang)) notFound();
  const t = getDict(lang).product;
  const name = product.name[lang];
  const price = formatPrice(product.price, lang);
  const category = categories.find((c) => c.id === product.category)!.label[lang];
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const fill = products.filter((p) => p.slug !== product.slug && !related.includes(p)).slice(0, 4 - related.length);
  const badges = [product.isNew && t.new, product.isBestseller && t.bestseller, product.oneOfAKind && t.oneOfAKind].filter(Boolean);

  const details = [
    { title: t.materials, body: <ul className="list-inside list-disc space-y-1">{product.materials.map((m) => <li key={m.tr}>{m[lang]}</li>)}</ul> },
    { title: t.size, body: <p>{product.size[lang]}</p> },
    { title: t.care, body: <p>{t.careText}</p> },
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div aria-hidden="true" className="blob absolute -right-32 top-10 size-[30rem] blur-3xl" style={{ background: product.art.bg[1], opacity: 0.35 }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link href={`/${lang}/collection`} className="group inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-terracotta">
            <ArrowIcon className="size-4 rotate-180 transition group-hover:-translate-x-1" />
            {t.back}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ProductGallery product={product} name={name} views={t.views} />
            </Reveal>

            <Reveal delay={0.15}>
              <div className="lg:sticky lg:top-28">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{category}</span>
                  {badges.map((b) => (
                    <span key={String(b)} className="rounded-full bg-mustard/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-clay">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h1 className="font-serif text-5xl leading-tight text-ink sm:text-6xl">{name}</h1>
                  <FavoriteButton slug={product.slug} labels={{ add: t.addFav, remove: t.removeFav }} className="mt-2 shrink-0 border border-line" />
                </div>
                <p className="mt-2 font-hand text-2xl text-terracotta">{product.short[lang]}</p>
                <p className="mt-6 font-serif text-4xl text-ink">{price}</p>
                <p className="mt-6 text-lg leading-relaxed text-muted">{product.description[lang]}</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappLink(t.whatsappMsg(name, price, `${site.url}/${lang}/collection/${product.slug}`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
                  >
                    <WhatsappIcon className="size-5" />
                    {t.orderWhatsapp}
                  </a>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-ink/80 px-7 py-4 font-semibold text-ink transition hover:bg-ink hover:text-cream"
                  >
                    <InstagramIcon className="size-5" />
                    {t.askInstagram}
                  </a>
                </div>
                <p className="mt-4 text-sm text-muted">✦ {t.shipping}</p>

                <div className="mt-10 divide-y divide-line border-y border-line">
                  {details.map((d, i) => (
                    <details key={d.title} className="group py-5" open={i === 0}>
                      <summary className="flex cursor-pointer items-center justify-between font-serif text-xl text-ink">
                        {d.title}
                        <PlusIcon className="size-5 text-terracotta transition duration-300 group-open:rotate-45" />
                      </summary>
                      <div className="pt-3 text-muted">{d.body}</div>
                    </details>
                  ))}
                </div>
                <p className="mt-6 font-hand text-xl text-muted">{t.handmade}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink sm:text-5xl">{t.related}</h2>
        </Reveal>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {[...related, ...fill].map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <ProductCard product={p} locale={lang} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
