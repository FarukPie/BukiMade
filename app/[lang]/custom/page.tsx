import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomBuilder } from "@/components/CustomBuilder";
import { PageHeader } from "@/components/PageHeader";
import { getDict, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).custom.title : undefined };
}

export default async function CustomPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).custom;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <CustomBuilder locale={lang} />
      </section>
    </>
  );
}
