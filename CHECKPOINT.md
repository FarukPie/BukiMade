# BukiMade — Checkpoint

> Son güncelleme: 2026-11-15 · Son commit: `2e081a9` (ilk sürüm) + admin paneli (henüz commit edilmedi)
>
> İşaretler: `[x]` yapıldı · `[ ]` yapılacak · `[~]` kısmen / geçici değerle duruyor
>
> Bu dosyayı her önemli adımdan sonra güncelleyin: tamamlanan maddeyi `[x]` yapın, tarihi ve commit'i değiştirin.

## Özet

El yapımı makrome takı vitrini. Next.js 16 (App Router) + Tailwind CSS 4 + Motion + **Supabase** (veritabanı ve resim deposu).
Ödeme sistemi yok; sipariş WhatsApp / e-posta üzerinden alınıyor. TR / EN iki dilli.
Ürünler, tüm metinler, iletişim bilgileri ve görseller **`/admin` panelinden** yönetiliyor.

- Supabase projesi: `bukimade` (`uqcibwzldhlpougclgjw`, Frankfurt)
- Ortam değişkenleri: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (bkz. `.env.example`)

---

## 1. Yapılanlar

### Altyapı
- [x] Next.js 16 + React 19 + Tailwind 4 + Motion kurulumu
- [x] `/` → `/tr` yönlendirmesi, güvenlik başlıkları (`next.config.ts`)
- [x] Vercel ayarı, bölge `fra1` (`vercel.json`)
- [x] GitHub reposu bağlı (`origin` → `FarukPie/BukiMade`)
- [x] Supabase projesi, tablolar (`products`, `site_content`, `admin_users`, `admin_sessions`, `login_attempts`), resim deposu (`images`)
- [x] 12 ürün dosyadan veritabanına aktarıldı
- [x] `npm run build` hatasız (2026-11-15)

### Admin paneli (`/admin`)
- [x] Giriş ekranı (`app/admin/login`) · ilk giriş `admin` / `admin123`
- [x] İlk girişte zorunlu şifre değişimi (`app/admin/password`)
- [x] Ürünler: ekle, düzenle, sil, en fazla 3 fotoğraf yükle / sırala / kaldır (`app/admin/(panel)/products`)
- [x] Site metinleri: tüm yazılar TR + EN, arama, liste öğesi ekle / sil (`components/admin/TextsEditor.tsx`)
- [x] İletişim bilgileri + kategori kapak görselleri (`app/admin/(panel)/settings`)
- [x] Kayıttan sonra site anında yenileniyor (`refreshSite()` → `lib/server/content.ts`)

### Güvenlik (test edildi, 2026-11-15)
- [x] Şifre scrypt ile hash'leniyor (`lib/server/password.ts`)
- [x] Oturum: rastgele token, `httpOnly` + `SameSite=Strict` + `Secure` çerez, 8 saat, veritabanında yalnızca özeti (`lib/server/auth.ts`)
- [x] Kaba kuvvet kilidi: IP başına 15 dk'da 5, kullanıcı başına 20 hatalı deneme
- [x] Oturumsuz panel sayfası ve işlem çağrısı → giriş sayfasına yönlendiriliyor, hiçbir şey kaydedilmiyor
- [x] Başka siteden gönderilen form reddediliyor (CSRF)
- [x] Çıkış ve şifre değişiminden sonra eski oturum çerezi geçersiz
- [x] Gelen veri doğrulanıyor; bilinmeyen alanlar atılıyor, HTML düz metin olarak gösteriliyor (`lib/content-schema.ts`)
- [x] Yükleme: türü dosya içeriğinden belirleniyor, yalnızca JPG / PNG / WebP, en fazla 4 MB; SVG reddediliyor
- [x] Silinen / değiştirilen fotoğraflar depodan da siliniyor
- [x] Supabase'de RLS açık, policy yok: tarayıcıdan veritabanına erişim kapalı
- [x] `/admin` arama motorlarına kapalı (`robots.txt` + `X-Robots-Tag`)

