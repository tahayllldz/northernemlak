# NorthernEmlak — Proje Bağlamı

Bu dosyayı her oturum başında oku. Proje kararları burada; yeniden tartışma, uygula.

## Proje nedir

Kuzey Kıbrıs (KKTC) emlak ilan platformu. Beta Studio'nun ürünü, bir müşteriye satılacak.
Referans/rakip: **101evler.com** (32.343 satılık ilan, 6 dil, 2015'ten beri, pazar lideri).

Ticari model: ~$7.000 kurulum + $600–700/ay işletme. Teknik işletme Beta Studio'da,
içerik moderasyonu müşteride. Kaynak kod **devredilmiyor, lisanslanıyor** — ürün başka
pazarlara tekrar satılacak.

**Şu anki durum: PROTOTİP.** Müşteri sunumu için yapıldı, henüz onay yok.
Faz 1'e müşteri "evet" demeden başlama.

## Kesinleşmiş kararlar — değiştirme

| Konu | Karar |
|---|---|
| Tasarım yönü | **Akdeniz Editoryal** — Compass / Sotheby's hissi, 101evler'in zıddı |
| Palet | kum `#F5F0E8` · derin deniz `#1B4D5C` · terrakota `#C4663A` · mürekkep `#1C2024` · sis `#5A666F` |
| Tipografi | Playfair Display (başlık, serif) + Inter (gövde). `@fontsource-variable`, Google Fonts CDN değil |
| Kart | 4:3 büyük fotoğraf, minimal metin, altında fiyat. Fotoğraf birinci sınıf vatandaş |
| Diller | Prototip TR/EN/RU · tam sürüm +DE, FA (RTL), PL |
| Baz para birimi | **GBP** — KKTC'de fiyatlar sterlin. TRY/EUR/USD sadece gösterim |
| AI sağlayıcı | **Gemini 2.5 Flash Image** (`gemini-2.5-flash-image`), $0.039/görsel. Test edildi, mimariyi koruyor |
| AI modeli | Önceden üretim — ilan yüklenirken 4 stil üretilir. Ziyaretçi anlık üretim yapmaz |
| AI stilleri | Akdeniz · Modern Minimal · Sıcak İskandinav · Modern Lüks |

## Kod kuralları

- Değişken, fonksiyon, dosya adları **Türkçe** (`ilanlariSuz`, `fiyatYaz`, `sozluk.ts`).
  Framework API'leri İngilizce kalır. Tutarlılığı bozma.
- Next.js App Router, `params` bir **Promise** — `await params`.
- Tailwind 4. **Kaynak `app/globals.tailwind.css`**, `@theme` bloğu orada.
  `app/globals.css` üretilmiş çıktıdır, elle düzenlenmez — `npm run css` üretir ve
  `npm run build` içinde otomatik çalışır (Vercel'de sorunsuz). Bu makinede Application
  Control `.node` ikililerini engellediği için yerelde derlenemez; depodaki kopya
  yalnızca `npm run dev` için fallback'tir. Rastgele hex kullanma.
- Fontlar `app/layout.tsx` içinde JS import ile gelir (`@fontsource-variable/...`),
  CSS `@import` ile değil — derleme sonrası elle geri ekleme derdi böylece bitti.
- Metinler `lib/sozluk.ts` içinde, `t("anahtar", dil)` ile. Sayfaya sabit metin yazma.
- Görseller `next/image`. Sürüklenebilir alanlarda `draggable={false}` + `pointer-events-none`
  (sürükleme, fare olaylarını yutuyor — AiTasarim'da bu yüzden Pointer Events kullanıldı).

## Dosya yapısı

```
app/[dil]/            TR/EN/RU · page.tsx (ana) · ilan/ (liste) · ilan/[slug]/ (detay) · emlakci/
components/           Ustbilgi, IlanKarti, AiTasarim, Galeri, Filtreler, EmlakciKarti, Ayarlar…
lib/tipler.ts         veri modeli
lib/veri.ts           23 demo ilan — OTOMATIK ÜRETİLDİ, elle düzenleme
lib/sozluk.ts         3 dil metinleri
lib/yardimci.ts       filtreleme, fiyat/tarih biçimleme, şehir-tip adları
public/gorsel/{ilan,oda,ai}/   temsilî görseller + 40 AI render
```

## Prototipte OLMAYANLAR (Faz 1 kapsamı)

Emlakçı paneli · admin moderasyon kuyruğu · auth/roller/RLS · lead sistemi ·
harita (MapLibre + MapTiler) · 6 dil · ödeme/paket · SEO altyapısı (hreflang, JSON-LD, sitemap) ·
veritabanı (şu an `lib/veri.ts` statik — Supabase/Postgres'e taşınacak).

## Faz 1'de eklenecek kritik alanlar (rakipte yok, farklılaştırıcı)

- **Tapu tipi** zorunlu alan: Türk Koçanı / Eşdeğer / TMD-Tahsis / Leasehold — prototipte var, koru
- **Yabancı alıcı uygunluk** göstergesi (2026 düzenlemesi)
- **Site aidatı** alanı
- Lisanslı emlakçı ruhsat doğrulama rozeti
- Mükerrer ilan tespiti (perceptual hash)
- XML/CSV toplu ilan aktarımı — emlakçının **kendi** portföyü (rakip siteden çekme yok, ToS ihlali)
- 30 günlük ilan tazeleme döngüsü

## Sonradan alınan kararlar (18 Eylül 2026 — arayüz turu)

- **`sis` tonu `#6B7780` → `#5A666F` koyulaştırıldı.** Eski ton sayfanın asıl zemini
  olan `kum-100` üstünde 4.05:1 veriyordu, WCAG AA'da kalıyordu. Yeni ton 5.19:1.
  Palet yönü değişmedi, sadece erişilebilirlik eşiği geçildi. `kum-400` artık **metin
  rengi olarak kullanılmaz** (beyaz üstünde 2.0:1) — yalnızca kenarlık/zemin.
- **İlan kartında kap yok.** Gölge, çerçeve ve yükselme hareketi kaldırıldı; fotoğraf
  karttır (Compass + Airbnb modeli). Fotoğraf üstünde en fazla iki rozet + zorunlu
  "temsilî" damgası. Yeniden gölge/çerçeve ekleme.
- **Kartta tapu tipi görünür.** Rakibin yapısal tapu alanı yok, bilgiyi başlığa CAPS
  LOCK'la sıkıştırıyor. Kart üstündeki tapu çipi ürünün tek en güçlü farkı — kaldırma.
  Yabancı kısıtı **yalnızca kısıtlıyken** gösterilir (olumsuz bilgi şaşırtıcı olandır).
- **Ücretli yerleşim ifşası zorunlu.** `vitrin` ilanlar "Öne çıkarılmış" etiketi taşır
  ve liste altında bir cümlelik ifşa notu görünür (funda.nl modeli). Kaldırma.
- Erişilebilirlik tabanı: `:focus-visible` halkası, `prefers-reduced-motion`,
  "içeriğe atla" bağlantısı, `#icerik` çıpası. Bozma.
- Detaylı gerekçeler: `analiz/arayuz-analizi.md`.

## Uyarılar

- **AI kotası** paket bazlı sınırlanacak + aylık bütçe tavanı + %80 alarmı. Kotasız bırakma.
- AI görsellerinde **filigran zorunlu**: "AI ile oluşturuldu — temsilîdir" + öncesi/sonrası sürgüsü.
- Ödeme: Stripe KKTC'yi desteklemiyor. Yerel sanal POS müşterinin sorumluluğu, Faz 3'e bırakıldı.
- Tüm demo görselleri Pexels'ten, **temsilî**. Sitede bu ibare her yerde görünür kalmalı.

## Yardımcı scriptler (proje dışında, üst klasörde)

`bakeoff/ai-uret.mjs` — AI render üretir (`.env` içinde `GOOGLE_API_KEY`)
`bakeoff/run.mjs` — model karşılaştırma (üretim kararı için, şimdilik gerekmiyor)
`bakeoff/fotograf-indir.mjs` — Pexels'ten temsilî görsel indirir
