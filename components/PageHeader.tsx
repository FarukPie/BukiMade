import { Reveal } from "./Reveal";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
      <div aria-hidden="true" className="blob absolute -right-24 -top-24 size-96 bg-mustard/25 blur-3xl" />
      <div aria-hidden="true" className="blob absolute -left-32 top-20 size-80 bg-terracotta/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          {eyebrow && <p className="font-hand text-2xl text-terracotta sm:text-3xl">{eyebrow}</p>}
          <h1 className="mt-2 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-7xl">{title}</h1>
          {subtitle && <p className="mt-6 max-w-2xl text-lg text-muted">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
