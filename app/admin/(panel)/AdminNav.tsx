"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, HomeIcon, KeyIcon, SlidersIcon, TextIcon } from "@/components/admin/icons";

const links = [
  { href: "/admin", label: "Genel bakış", short: "Genel", icon: HomeIcon },
  { href: "/admin/products", label: "Ürünler ve resimler", short: "Ürünler", icon: BoxIcon },
  { href: "/admin/texts", label: "Site metinleri", short: "Metinler", icon: TextIcon },
  { href: "/admin/settings", label: "İletişim ve görseller", short: "Ayarlar", icon: SlidersIcon },
  { href: "/admin/password", label: "Şifre", short: "Şifre", icon: KeyIcon },
];

export function AdminNav({ variant }: { variant: "side" | "top" }) {
  const path = usePathname();
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  if (variant === "top") {
    return (
      <nav className="flex gap-1.5 overflow-x-auto px-4 pb-3" aria-label="Panel menüsü">
        {links.map(({ href, short, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                active ? "bg-terracotta text-[#fffaf3] shadow-md shadow-terracotta/25" : "bg-cream text-muted hover:text-ink"
              }`}
            >
              <Icon className="size-4" />
              {short}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Panel menüsü">
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted/80">Menü</p>
      <ul className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-terracotta text-[#fffaf3] shadow-lg shadow-terracotta/25" : "text-muted hover:bg-sand/70 hover:text-ink"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-xl transition ${
                    active ? "bg-white/15" : "bg-cream group-hover:bg-paper"
                  }`}
                >
                  <Icon className="size-[18px]" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
