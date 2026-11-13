"use client";

import { THEME_KEY } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      // Depolama kapalıysa tema yalnızca bu sayfa için değişir
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-sand"
    >
      {/* Hangi ikonun görüneceğini CSS seçer: hidrasyon uyumsuzluğu olmaz */}
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </button>
  );
}
