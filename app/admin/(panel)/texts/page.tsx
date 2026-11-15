import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { requireAdmin } from "@/lib/server/auth";
import { fetchFresh, readDict } from "@/lib/server/content";

export const metadata: Metadata = { title: "Site metinleri" };

export default async function TextsPage() {
  await requireAdmin();
  const { dict } = await fetchFresh();
  return (
    <>
      <PageTitle
        eyebrow="İçerik"
        title="Site metinleri"
        description="Sitedeki tüm yazılar bölüm bölüm burada. Bir bölümü açıp metni değiştirin ve alttaki Kaydet'e basın. Ürün adları ve açıklamaları Ürünler sayfasında."
      />
      <TextsEditor initial={readDict(dict)} />
    </>
  );
}
