# NorthernEmlak — Prototip

Kuzey Kıbrıs emlak platformu prototipi. Next.js 16 + TypeScript + Tailwind 4.

## Çalıştırma

```bash
npm install
npm run dev
```

Sonra tarayıcıda: http://localhost:3000

## Yapı

```
app/[dil]/            TR / EN / RU sayfaları
  page.tsx            ana sayfa
  ilan/page.tsx       filtreli liste
  ilan/[slug]/        ilan detayı (AI Design burada)
  emlakci/            emlakçı listesi
components/           arayüz bileşenleri
lib/veri.ts           23 demo ilan (otomatik üretildi)
lib/sozluk.ts         3 dil metinleri
lib/tipler.ts         veri modeli
public/gorsel/
  ilan/               ilan fotoğrafları (temsilî)
  oda/                boş oda fotoğrafları
  ai/                 AI sanal dekorasyon çıktıları (40 adet)
```

## Notlar

- Tüm görseller **temsilîdir** (Pexels). Gerçek mülkleri yansıtmaz.
- AI render'lar Gemini 2.5 Flash Image ile üretildi (~$0.039/görsel).
- Veri şu an statik dosyada. Faz 1'de Supabase/Postgres'e taşınacak.
- Tasarım yönü: Akdeniz Editoryal — kum #F5F0E8, derin deniz #1B4D5C, terrakota #C4663A.

## Bu prototipte olmayanlar (Faz 1)

Emlakçı paneli, admin moderasyonu, üyelik/giriş, lead sistemi,
6 dil (şu an 3), harita, ödeme, SEO altyapısı.
