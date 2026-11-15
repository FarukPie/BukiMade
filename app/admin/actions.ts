"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { conform, imagePathSchema, productSchema, settingsSchema, type ProductInput } from "@/lib/content-schema";
import { defaults } from "@/lib/i18n";
import {
  RATE_LIMIT_MESSAGE,
  clearFailures,
  clientIp,
  createSession,
  destroyAllSessions,
  destroySession,
  isRateLimited,
  recordFailure,
  requireAdmin,
} from "@/lib/server/auth";
import { refreshSite } from "@/lib/server/content";
import { IMAGE_BUCKET, db } from "@/lib/server/db";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/server/password";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, key: string, max: number) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.slice(0, max) : "";
};

function parseJson(raw: unknown): unknown {
  if (typeof raw !== "string" || raw.length > 500_000) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

const firstIssue = (error: { issues: { message: string; path: PropertyKey[] }[] }) => {
  const issue = error.issues[0];
  return `${issue.path.length ? `${issue.path.join(" › ")}: ` : ""}${issue.message}`;
};

async function removeImages(paths: string[]) {
  const safe = paths.filter((p) => imagePathSchema.safeParse(p).success);
  if (safe.length) await db().storage.from(IMAGE_BUCKET).remove(safe);
}

// ───────────── Giriş / çıkış / şifre ─────────────

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, "username", 64).trim().toLowerCase();
  const password = str(fd, "password", 200);
  if (!username || !password) return { error: "Kullanıcı adı ve şifre gerekli." };

  const ip = await clientIp();
  if (await isRateLimited(ip, username)) return { error: RATE_LIMIT_MESSAGE };

  const { data: user } = await db()
    .from("admin_users")
    .select("id, password_hash, must_change_password")
    .eq("username", username)
    .maybeSingle();
  // Kullanıcı yoksa da hash karşılaştırması yapılır: yanıt süresinden kullanıcı adı tahmin edilemez.
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) {
    await recordFailure(ip, username);
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await clearFailures(ip, username);
  await createSession(user.id);
  redirect(user.must_change_password ? "/admin/password" : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin({ allowPendingPasswordChange: true });
  const current = str(fd, "current", 200);
  const next = str(fd, "next", 200);
  const confirm = str(fd, "confirm", 200);

  const ip = await clientIp();
  if (await isRateLimited(ip, admin.username)) return { error: RATE_LIMIT_MESSAGE };

  const { data: user } = await db().from("admin_users").select("password_hash").eq("id", admin.id).single();
  if (!user || !(await verifyPassword(current, user.password_hash))) {
    await recordFailure(ip, admin.username);
    return { error: "Mevcut şifre hatalı." };
  }
  if (next.length < 10) return { error: "Yeni şifre en az 10 karakter olmalı." };
  if (next !== confirm) return { error: "Yeni şifreler birbiriyle aynı değil." };
  if (next === current) return { error: "Yeni şifre eskisiyle aynı olamaz." };
  const lower = next.toLowerCase();
  if (lower.includes(admin.username) || ["admin123", "password", "1234567890", "bukimade"].some((w) => lower.includes(w))) {
    return { error: "Bu şifre kolay tahmin edilebilir. Kullanıcı adı veya yaygın kelimeler içermesin." };
  }
  if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(next) || !/\d/.test(next)) return { error: "Yeni şifre en az bir harf ve bir rakam içermeli." };

  const { error } = await db()
    .from("admin_users")
    .update({ password_hash: await hashPassword(next), must_change_password: false, updated_at: new Date().toISOString() })
    .eq("id", admin.id);
  if (error) return { error: "Şifre kaydedilemedi, tekrar deneyin." };

  // Diğer cihazlardaki oturumlar kapanır, bu cihaz için yeni oturum açılır.
  await destroyAllSessions(admin.id);
  await clearFailures(ip, admin.username);
  await createSession(admin.id);
  redirect("/admin?password=changed");
}

// ───────────── Metinler ─────────────

export async function saveTextsAction(raw: string): Promise<FormState> {
  await requireAdmin();
  const input = parseJson(raw) as Record<string, unknown> | undefined;
  if (!input || typeof input !== "object") return { error: "Geçersiz veri." };
  const dict = { tr: conform(input.tr, defaults.tr), en: conform(input.en, defaults.en) };
  const { error } = await db().from("site_content").update({ dict, updated_at: new Date().toISOString() }).eq("id", "main");
  if (error) return { error: "Kaydedilemedi, tekrar deneyin." };
  refreshSite();
  return { ok: "Metinler kaydedildi. Site güncellendi." };
}

