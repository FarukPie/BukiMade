import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";
import { requireAdmin } from "@/lib/server/auth";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Şifre değiştir" };

export default async function PasswordPage() {
  const admin = await requireAdmin({ allowPendingPasswordChange: true });
  return (
    <AuthShell
      title={admin.mustChangePassword ? "Önce yeni bir şifre" : "Şifre değiştir"}
      subtitle={
        admin.mustChangePassword ? (
          <span className="block rounded-2xl border border-mustard/40 bg-mustard/15 px-4 py-3 text-ink">
            Güvenliğin için ilk girişte varsayılan şifreyi değiştirmen gerekiyor. Panel, yeni şifre belirlenene kadar kilitli.
          </span>
        ) : (
          "Şifre değişince diğer cihazlardaki oturumlar kapanır."
        )
      }
      footer={
        !admin.mustChangePassword && (
          <Link href="/admin" className="font-semibold text-muted transition hover:text-terracotta">
            ← Panele dön
          </Link>
        )
      }
    >
      <PasswordForm />
    </AuthShell>
  );
}
