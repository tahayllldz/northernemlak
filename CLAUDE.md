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
- **Özellikler artık kod**, görüntü metni değil (`OzellikKodu` + `OZELLIK_ADI`).
  Eskiden `veri.ts` Türkçe metin tutuyordu ve Rusça sayfada Türkçe yazıyordu.
  Yeni özellik eklerken: `tipler.ts` → `sozluk.ts` → `OZELLIK_GRUPLARI`. Metin yazma.
- **Filtre iki katman**: birincil kontroller + hızlı çipler üst çubukta, gerisi
  `FiltrePaneli` içinde (mobilde alttan açılan sayfa). Üst çubuğu şişirme.
- **Harita yerine `Konum` bölümü**: sahte harita yer tutucusu koymuyoruz, gerçek
  hesaplanmış kuş uçuşu mesafe gösteriyoruz (`mesafeler()`). Harita Faz 1'de
  gelince bu bölüm silinmez, yanına gelir.
- **`lang` sarmalayıcı div'de** (`app/[dil]/layout.tsx`). Kök `<html lang="tr">`
  sabit; `text-transform: uppercase` en yakın `lang`'e göre çalışır ve Türkçe
  kuralı İngilizce etiketleri bozuyordu. Kaldırma.
- **Favoriler prototip illüzyonudur** — sadece localStorage, cihaz bazlı.
  Müşteriye "favoriler çalışıyor" denmez; sayfada da bunu söyleyen bir not var.
- **Toplam maliyet hesabı** (`lib/maliyet.ts` + `components/Maliyet.tsx`) — ilan
  fiyatının üstüne binen KDV, tapu devir harcı, damga pulu, avukat, satın alma izni.
  **Oranlar prototip varsayılanıdır, yayın öncesi KKTC avukatına doğrulatılmalı**
  ve Faz 1'de yönetim panelinden düzenlenebilir olmalı. Arayüz bu belirsizliği
  saklamıyor: her kalem oranıyla görünür, "tahmini" ibaresi ve uyarı metni duruyor.
  `Ilan.kdvDahil` zorunlu alan — emlakçı beyan eder.
- **Karşılaştırma favorilerin devamı**, kartın üstünde ayrı bir kontrol değil.
  Kart sade kalsın diye bilerek böyle; karta "karşılaştır" kutusu ekleme.
## Farklılaştırıcı özellikler — ürünün asıl iddiası

Bunlar "güzel olmuş" özellikler değil, ürünün satış argümanı. Silme, sulandırma.

- **360° gezinti** (`components/Gezinti360.tsx`) — bağımlılıksız WebGL silindirik
  panorama görüntüleyici (~120 satır shader). three.js/pannellum **eklenmedi**.
  Kaynak 4:1 panorama, `scripts/panorama-uret.mjs` ile üretiliyor
  (`gemini-3.1-flash-image`; 2.5 bu en-boy oranını desteklemiyor).
  Panoramalar AI üretimi, filigran zorunlu. Gerçek ilanlarda 360 kamera çıkışı
  aynı görüntüleyiciye girer.
- **Tapu zinciri** (`components/TapuZinciri.tsx`) — mülkün tapu sürecinin
  neresinde olduğu. `Ilan.tapuAsama`. Dünyada başka portalda yok; KKTC'ye özel.
- **Geliştirici sicili** (`components/GelistiriciKarti.tsx`) — teslim performansı.
  Yalnızca tartışılmaz olan yayınlanır: ilan edilen vs gerçekleşen teslim.
  Yorum yok, puan yok. Hukuki risk bu yüzden sınırlı tutuldu.
- **Toplam maliyet** (`lib/maliyet.ts`) — oranlar prototip varsayılanı,
  **avukata doğrulatılmadan yayına çıkmaz**.
- **Yatırım getirisi** (`lib/getiri.ts`) — üniversite dönemi mevsimselliğiyle
  (9 ay tam + 3 ay düşük sezon). Kira **uydurulmuyor**: kendi kiralık
  ilanlarımızın m² medyanından geliyor, örnek sayısı ekranda yazıyor.
- **Mükerrer ilan şeffaflığı** (`components/BenzerUyari.tsx`) — çoklu acente
  fiyat farkını gösterir. **Ticari olarak tartışmalı**: gelir emlakçıdan gelir,
  bu özellik alıcıyı korur. Kaldırma kararı müşterinin, bizim değil.
- **Altyapı hazırlığı** — jeneratör/su/güneş. Bölge bazlı kesinti istatistiği
  **yok, çünkü açık veri yok**. Uydurma.
- **Sesli ilan turu** — tarayıcının SpeechSynthesis'i, sıfır maliyet.
  Dil için ses yoksa düğme hiç görünmez.
