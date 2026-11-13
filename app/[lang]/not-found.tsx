import Link from "next/link";
import { getDict } from "@/lib/i18n";

// not-found parametre almaz; Türkçe varsayılan, İngilizce alt satırda.
export default function NotFound() {
  const tr = getDict("tr").notFound;
  const en = getDict("en").notFound;
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-32 text-center">
      <p className="font-serif text-[8rem] italic leading-none text-terracotta sm:text-[12rem]">404</p>
      <h1 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">{tr.title}</h1>
      <p className="mt-3 text-muted">
        {tr.text} <span className="opacity-70">/ {en.text}</span>
      </p>
      <Link href="/tr" className="mt-10 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg transition hover:bg-clay">
        {tr.cta}
      </Link>
    </section>
  );
}
