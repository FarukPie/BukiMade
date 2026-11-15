// Panelde ortak kullanılan küçük arayüz parçaları.

export const inputClass =
  "w-full rounded-2xl border border-line bg-cream/60 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 hover:border-muted/50 focus:border-terracotta focus:bg-paper focus:ring-4 focus:ring-terracotta/15 disabled:opacity-60";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-[#fffaf3] shadow-md shadow-terracotta/25 transition hover:-translate-y-px hover:bg-clay hover:shadow-lg hover:shadow-terracotta/30 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-terracotta/50 hover:text-terracotta disabled:opacity-60";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-paper px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-60";

export function Notice({ state }: { state?: { error?: string; ok?: string } }) {
  if (!state?.error && !state?.ok) return null;
  return state.error ? (
    <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
      <span aria-hidden="true" className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-red-600 text-[11px] font-bold text-white">!</span>
      {state.error}
    </p>
  ) : (
    <p role="status" className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      <span aria-hidden="true" className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">✓</span>
      {state.ok}
    </p>
  );
}

export function Card({ title, description, children, className = "" }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-line/80 bg-paper p-5 shadow-[0_1px_2px_rgba(59,42,32,0.04),0_12px_32px_-16px_rgba(59,42,32,0.18)] sm:p-7 ${className}`}>
      {title && <h2 className="font-serif text-xl text-ink">{title}</h2>}
      {description && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{description}</p>}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function PageTitle({ title, description, actions, eyebrow }: { title: string; description?: React.ReactNode; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="font-hand text-2xl leading-none text-terracotta">{eyebrow}</p>}
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <div className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</div>}
      </div>
      {actions}
    </div>
  );
}
