"use client";

import { useActionState } from "react";
import { IconInput } from "@/components/admin/Field";
import { KeyIcon, LockIcon } from "@/components/admin/icons";
import { buttonClass, Notice } from "@/components/admin/ui";
import { changePasswordAction } from "../actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  const lock = <LockIcon className="size-[18px]" />;
  return (
    <form action={action} className="space-y-5">
      <IconInput id="current" label="Mevcut şifre" type="password" icon={lock} required autoComplete="current-password" maxLength={200} autoFocus />
      <IconInput
        id="next"
        label="Yeni şifre"
        type="password"
        icon={<KeyIcon className="size-[18px]" />}
        required
        minLength={10}
        autoComplete="new-password"
        maxLength={200}
        hint={'En az 10 karakter; en az bir harf ve bir rakam. "admin" gibi tahmin edilebilir kelimeler içermesin.'}
      />
      <IconInput id="confirm" label="Yeni şifre (tekrar)" type="password" icon={<KeyIcon className="size-[18px]" />} required minLength={10} autoComplete="new-password" maxLength={200} />
      <Notice state={state} />
      <button type="submit" disabled={pending} className={`${buttonClass} w-full py-3 text-[15px]`}>
        {pending ? "Kaydediliyor…" : "Şifreyi kaydet"}
      </button>
    </form>
  );
}
