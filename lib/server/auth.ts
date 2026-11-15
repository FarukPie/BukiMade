import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";

const COOKIE = "bm_admin";
const SESSION_HOURS = 8;
const WINDOW_MINUTES = 15;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_PER_USER = 20;

export type Admin = { id: string; username: string; mustChangePassword: boolean; tokenHash: string };

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export async function clientIp() {
  const h = await headers();
  // Vercel bu başlıkları kendisi yazar; istemcinin gönderdiği değerin üzerine yazılır.
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0];
  return (ip?.trim() || "unknown").slice(0, 64);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600_000);
  const { error } = await db().from("admin_sessions").insert({ token_hash: sha256(token), user_id: userId, expires_at: expires.toISOString() });
  if (error) throw new Error("Oturum oluşturulamadı");
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires,
  });
}

/** Geçerli oturumun sahibini döndürür; yoksa null. İstek başına bir kez sorgulanır. */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const tokenHash = sha256(token);
  const { data } = await db()
    .from("admin_sessions")
    .select("expires_at, admin_users(id, username, must_change_password)")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  const user = data?.admin_users as unknown as { id: string; username: string; must_change_password: boolean } | null;
  if (!user) return null;
  return { id: user.id, username: user.username, mustChangePassword: user.must_change_password, tokenHash };
});

/**
 * Her admin sayfasında ve her server action'da çağrılır. Oturum yoksa giriş sayfasına,
 * şifre değiştirilmesi gerekiyorsa şifre sayfasına yönlendirir.
 */
export async function requireAdmin(options: { allowPendingPasswordChange?: boolean } = {}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.mustChangePassword && !options.allowPendingPasswordChange) redirect("/admin/password");
  return admin;
}

export async function destroySession() {
  const admin = await getAdmin();
  if (admin) await db().from("admin_sessions").delete().eq("token_hash", admin.tokenHash);
  (await cookies()).delete(COOKIE);
}

/** Kullanıcının tüm oturumlarını kapatır (şifre değişince eski oturumlar geçersiz olur). */
export async function destroyAllSessions(userId: string) {
  await db().from("admin_sessions").delete().eq("user_id", userId);
}

async function countFails(column: "ip" | "username", value: string) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count, error } = await db()
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq(column, value)
    .gte("attempted_at", since);
  if (error) throw new Error("Deneme sayısı okunamadı");
  return count ?? 0;
}

/** Bu IP veya kullanıcı adı için deneme sınırı aşıldı mı? */
export async function isRateLimited(ip: string, username: string) {
  const [byIp, byUser] = await Promise.all([countFails("ip", ip), countFails("username", username)]);
  return byIp >= MAX_FAILS_PER_IP || byUser >= MAX_FAILS_PER_USER;
}

export async function recordFailure(ip: string, username: string) {
  await db().from("login_attempts").insert({ ip, username: username.slice(0, 64) });
}

export async function clearFailures(ip: string, username: string) {
  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
  await Promise.all([
    db().from("login_attempts").delete().eq("ip", ip),
    db().from("login_attempts").delete().eq("username", username),
    db().from("login_attempts").delete().lt("attempted_at", dayAgo),
    db().from("admin_sessions").delete().lt("expires_at", new Date().toISOString()),
  ]);
}

export const RATE_LIMIT_MESSAGE = `Çok fazla hatalı deneme. ${WINDOW_MINUTES} dakika sonra tekrar deneyin.`;