// ───────────── Ayarlar ─────────────

export async function saveSettingsAction(raw: string): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(parseJson(raw));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const { data: current } = await db().from("site_content").select("settings").eq("id", "main").single();
  const { error } = await db().from("site_content").update({ settings: parsed.data, updated_at: new Date().toISOString() }).eq("id", "main");
  if (error) return { error: "Kaydedilemedi, tekrar deneyin." };

  // Değiştirilen veya kaldırılan kategori görsellerini depodan sil.
  const before = Object.values((current?.settings as { categoryImages?: Record<string, string> })?.categoryImages ?? {});
  const after = new Set(Object.values(parsed.data.categoryImages));
  await removeImages(before.filter((p) => !after.has(p)));

  refreshSite();
  return { ok: "Ayarlar kaydedildi. Site güncellendi." };
}

// ───────────── Ürünler ─────────────

const toRow = (p: ProductInput) => ({
  name: p.name,
  category: p.category,
  price: p.price,
  short: p.short,
  description: p.description,
  materials: p.materials,
  size: p.size,
  art: p.art,
  images: p.images,
  is_new: p.isNew,
  is_bestseller: p.isBestseller,
  one_of_a_kind: p.oneOfAKind,
  sort_order: p.sortOrder,
  updated_at: new Date().toISOString(),
});

export async function saveProductAction(raw: string, mode: "create" | "update"): Promise<FormState> {
  await requireAdmin();
  if (mode !== "create" && mode !== "update") return { error: "Geçersiz işlem." };
  const parsed = productSchema.safeParse(parseJson(raw));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const product = parsed.data;

  if (mode === "create") {
    const { error } = await db().from("products").insert({ slug: product.slug, ...toRow(product) });
    if (error) return { error: error.code === "23505" ? "Bu adres (slug) başka bir üründe kullanılıyor." : "Ürün eklenemedi." };
  } else {
    const { data: existing } = await db().from("products").select("images").eq("slug", product.slug).maybeSingle();
    if (!existing) return { error: "Ürün bulunamadı." };
    const { error } = await db().from("products").update(toRow(product)).eq("slug", product.slug);
    if (error) return { error: "Ürün kaydedilemedi." };
    await removeImages((existing.images as string[]).filter((p) => !product.images.includes(p)));
  }

  refreshSite();
  if (mode === "create") redirect(`/admin/products/${product.slug}?created=1`);
  return { ok: "Ürün kaydedildi. Site güncellendi." };
}

export async function deleteProductAction(slug: string): Promise<FormState> {
  await requireAdmin();
  if (typeof slug !== "string" || slug.length > 80) return { error: "Geçersiz ürün." };
  const { data, error } = await db().from("products").delete().eq("slug", slug).select("images").maybeSingle();
  if (error || !data) return { error: "Ürün silinemedi." };
  await removeImages(data.images as string[]);
  refreshSite();
  redirect("/admin/products?deleted=1");
}

// ───────────── Resim yükleme ─────────────

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Dosya türü uzantıdan veya tarayıcının söylediğinden değil, dosyanın ilk baytlarından belirlenir. */
function sniffImage(buf: Buffer): { ext: "jpg" | "png" | "webp"; type: string } | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}

export async function uploadImageAction(fd: FormData): Promise<{ path?: string; error?: string }> {
  await requireAdmin();
  const folder = fd.get("folder");
  const file = fd.get("file");
  if (folder !== "products" && folder !== "categories") return { error: "Geçersiz klasör." };
  if (!(file instanceof File) || file.size === 0) return { error: "Dosya seçilmedi." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Resim en fazla 4 MB olabilir." };

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return { error: "Yalnızca JPG, PNG veya WebP resim yüklenebilir." };

  const path = `${folder}/${randomUUID()}.${kind.ext}`;
  const { error } = await db().storage.from(IMAGE_BUCKET).upload(path, buf, { contentType: kind.type, cacheControl: "31536000", upsert: false });
  if (error) return { error: "Resim yüklenemedi, tekrar deneyin." };
  return { path };
}
