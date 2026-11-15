"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

/** İkonlu giriş alanı; şifre alanlarında göster / gizle düğmesi. */
export function IconInput({
  id,
  label,
  icon,
  type = "text",
  hint,
  ...rest
}: { id: string; label: string; icon: React.ReactNode; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition group-focus-within:text-terracotta">{icon}</span>
        <input
          id={id}
          name={id}
          type={isPassword && show ? "text" : type}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`w-full rounded-2xl border border-line bg-cream/60 py-3 pl-11 text-[15px] text-ink outline-none transition hover:border-muted/50 focus:border-terracotta focus:bg-paper focus:ring-4 focus:ring-terracotta/15 ${isPassword ? "pr-12" : "pr-4"}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-pressed={show}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
          >
            {show ? <EyeOffIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
          </button>
        )}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
