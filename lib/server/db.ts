import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const IMAGE_BUCKET = "images";

let client: SupabaseClient | undefined;

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} ortam değişkeni tanımlı değil. .env.example dosyasına bakın.`);
  return value;
}

/**
 * Gizli (service role / secret) anahtarla çalışan istemci. Tablolarda RLS açık ve policy yok;
 * bu yüzden veritabanına yalnızca bu sunucu kodu erişebilir, tarayıcıya hiçbir anahtar gitmez.
 */
export function db() {
  client ??= createClient(env("SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

/** Storage yolunu herkese açık resim adresine çevirir. */
export function publicImageUrl(path: string) {
  return `${env("SUPABASE_URL").replace(/\/+$/, "")}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}