### Herkese açık site
- [x] Sayfalar: ana sayfa, koleksiyon, ürün detayı, özel sipariş, hikayem, SSS, iletişim, favoriler, 404
- [x] Panelden eklenen yeni ürünlerin sayfası otomatik oluşuyor
- [x] Belirli ürün adlarına bağımlılık kaldırıldı (ürün silinse de sayfalar çökmez)
- [x] Açık / koyu tema, animasyonlar, SVG ürün çizimleri (fotoğraf yoksa)
- [x] SEO: sayfa başlıkları, `sitemap.xml` (veritabanındaki ürünlerle), `robots.txt`, `hreflang`

---

## 2. Yayından önce mutlaka yapılacaklar

- [ ] **Commit + push**: Admin paneli değişiklikleri henüz commit edilmedi.
- [ ] **Vercel ortam değişkenleri**: `SUPABASE_URL` ve `SUPABASE_SECRET_KEY` Vercel → Settings → Environment Variables'a eklenecek. Eklenmezse derleme hata verir.
- [ ] **Vercel'e yayınlama**: Repo bağlanıp ilk yayın yapılacak.
- [ ] **İlk girişte şifreyi değiştirin**: `/admin` → `admin` / `admin123` → yeni güçlü şifre. Yayından hemen sonra yapın.
- [~] **İletişim bilgileri** (panel → İletişim): WhatsApp `905000000000` geçici; e-posta ve Instagram doğru mu kontrol edin.
- [ ] **Gerçek ürün fotoğrafları** (panel → Ürünler): Henüz hiçbir üründe fotoğraf yok.
- [ ] **Kategori kapak görselleri** (panel → İletişim ve kategori görselleri).
- [~] **Ürün bilgileri**: 12 ürünün adı, fiyatı, açıklaması örnek içerik.
- [~] **Yorumlar ve rakamlar**: Ana sayfadaki yorumlar ve "600+ / 500+" rakamları örnek (panel → Site metinleri).
- [ ] **Hikayem metni** (panel → Site metinleri → Hikayem sayfası).
- [ ] **Site adresi**: Gerçek alan adı alınınca Vercel'e `NEXT_PUBLIC_SITE_URL` olarak ekleyin.

---

## 3. Sonra yapılabilecekler (isteğe bağlı)

- [ ] Yüklenip kaydedilmeden bırakılan fotoğrafları depodan temizleyen bir bakım işi (şu an zararsız ama yer kaplar).
- [ ] Özel sipariş ip / boncuk seçeneklerini ve fiyatlarını panelden yönetmek (şu an `lib/products.ts` ve `components/CustomBuilder.tsx` içinde).
- [ ] Hikayem sayfası için ayrı fotoğraf alanı (şu an ürün fotoğrafları / çizimleri kullanılıyor).
- [ ] Paylaşım görseli (Open Graph resmi).
- [ ] Ürün sayfalarına kendi `hreflang` bağlantıları (şu an ana sayfayı gösteriyor olabilir; kontrol edilmeli).
- [ ] Stok / "tükendi" durumu.
- [ ] Ziyaretçi istatistiği (ör. Vercel Analytics).
- [ ] Lint ve otomatik testler (`package.json`'da yalnızca `dev`, `build`, `start` var).
- [ ] İki aşamalı doğrulama (2FA) ile admin girişi.

---

## Hızlı başvuru: neyi nereden değiştiririm?

| Ne | Nereden |
|---|---|
| Ürünler, fotoğraflar, fiyatlar | Panel → Ürünler ve resimler |
| Sitedeki tüm yazılar | Panel → Site metinleri |
| WhatsApp, Instagram, e-posta, şehir, kategori kapakları | Panel → İletişim ve kategori görselleri |
| Yeni bir metin alanı eklemek (kod) | `lib/i18n.ts` (panel otomatik gösterir) |
| Veri okuma / önbellek (kod) | `lib/server/content.ts` |
| Giriş, oturum, deneme sınırı (kod) | `lib/server/auth.ts`, `app/admin/actions.ts` |
| Renkler, fontlar, koyu tema (kod) | `app/globals.css`, `app/[lang]/layout.tsx` |
