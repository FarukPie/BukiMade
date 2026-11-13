import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { instagramLink, site, whatsappLink } from "@/lib/site";
import { InstagramIcon, KnotMark, MailIcon, WhatsappIcon } from "./Icons";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const year = new Date().getFullYear();
  const social = "grid size-11 place-items-center rounded-full border border-[#f7efe3]/20 transition hover:border-mustard hover:text-mustard";
  return (
    <footer className="relative mt-32 overflow-hidden bg-[#2a1d16] text-[#f7efe3]">
      {/* Dalgalı kenar */}
      <svg className="absolute inset-x-0 top-0 h-6 w-full text-cream" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 0h1200v8c-50 0-50 16-100 16S1050 8 1000 8s-50 16-100 16S850 8 800 8s-50 16-100 16S650 8 600 8s-50 16-100 16S450 8 400 8s-50 16-100 16S250 8 200 8s-50 16-100 16S50 8 0 8z"
          fill="currentColor"
        />
      </svg>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-24 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <KnotMark className="size-9 text-mustard" />
            <span className="font-serif text-2xl font-semibold">
              Buki<span className="font-hand text-3xl font-normal text-mustard">Made</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs opacity-70">{t.footer.tagline}</p>
        </div>
        <div>
          <h2 className="font-hand text-2xl text-mustard">{t.footer.explore}</h2>
          <ul className="mt-3 space-y-2 opacity-80">
            <li><Link className="hover:text-mustard" href={`/${locale}/collection`}>{t.nav.collection}</Link></li>
            <li><Link className="hover:text-mustard" href={`/${locale}/story`}>{t.nav.story}</Link></li>
            <li><Link className="hover:text-mustard" href={`/${locale}/custom`}>{t.nav.custom}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-hand text-2xl text-mustard">{t.footer.help}</h2>
          <ul className="mt-3 space-y-2 opacity-80">
            <li><Link className="hover:text-mustard" href={`/${locale}/faq`}>{t.nav.faq}</Link></li>
            <li><Link className="hover:text-mustard" href={`/${locale}/contact`}>{t.nav.contact}</Link></li>
            <li><Link className="hover:text-mustard" href={`/${locale}/favorites`}>{t.nav.favorites}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-hand text-2xl text-mustard">{t.footer.follow}</h2>
          <div className="mt-4 flex gap-3">
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
              <InstagramIcon className="size-5" />
            </a>
            <a href={whatsappLink(locale === "tr" ? "Merhaba!" : "Hello!")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
              <WhatsappIcon className="size-5" />
            </a>
            <a href={`mailto:${site.email}`} aria-label="E-mail" className={social}>
              <MailIcon className="size-5" />
            </a>
          </div>
          <p className="mt-4 text-sm opacity-60">@{site.instagram}</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-[#f7efe3]/10 px-4 py-6 text-sm sm:flex-row sm:px-6">
        <p className="opacity-50">
          © {year} {site.name}. {t.footer.rights}
        </p>
        <p className="font-hand text-xl opacity-70">{t.footer.made} ♡</p>
      </div>
      <div aria-hidden="true" className="pointer-events-none select-none whitespace-nowrap text-center font-serif text-[22vw] leading-[0.8] opacity-[0.04]">
        BukiMade
      </div>
    </footer>
  );
}
