import { KnotMark } from "../Icons";
import { ProductArt } from "../ProductArt";
import type { Art } from "@/lib/products";

// Marka panelindeki kolaj için sabit çizimler (veritabanına bağlı değil).
const arts: Art[] = [
  { kind: "necklace", cord: "#d9a441", accent: "#c2643c", bead: "#f2c14e", pattern: "spiral", bg: ["#fbefd5", "#f0c987"] },
  { kind: "bracelet", cord: "#3f8f8c", accent: "#f3ece0", bead: "#f3ece0", pattern: "chevron", bg: ["#e2f0ec", "#9fd0c6"] },
  { kind: "earrings", cord: "#c2643c", accent: "#d9a441", bead: "#d4af37", pattern: "chevron", bg: ["#f9e0cf", "#eda97f"] },
];

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${light ? "text-[#f7efe3]" : "text-ink"}`}>
      <KnotMark className={`size-9 ${light ? "text-mustard" : "text-terracotta"}`} />
      <span className="font-serif text-2xl font-semibold">
        Buki<span className={`font-hand text-3xl font-normal ${light ? "text-mustard" : "text-terracotta"}`}>Made</span>
      </span>
    </div>
  );
}

/** Giriş ve şifre ekranlarının ortak düzeni: solda marka paneli, sağda form. */
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-[#2a1d16] p-12 text-[#f7efe3] lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="blob absolute -left-24 -top-24 size-[26rem] bg-terracotta/25 blur-3xl" />
        <div aria-hidden="true" className="blob absolute -bottom-32 right-0 size-[30rem] bg-mustard/15 blur-3xl" />
        <div className="relative">
          <Logo light />
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-4 py-10" aria-hidden="true">
          {arts.map((art, i) => (
            <div
              key={i}
              className={`w-1/3 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-[#f7efe3]/10 shadow-2xl ${
                i === 1 ? "-translate-y-8 scale-110" : i === 0 ? "-rotate-6" : "rotate-6"
              }`}
            >
              <ProductArt art={art} id={`auth-${i}`} className="block aspect-[4/5] w-full" />
            </div>
          ))}
        </div>

        <div className="relative">
          <p className="font-hand text-4xl leading-tight text-mustard">Her düğümde bir hikaye</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-70">
            Ürünlerini, fotoğraflarını ve sitedeki tüm yazıları buradan yönet. Yaptığın her değişiklik birkaç saniyede yayında.
          </p>
        </div>
      </aside>

      <section className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-10">
        <div aria-hidden="true" className="blob absolute -right-32 -top-32 size-96 bg-mustard/20 blur-3xl lg:hidden" />
        <div aria-hidden="true" className="blob absolute -bottom-32 -left-32 size-96 bg-terracotta/15 blur-3xl lg:hidden" />
        <div className="relative w-full max-w-[25rem]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-ink">{title}</h1>
          {subtitle && <div className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</div>}
          <div className="mt-8 rounded-[2rem] border border-line/80 bg-paper p-6 shadow-[0_24px_60px_-30px_rgba(59,42,32,0.45)] sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </section>
    </main>
  );
}
