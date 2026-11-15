# BukiMade — El yapımı makrome takılar

Next.js 16 (App Router) + Tailwind CSS 4 + Motion + Supabase (veritabanı ve resim deposu).
Site içeriği `/admin` adresindeki yönetim panelinden düzenlenir.

## Kurulum

1. `.env.example` dosyasını `.env.local` olarak kopyalayın ve `SUPABASE_SECRET_KEY` değerini girin
   (Supabase → Project Settings → API Keys → Secret keys). Bu anahtar gizlidir; kimseyle paylaşmayın.
2. Çalıştırın:

```bash
npm install
npm run dev      # http://localhost:3000  (/ → /tr yönlendirir, panel: /admin)
npm run build    # üretim derlemesi
```

## Yönetim paneli (`/admin`)

İlk giriş: kullanıcı adı `admin`, şifre `admin123`. Panel ilk girişte **yeni şifre belirlemeyi zorunlu tutar**.

| Bölüm | Ne değişir |
|---|---|
| Ürünler ve resimler | Ürün ekleme / silme, ad, fiyat, açıklama, malzeme, rozetler, en fazla 3 fotoğraf |
| Site metinleri | Sitedeki tüm yazılar (TR + EN), SSS, yorumlar, hikaye, süreç adımları… |
| İletişim ve kategori görselleri | WhatsApp, Instagram, e-posta, şehir, ana sayfadaki kategori kapakları |
| Şifre | Yönetici şifresi |

Kaydedilen her değişiklik siteye birkaç saniye içinde yansır.

### Güvenlik özeti
- Şifreler `scrypt` ile hash'lenir; düz metin hiçbir yerde saklanmaz.
- Oturum: rastgele token, `httpOnly` + `SameSite=Strict` + (canlıda) `Secure` çerez, 8 saat geçerli. Veritabanında yalnızca token'ın SHA-256 özeti durur.
- Kaba kuvvet koruması: aynı IP'den 15 dakikada 5, aynı kullanıcı adına 20 hatalı denemeden sonra giriş kilitlenir.
- Her admin sayfası ve her sunucu işlemi oturumu ayrıca doğrular. Gelen veri `lib/content-schema.ts` ile doğrulanır.
- Supabase tablolarında RLS açık ve policy yok: veritabanına yalnızca sunucu, gizli anahtarla erişir. Tarayıcıya hiçbir anahtar gitmez.
- Yüklenen dosyanın türü içeriğinden belirlenir; yalnızca JPG / PNG / WebP, en fazla 4 MB. SVG kabul edilmez.
- Güvenlik başlıkları (`next.config.ts`): clickjacking koruması, `nosniff`, admin sayfaları önbelleğe alınmaz ve arama motorlarına kapalı.

## Kod tarafında neyi nereden değiştiririm?

| Ne | Dosya |
|---|---|
| Varsayılan metinler ve yeni metin anahtarı eklemek | `lib/i18n.ts` (panel yeni anahtarı otomatik gösterir) |
| Özel sipariş ip / boncuk seçenekleri ve fiyatları | `lib/products.ts`, `components/CustomBuilder.tsx` |
| Renk paleti, fontlar, koyu tema | `app/globals.css`, `app/[lang]/layout.tsx` |
| Veri okuma ve önbellek | `lib/server/content.ts` |
| Giriş ve oturum | `lib/server/auth.ts`, `app/admin/actions.ts` |

## Vercel'e yayınlama

1. vercel.com → **Add New → Project** → GitHub reposunu seçin.
2. **Environment Variables** bölümüne `SUPABASE_URL` ve `SUPABASE_SECRET_KEY` ekleyin (isteğe bağlı: `NEXT_PUBLIC_SITE_URL`).
3. **Deploy**. Framework ve komutlar `vercel.json` içinde tanımlı.
4. Yayından hemen sonra `/admin` adresine girip varsayılan şifreyi değiştirin.

## Sayfalar
`/tr` ana sayfa · `/tr/collection` koleksiyon (kategori filtre + sıralama) · `/tr/collection/[slug]` ürün detayı · `/tr/custom` özel takı tasarlayıcı · `/tr/story` hikaye · `/tr/faq` SSS + bakım · `/tr/contact` iletişim · `/tr/favorites` favoriler · `/admin` yönetim paneli. İngilizce için `/en/...`.
