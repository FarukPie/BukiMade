import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getDict, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).nav.faq : undefined };
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const f = t.faq;

  return (
    <>
      <PageHeader eyebrow={t.nav.faq} title={f.title} subtitle={f.subtitle} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {f.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <details className="group rounded-3xl border border-line bg-paper px-6 py-5 transition open:shadow-lg sm:px-8">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-serif text-xl text-ink">
                  {item.q}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-terracotta transition duration-300 group-open:rotate-45 group-open:bg-terracotta group-open:text-[#fffaf3]">
                    <PlusIcon className="size-5" />
                  </span>
                </summary>
                <p className="pt-4 leading-relaxed text-muted">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <aside className="rounded-[2.5rem] bg-[#2a1d16] p-8 text-[#f7efe3] sm:p-10 lg:sticky lg:top-28">
            <p className="font-hand text-3xl text-mustard">✦ {f.careTitle}</p>
            <ul className="mt-6 space-y-5">
              {f.care.map((c, i) => (
                <li key={c} className="flex gap-4">
                  <span className="font-serif text-2xl italic text-mustard">0{i + 1}</span>
                  <span className="pt-1 opacity-85">{c}</span>
                </li>
              ))}
            </ul>
            <Link href={`/${lang}/contact`} className="mt-8 inline-block font-semibold text-mustard underline-offset-4 hover:underline">
              {t.nav.contact} →
            </Link>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
