import type { Metadata } from "next";
import { Caveat, Fraunces, Manrope } from "next/font/google";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", axes: ["SOFT", "opsz"] });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope" });
const caveat = Caveat({ subsets: ["latin", "latin-ext"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli · BukiMade", template: "%s · BukiMade Yönetim" },
  robots: { index: false, follow: false },
};

// Admin sayfaları her istekte oturum kontrolü yapar; asla önbelleğe alınmaz.
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="grain min-h-dvh bg-cream font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
