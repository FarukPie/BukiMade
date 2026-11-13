"use client";

import { useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";
import { MailIcon, WhatsappIcon } from "./Icons";

/** Veritabanı yok: mesaj WhatsApp veya e-posta istemcisine aktarılır. */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).contact;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState(false);

  const body = `${form.message.trim()}\n\n— ${form.name.trim()}${form.email.trim() ? ` (${form.email.trim()})` : ""}`;
  const valid = form.name.trim() !== "" && form.message.trim() !== "";

  const send = (channel: "whatsapp" | "mail") => {
    if (!valid) {
      setError(true);
      return;
    }
    const url =
      channel === "whatsapp"
        ? whatsappLink(body)
        : `mailto:${site.email}?subject=${encodeURIComponent(`${site.name} – ${form.name.trim()}`)}&body=${encodeURIComponent(body)}`;
    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener");
  };

  const input = "w-full rounded-2xl border border-line bg-cream px-5 py-4 text-ink outline-none transition placeholder:text-muted/60 focus:border-terracotta";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send("whatsapp");
      }}
      className="space-y-5 rounded-[2.5rem] border border-line bg-paper p-6 shadow-sm sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-2 block text-sm font-semibold text-ink">{t.name} *</label>
          <input id="c-name" required autoComplete="name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-2 block text-sm font-semibold text-ink">{t.email}</label>
          <input id="c-email" type="email" autoComplete="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-2 block text-sm font-semibold text-ink">{t.message} *</label>
        <textarea id="c-msg" required rows={6} maxLength={2000} className={input} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      {error && !valid && (
        <p role="alert" className="text-sm font-semibold text-clay">
          {t.required}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-terracotta px-7 py-4 font-semibold text-[#fffaf3] shadow-lg shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-clay"
        >
          <WhatsappIcon className="size-5" />
          {t.send}
        </button>
        <button
          type="button"
          onClick={() => send("mail")}
          className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-ink/80 px-7 py-4 font-semibold text-ink transition hover:bg-ink hover:text-cream"
        >
          <MailIcon className="size-5" />
          {t.sendMail}
        </button>
      </div>
    </form>
  );
}
