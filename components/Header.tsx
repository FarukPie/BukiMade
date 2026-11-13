"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { useFavorites } from "@/lib/favorites";
import { site } from "@/lib/site";
import { CloseIcon, HeartIcon, KnotMark, MenuIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ locale, nav }: { locale: Locale; nav: Dict["nav"] }) {
  const pathname = usePathname();
  const favCount = useFavorites().length;
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  // Menü yalnızca açıldığı sayfada açık kalır; sayfa değişince kendiliğinden kapanır.
  const open = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${locale}/collection`, label: nav.collection },
    { href: `/${locale}/story`, label: nav.story },
    { href: `/${locale}/custom`, label: nav.custom },
    { href: `/${locale}/faq`, label: nav.faq },
    { href: `/${locale}/contact`, label: nav.contact },
  ];
  const otherLocale: Locale = locale === "tr" ? "en" : "tr";
  const switchHref = pathname.replace(/^\/(tr|en)/, `/${otherLocale}`);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-cream/80 py-3 shadow-[0_1px_0_var(--c-line)] backdrop-blur-xl" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} className="group flex items-center gap-2 text-ink" aria-label={site.name}>
          <KnotMark className="size-9 text-terracotta transition duration-700 group-hover:rotate-180" />
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Buki<span className="font-hand text-3xl font-normal text-terracotta">Made</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition hover:text-terracotta ${
                isActive(l.href) ? "text-terracotta" : "text-ink"
              }`}
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-terracotta" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={switchHref}
            hrefLang={otherLocale}
            className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest text-ink transition hover:bg-sand"
            title={nav.language}
          >
            {otherLocale}
          </Link>
          <ThemeToggle label={nav.theme} />
          <Link
            href={`/${locale}/favorites`}
            className="relative grid size-10 place-items-center rounded-full text-ink transition hover:bg-sand"
            aria-label={nav.favorites}
            title={nav.favorites}
          >
            <HeartIcon className="size-5" />
            <AnimatePresence>
              {favCount > 0 && (
                <motion.span
                  key={favCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-terracotta text-[10px] font-bold text-paper"
                >
                  {favCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-sand lg:hidden"
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
          >
            {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-4 pb-6 pt-4 sm:px-6">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <Link
                    href={l.href}
                    className={`block border-b border-line py-4 font-serif text-3xl ${isActive(l.href) ? "text-terracotta" : "text-ink"}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
