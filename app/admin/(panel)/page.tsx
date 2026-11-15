import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";
import { ProductArt } from "@/components/ProductArt";
import { BoxIcon, ImageIcon, PlusIcon, SlidersIcon, TextIcon } from "@/components/admin/icons";
import { Notice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { fetchFresh } from "@/lib/server/content";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const admin = await requireAdmin();
  const { password } = await searchParams;
  const { products } = await fetchFresh();
  const withPhotos = products.filter((p) => p.images.length > 0).length;
  const missing = products.length - withPhotos;
  const hour = Number(new Intl.DateTimeFormat("tr-TR", { hour: "numeric", hour12: false, timeZone: "Europe/Istanbul" }).format(new Date()));
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  const stats = [
    { label: "Ürün", value: products.length, tone: "bg-terracotta/12 text-terracotta" },
    { label: "Fotoğraflı ürün", value: withPhotos, tone: "bg-sage/15 text-sage" },
    { label: "Fotoğraf bekleyen", value: missing, tone: "bg-mustard/20 text-clay" },
  ];

  const tiles = [
    { href: "/admin/products", icon: BoxIcon, title: "Ürünler ve resimler", text: "Ekle, düzenle, sil; ürün fotoğraflarını yükle ve sırala.", tone: "from-terracotta/15" },
    { href: "/admin/texts", icon: TextIcon, title: "Site metinleri", text: "Ana sayfa, hikaye, SSS, iletişim… tüm yazılar Türkçe ve İngilizce.", tone: "from-mustard/20" },
    { href: "/admin/settings", icon: SlidersIcon, title: "İletişim ve görseller", text: "WhatsApp, Instagram, e-posta ve kategori kapak fotoğrafları.", tone: "from-sage/20" },
  ];

  const preview = products.slice(0, 3);

  return (
    <>
      {password === "changed" && (
        <div className="mb-6">
          <Notice state={{ ok: "Şifren değiştirildi. Diğer cihazlardaki oturumlar kapatıldı." }} />
        </div>
      )}

      {/* Karşılama */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#2a1d16] p-7 text-[#f7efe3] shadow-xl sm:p-10">
        <div aria-hidden="true" className="blob absolute -right-16 -top-24 size-80 bg-terracotta/30 blur-3xl" />
        <div aria-hidden="true" className="blob absolute -bottom-28 left-1/3 size-72 bg-mustard/15 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-hand text-3xl text-mustard">{greeting}, {admin.username}</p>
            <h1 className="mt-2 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">Atölyende bugün neyi güncellemek istersin?</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed opacity-70">Yaptığın her kayıt siteye birkaç saniye içinde yansır.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-mustard px-5 py-2.5 text-sm font-semibold text-[#2a1d16] transition hover:-translate-y-px hover:bg-[#f0c060]">
                <PlusIcon className="size-4" /> Yeni ürün ekle
              </Link>
              <a href="/tr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#f7efe3]/25 px-5 py-2.5 text-sm font-semibold transition hover:border-mustard hover:text-mustard">
                Siteyi aç ↗
              </a>
            </div>
          </div>
          {preview.length > 0 && (
            <div className="hidden items-end gap-3 md:flex" aria-hidden="true">
              {preview.map((p, i) => (
                <div key={p.slug} className={`w-24 overflow-hidden rounded-t-full rounded-b-2xl border-4 border-[#f7efe3]/10 shadow-2xl ${i === 1 ? "-translate-y-5" : ""}`}>
                  <ProductArt art={{ ...p.art, kind: p.category }} id={`dash-${p.slug}`} className="block aspect-[4/5] w-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sayılar */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-3xl border border-line/80 bg-paper p-5 shadow-sm">
            <span className={`grid size-12 place-items-center rounded-2xl font-serif text-2xl ${s.tone}`}>{s.value}</span>
            <p className="text-sm font-semibold text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {missing > 0 && (
        <Link
          href="/admin/products"
          className="mt-4 flex items-center gap-3 rounded-3xl border border-dashed border-mustard/60 bg-mustard/10 px-5 py-4 text-sm transition hover:bg-mustard/15"
        >
          <ImageIcon className="size-5 shrink-0 text-clay" />
          <span>
            <strong>{missing} üründe</strong> henüz gerçek fotoğraf yok; sitede çizim gösteriliyor. Fotoğraf eklemek için tıkla.
          </span>
        </Link>
      )}

      {/* Hızlı erişim */}
      <h2 className="mt-12 font-serif text-2xl text-ink">Hızlı erişim</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {tiles.map(({ href, icon: Icon, title, text, tone }) => (
          <Link
            key={href}
            href={href}
            className={`group relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-br ${tone} to-paper to-60% p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-paper text-terracotta shadow-sm transition group-hover:scale-110">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-serif text-xl text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
              Aç <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
