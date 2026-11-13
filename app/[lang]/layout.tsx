import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", axes: ["SOFT", "opsz"] });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope" });
const caveat = Caveat({ subsets: ["latin", "latin-ext"], variable: "--font-caveat" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "tr";
  const t = getDict(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} · ${t.hero.eyebrow}`, template: `%s · ${site.name}` },
    description: t.hero.subtitle,
    alternates: { languages: { tr: "/tr", en: "/en" } },
    openGraph: { siteName: site.name, locale: locale === "tr" ? "tr_TR" : "en_US", type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1511" },
  ],
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={lang} suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable} ${caveat.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-dvh overflow-x-clip font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
          {lang === "tr" ? "İçeriğe geç" : "Skip to content"}
        </a>
        <Header locale={lang} nav={t.nav} />
        <main id="main">{children}</main>
        <Footer locale={lang} t={t} />
      </body>
    </html>
  );
}