- **WhatsApp arama takibi** — KKTC'de e-posta ölü. Prototipte demo numaraya
  gider, Faz 1'de platform hattına bağlanır.
- **Görüntüleme rotası** — uçakla gelen alıcı için favorileri coğrafi sıraya dizer.

- Detaylı gerekçeler: `analiz/arayuz-analizi.md`.

## 19 Eylül 2026 — eksiklerin kapatılması

- **Proje katmanı geldi.** `Proje` tipi, 4 demo proje, `/[dil]/proje` liste ve
  `/[dil]/proje/[slug]` detay. Üstbilgideki **Projeler artık gerçek sayfaya gidiyor**
  (eskiden `?tip=rezidans` idi — sahteydi). İlanlar `proje` slug'ı ile bağlanıyor,
  detayda proje bağlantısı çıkıyor. Bu, analizdeki en büyük yapısal boşluktu.
- **Danışman profili** `/[dil]/emlakci/[slug]` — portföy, bölgeler, istatistik.
- **"Mesaj gönder" artık çalışıyor** (`MesajKutusu`): sunucu yok, metin WhatsApp'a
  aktarılıyor ve bu durum kullanıcıya yazıyor. Faz 1'de lead sistemine bağlanır.
- **Sayfalama** (`SAYFA_BOYU = 12`), sunucu tarafında, bağlantıyla — JS'siz de çalışır.
- **Liste sayfasında arama** + aktif arama çipi. `q` artık aktif filtre sayılır,
  "Temizle" aramayı da siler.
- **Sıralama**: m² fiyatı artan/azalan ve son güncellenen eklendi.
- **AI eleme modu** (`AiModListe`): liste sayfasında tek düğmeyle kart kapakları
  AI ile döşenmiş hâline geçiyor. Üç turdur savunduğum şey — AI'nın değeri eleme
  anında, detay sayfasında değil. **Kaldırma.**
- **Kiralama şartları** bölümü: depozito, peşin ay, asgari süre, girişte ödenecek
  toplam. Satılıktaki maliyet bölümünün kiralık karşılığı.
- **Mahremiyet**: test ilanında buzdolabı magnetlerinde yüz görünen iki fotoğraf
  galeriden çıkarıldı (dosyalar duruyor).
- Mobilde filtre çubuğu 198px'e çıkmıştı; arama satırı panele taşındı, 150px.

## Yayın

Canlı: **https://northernemlak.vercel.app** (Vercel, production).

```
vercel deploy --prod --yes
```

`npm run build` önce `npm run css` çalıştırıp Tailwind'i kaynaktan derler.
Vercel Linux'ta derlediği için yerel `.node` engeli sorun çıkarmaz.
Yerelde `npm run dev` depodaki `app/globals.css` kopyasını kullanır; kaynağa
stil eklediysen o kopyaya da elle yansıt, yoksa yerelde görünmez (Vercel'de görünür).

## Kişisel veri kuralı — ihlal etme

- Prototipteki **danışman adları, telefonları ve ruhsat numaraları kurgusaldır**
  ve öyle kalmalı. Telefonlar `+90 533 000 00 0X` — tahsis edilmemiş blok,
  kimseye ulaşmaz. Gerçek numara, gerçek isim, gerçek ruhsat no **girme**.
- Soyisim yok, baş harf var (`Selin K.`). Kimse tanımlanabilir olmasın.
- Danışman kartlarında "Demo kayıt" rozeti ve açıklama notu görünür kalmalı.
- **Rakip siteden görsel/veri alma.** Başka bir sitenin filigranını taşıyan
  fotoğraf yayına girmez (101evler'in telif notu: izinsiz kopyalanamaz).
  Gerçek ilan görselleri yalnızca mülk sahibinin kendi çektiği ham dosyalardan
  gelir; `gercekGorsel: true` ile işaretlenir.

## Uyarılar

- **AI kotası** paket bazlı sınırlanacak + aylık bütçe tavanı + %80 alarmı. Kotasız bırakma.
- AI görsellerinde **filigran zorunlu**: "AI ile oluşturuldu — temsilîdir" + öncesi/sonrası sürgüsü.
- Ödeme: Stripe KKTC'yi desteklemiyor. Yerel sanal POS müşterinin sorumluluğu, Faz 3'e bırakıldı.
- Tüm demo görselleri Pexels'ten, **temsilî**. Sitede bu ibare her yerde görünür kalmalı.

## Yardımcı scriptler (proje dışında, üst klasörde)

`bakeoff/ai-uret.mjs` — AI render üretir (`.env` içinde `GOOGLE_API_KEY`)
`bakeoff/run.mjs` — model karşılaştırma (üretim kararı için, şimdilik gerekmiyor)
`bakeoff/fotograf-indir.mjs` — Pexels'ten temsilî görsel indirir
