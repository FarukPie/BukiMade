# BukiMade — El yapımı makrome takılar

Next.js 16 (App Router) + Tailwind CSS 4 + Motion. Veritabanı yok; tüm veriler `lib/` altındaki mock dosyalardan gelir.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000  (/ → /tr yönlendirir)
npm run build    # üretim derlemesi
```

## Neyi nereden değiştiririm?

| Ne | Dosya |
|---|---|
| WhatsApp numarası, Instagram, e-posta, site adresi | `lib/site.ts` |
| Ürünler (ad, fiyat, açıklama, renkler) | `lib/products.ts` |
| Tüm metinler (TR / EN) | `lib/i18n.ts` |
| Renk paleti, fontlar, dark mode renkleri | `app/globals.css`, `app/[lang]/layout.tsx` |

### Gerçek fotoğraf eklemek
Fotoğrafları `public/images/products/` içine koyun ve ürüne `images` alanı ekleyin:

```ts
images: ["/images/products/gunes-1.jpg", "/images/products/gunes-2.jpg", "/images/products/gunes-3.jpg"],
```

Sıra: ön görünüm, detay, doku. Fotoğraf olmayan görünümlerde çizim gösterilmeye devam eder. Dikey (4:5) oranlı fotoğraflar en iyi sonucu verir.

## Vercel'e yayınlama

1. Projeyi GitHub'a gönderin (`git init`, commit, yeni repo, push).
2. vercel.com → **Add New → Project** → repoyu seçin → **Deploy**. Framework ve komutlar `vercel.json` içinde tanımlı; ek ayar gerekmez.
3. Yayına aldıktan sonra gerçek alan adınızı `lib/site.ts` içindeki `url` alanına yazın (sitemap ve paylaşım linkleri bunu kullanır).

Alternatif: `npx vercel` (CLI) ile doğrudan bu klasörden yayınlayabilirsiniz.

## Sayfalar
`/tr` ana sayfa · `/tr/collection` koleksiyon (kategori filtre + sıralama) · `/tr/collection/[slug]` ürün detayı · `/tr/custom` özel takı tasarlayıcı · `/tr/story` hikaye · `/tr/faq` SSS + bakım · `/tr/contact` iletişim · `/tr/favorites` favoriler. İngilizce için `/en/...`.
