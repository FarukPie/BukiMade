import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { InstagramIcon, MailIcon, WhatsappIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getDict, isLocale } from "@/lib/i18n";
import { instagramLink, site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getDict(lang).nav.contact : undefined };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).contact;

  const channels = [
    { icon: WhatsappIcon, label: "WhatsApp", value: `+${site.whatsapp}`, href: whatsappLink(lang === "tr" ? "Merhaba!" : "Hello!"), color: "bg-[#25d366]/15 text-[#1a9e4b]" },
    { icon: InstagramIcon, label: "Instagram", value: `@${site.instagram}`, href: instagramLink, color: "bg-terracotta/15 text-terracotta" },
    { icon: MailIcon, label: "E-mail", value: site.email, href: `mailto:${site.email}`, color: "bg-mustard/20 text-clay" },
  ];

  return (
    <>
      <PageHeader eyebrow="✦ ✦ ✦" title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <ContactForm locale={lang} />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-hand text-3xl text-terracotta">{t.channels}</h2>
          <ul className="mt-6 space-y-4">
            {channels.map(({ icon: Icon, label, value, href, color }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-3xl border border-line bg-paper p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className={`grid size-14 place-items-center rounded-2xl ${color} transition group-hover:scale-110`}>
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{label}</span>
                    <span className="block break-all font-semibold text-ink">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-hand text-2xl text-muted">
            {t.hours} · {site.city[lang]}
          </p>
        </Reveal>
      </section>
    </>
  );
}
