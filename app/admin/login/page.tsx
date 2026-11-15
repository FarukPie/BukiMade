import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/AuthShell";
import { getAdmin } from "@/lib/server/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Giriş" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <AuthShell
      title="Tekrar hoş geldin"
      subtitle="Yönetim paneline girmek için kullanıcı adını ve şifreni yaz."
      footer={
        <a href="/tr" className="font-semibold text-muted transition hover:text-terracotta">
          ← Siteye dön
        </a>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
