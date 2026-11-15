import { Logo } from "@/components/admin/AuthShell";
import { ExternalIcon, LogoutIcon } from "@/components/admin/icons";
import { requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "../actions";
import { AdminNav } from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Not: Asıl yetki kontrolü her sayfada ve her action'da ayrıca yapılır; bu yalnızca arayüz içindir.
  const admin = await requireAdmin();
  const initial = admin.username.charAt(0).toUpperCase();

  const logout = (
    <form action={logoutAction}>
      <button type="submit" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-sand hover:text-ink">
        <LogoutIcon className="size-[18px]" />
        Çıkış
      </button>
    </form>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Masaüstü: sol menü */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line/80 bg-paper/80 px-4 py-6 backdrop-blur lg:flex">
        <div className="px-2">
          <Logo />
          <p className="mt-1 pl-11 font-hand text-xl leading-none text-muted">yönetim paneli</p>
        </div>
        <div className="mt-10 flex-1">
          <AdminNav variant="side" />
        </div>
        <a
          href="/tr"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-between rounded-2xl bg-[#2a1d16] px-4 py-3 text-sm font-semibold text-[#f7efe3] transition hover:bg-[#3a2a20]"
        >
          Siteyi görüntüle
          <ExternalIcon className="size-4 text-mustard" />
        </a>
        <div className="flex items-center justify-between border-t border-line/80 pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="grid size-9 place-items-center rounded-full bg-terracotta/15 font-serif text-lg text-terracotta">{initial}</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{admin.username}</p>
              <p className="text-xs text-muted">Yönetici</p>
            </div>
          </div>
          {logout}
        </div>
      </aside>

      {/* Mobil: üst çubuk */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-1">
            <a href="/tr" target="_blank" rel="noopener noreferrer" aria-label="Siteyi görüntüle" className="grid size-10 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink">
              <ExternalIcon className="size-[18px]" />
            </a>
            {logout}
          </div>
        </div>
        <AdminNav variant="top" />
      </header>

      <main className="relative min-w-0 overflow-x-clip">
        <div aria-hidden="true" className="blob pointer-events-none absolute -right-40 -top-40 size-[28rem] bg-mustard/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-12">{children}</div>
      </main>
    </div>
  );
}
