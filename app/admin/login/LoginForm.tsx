"use client";

import { useActionState } from "react";
import { IconInput } from "@/components/admin/Field";
import { LockIcon, ShieldIcon, UserIcon } from "@/components/admin/icons";
import { buttonClass, Notice } from "@/components/admin/ui";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-5">
      <IconInput
        id="username"
        label="Kullanıcı adı"
        icon={<UserIcon className="size-[18px]" />}
        required
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={64}
        autoFocus
      />
      <IconInput id="password" label="Şifre" type="password" icon={<LockIcon className="size-[18px]" />} required autoComplete="current-password" maxLength={200} />
      <Notice state={state} />
      <button type="submit" disabled={pending} className={`${buttonClass} w-full py-3 text-[15px]`}>
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldIcon className="size-4" /> Bağlantın şifreli ve korumalı
      </p>
    </form>
  );
}
