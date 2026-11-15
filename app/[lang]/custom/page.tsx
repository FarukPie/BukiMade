import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomBuilder } from "@/components/CustomBuilder";
import { PageHeader } from "@/components/PageHeader";
import { isLocale } from "@/lib/i18n";
import { getDict, getSiteData } from "@/lib/server/content";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? (await getDict(lang)).custom.title : undefined };
}

export default async function CustomPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { dict, settings } = await getSiteData();
  const t = dict[lang].custom;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <CustomBuilder locale={lang} t={t} categoryLabels={dict[lang].categories} whatsapp={settings.whatsapp} />
      </section>
    </>
  );
}
