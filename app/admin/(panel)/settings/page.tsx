import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { fetchFresh, readDict, readSettings } from "@/lib/server/content";
import { publicImageUrl } from "@/lib/server/db";

export const metadata: Metadata = { title: "İletişim ve kategori görselleri" };

export default async function SettingsPage() {
  await requireAdmin();
  const { settings, dict } = await fetchFresh();
  return (
    <>
      <PageTitle eyebrow="Ayarlar" title="İletişim ve kategori görselleri" description="Sipariş butonlarının kullandığı iletişim bilgileri ve ana sayfadaki kategori kapakları." />
      <SettingsForm initial={readSettings(settings)} categoryLabels={readDict(dict).tr.categories} imageBase={publicImageUrl("").replace(/\/$/, "")} />
    </>
  );
}
