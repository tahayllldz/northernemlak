# Arayüz Analizi — NorthernEmlak

Tarih: 18 Eylül 2026 · Kapsam: ziyaretçi tarafı arayüz · Durum: **kod yazılmadı**

---

## 0. Önce yöntem ve dürüstlük notu

11 sitenin 9'unu tarayıcıda açıp gezdim. İkisini açamadım:

- **bayut.com** — "Verify you are human" bot kontrolü. CAPTCHA çözmüyorum, o yüzden
  Bayut hakkında yazdıklarım doğrudan gözleme değil, genel bilgiye dayanıyor ve
  aşağıda **[doğrulanmadı]** diye işaretli. Bu senin için önemliyse, siteyi kendi
  tarayıcında açıp ekran görüntüsü verirsen doğrulanmış hale getiririm.
- **idealista.com** — aynı şekilde bot bulmacası. **[doğrulanmadı]**

Geri kalan her iddia gördüğüm ekranlara dayanıyor.

Analizi yazmadan önce kendi kodumuzu da okudum: `IlanKarti`, `Filtreler`, `Galeri`,
`ilan/[slug]/page.tsx`, `yardimci.ts`, `tipler.ts`, `globals.tailwind.css`. Bulduğum
somut hataları Bölüm 3'te satır numarasıyla verdim.

---

## 1. Site site — ne öğrendim, bize uyar mı

### 1.1 101evler.com — rakip *(gezildi)*

Girne satılık konut listesinde **12.337 sonuç**.

**Neyi iyi yapıyorlar (ve bizde yok):**

| Gördüğüm | Neden önemli |
|---|---|
| **"Projeler" üst menüde birinci sınıf kategori** + "Projeden İkinci El" (Caesar Blue, Grand Sapphire… isimle gezilebiliyor) | KKTC'de yabancı alıcı hacminin büyük kısmı proje/maketten satış. Biz bunu bir ilan tipi olarak bile modellemedik. **En büyük yapısal eksiğimiz bu, ve senin listende yok.** |
| Kartta fiyatın altında **çift para birimi**: `£98,000` + `~ 6,456,200 ₺` aynı anda | Satıcı ₺ düşünüyor, alıcı £ düşünüyor. Bizim `ParaSecici` biri yerine diğerini *koyuyor*; ikisini birden göstermiyor. |
| **"Bu Aramayı Kaydet"** filtre çubuğunda, sürekli görünür | Emlak alımı haftalar süren bir karar. Tek ziyaret varsayımı yanlış. |
| **"Son İncelediğiniz İlanlar"** sağ sütunda | Aynı sebep. Geri dönen kullanıcıya hafıza. |
| `Alan Dönüştürücü` ve `Kur Dönüştürücü` araçları | KKTC'de arazi **dönüm/evlek/ayakkare** ile ölçülür. Bizim modelde sadece `m2` var. Arsa ilanlarında ciddi eksik. |
| `Bölge Raporu` | Bölge bazlı fiyat/istatistik. Yabancı alıcının ilk sorusu "burası nasıl bir yer, fiyatlar ne". |
| `ilan-karsilastirma` | İyi fikir, menüde gömülü — kötü konumlandırılmış. |
| Kartta **"Telefonu Görüntüle"** — listeden çıkmadan iletişim | Bizde iletişim sadece detay sayfasında. |
| Kartta ajans logosu + danışman fotoğrafı + ismi | Kişi güveni. Bizim kartta emlakçı hiç yok. |
| İki fotoğraf yan yana, yatay satır düzeni | 12k ilanda yoğunluk mantıklı. **Bize uymaz** — bkz. 1.5. |
| `Video` rozeti | Video tur bizde hiç yok. |
| İki ayrı ücretli kademe: `Öne Çıkan` ve `Premium` | Gelir modeli. Bizde tek `vitrin` var. |

**Neyi kötü yapıyorlar (bizim asıl fırsatımız):**

Listedeki 15 ilanın 4'ünün başlığı şöyle:

```
TÜRK KOÇAN -1+1 - YATIRIMLIK DAİRE -OZANKÖY
TÜRK KOÇANLI FUL EŞYALI LÜSK VİLLA        ← "LÜSK" yazım hatası, düzeltilmemiş
ZEYTİNLİK'TE TÜRK KOÇANLI
Kıbrıs Girne Zeytinlik Bölgesinde Satılık 4+1 Türk Koçanlı Villa
```

**101evler'de yapısal bir tapu tipi alanı yok.** Emlakçı en kritik bilgiyi başlığa
BÜYÜK HARFLE sıkıştırmak zorunda kalıyor. Sonuç: tapu tipine göre *filtrelenemiyor*,
sıralanamıyor, sayılamıyor. Alıcı 12.337 ilanı tarayıp başlıklarda "koçan" kelimesi
aramak zorunda.

Bizim `tapu: TapuTipi` alanımız ve detaydaki mavi tapu bloğu **tam olarak bu yarayı
kapatıyor.** Bu prototipin en değerli tek kararı. Ama bir eksikle: tapu tipi **kartta
yok** ve **filtrede yok** — yani avantajı sadece detay sayfasında kullanıyoruz,
alıcının eleme yaptığı yerde değil. (Senin tespitin doğru.)

Ayrıca: kategori sayfalarının altındaki SEO metni ("Girne'nin muazzam doğası ve tarihi
dokusu…") jenerik dolgu. Okunmuyor, sadece Google için. Biz bunu yapmayalım — bölge
rehberi yazacaksak gerçek bilgi yazalım (fiyat aralığı, tapu dağılımı, ulaşım).

**Nerede hâlâ gerideyiz — dürüst liste:**

1. Proje/maketten satış katmanı yok (yukarıda).
2. Envanter: 23 ilan vs 12.337. Prototip için sorun değil ama arayüz kararlarını
   **23 ilana göre** veriyoruz. 5.000 ilanda çalışmayan tasarım yapmayalım
   (sayfalama yok, harita yok, kaydedilmiş arama yok).
3. Emlakçı/firma sayfaları çok zayıf (`EmlakciKarti` 56 satır, portföy listesi yok).
4. Video, sanal tur, kat planı yok.
5. Kaydedilmiş arama, favori, son bakılanlar — hiçbiri yok.
6. Günlük kiralık segmenti yok (onlarda ayrı kategori).
7. Bölge rehberi / fiyat istatistiği yok.

---

### 1.2 propertyfinder.ae *(gezildi — en verimli referans)*

Pazar yapısı bize gerçekten yakın: yabancı alıcı ağırlıklı, çok dilli, mülkiyet tipi
karmaşık, maketten satış hacimli.

**Alınacaklar:**

- **Filtre çubuğunda `Off-plan` ve `Ready` ayrı iki toggle.** Bizim karşılığımız
  "Sıfır / İkinci el / Maketten". Tek tıkla ayrım, alt menüye gömülü değil.
- Şehir çipleri **sayıyla**: `Dubai · 82,238 | Ajman · 10,224 | Sharjah · 8,706`.
  Boş kategoriye tıklatmıyor. Bizde `SEHIRLER` var, sayı yok.
- **`Listed 23 days ago`** — mutlak tarih değil, göreli tazelik. Bizim detayda
  `18 Eyl 2026` yazıyor; kullanıcı kafadan çıkarma yapıyor. Kartta ise hiç yok.
- **`Price per area: ₯1,417/ft²`** — m² fiyatı. Yatırımcının tek karşılaştırma metriği.
  Bizde yok, oysa `fiyat / m2` ile bedavaya hesaplanıyor.
- İlan başlığı pazarlama cümlesi değil, **yapılandırılmış öznitelik zinciri**:
  `Luxury 2BR | Serviced | Fully Furnished | JVC`. 101evler'in CAPS LOCK başlıklarının zıddı.
- Adres hiyerarşisi: `Bina, Bölge, Semt, Şehir`. Bizde `bolge, sehir` — iki seviye.
  KKTC'de site/proje adı çok önemli ("Caesar Resort'ta 2+1"). Üçüncü seviye gerekiyor.
- **Danışman kartında `English, Hindi, Urdu`** — konuştuğu diller. KKTC'de alıcı
  TR/EN/RU/FA. Bir satır kod, çok yüksek değer. `Emlakci` tipinde yok.
- **`Usually responds within 5 minutes`** + `5.0 · 2 Ratings` — yanıt süresi taahhüdü.
- Fiyatın hemen altında üç hap: `Own from ₯4,541/month` · `View on map` · `Floor plan`.
- **Detayda yapışkan alt-menü:** Gallery · Project · Description · Amenities ·
  Transactions · Prices & trends · Floor plan · Location · Mortgage Calculator.
  Üstte daralmış yapışkan başlık: fiyat + 2 yatak/2 banyo/779 ft² + Save/Share/Report
  + `‹ Search` (sonuçlara dön). **Bizim detay sayfamız uzun ve bu iskeleden tamamen yoksun.**
- **Proje bilgi kartı**: `Completed` rozeti · geliştirici · `Delivery Date Q3 2024` ·
  `Down payment 10%` · "View all project details".
- `Save / Share / Report` — Report = moderasyon girişi. Müşterinin moderasyon
  sorumluluğunu üstlendiği bir üründe kullanıcıdan gelen sinyal bedava işgücü.
- `Offplan: Re-Sale` rozeti — 101evler'in "Projeden İkinci El"i ile birebir aynı ihtiyaç.
  İki farklı pazar aynı şeyi bağımsız icat etmişse, bu gerçek bir ihtiyaçtır.

**Uymayanlar:** `Transactions for Similar Properties` (gerçek satış kayıtları tablosu) ve
`Prices & trends` grafiği — Dubai Land Department açık verisine dayanıyor. KKTC'de
böyle bir açık tapu veri seti yok. **Taklit etmeyelim; uydurma veriyle grafik çizmek
müşteri sunumunda en kötü senaryo.**

---

### 1.3 bayut.com *(açılamadı — bot kontrolü)* — **[doğrulanmadı]**

Bayut'un `TruCheck™` rozeti, ilanın fiziksel olarak doğrulandığını (ajans ziyareti /
sahiplik belgesi) gösteren bir güven damgası olarak biliniyor ve doğrulanmış ilanlar
listede önceliklendiriliyor.

Bize uyarlaması: `ruhsatDogrulandi` alanımız **emlakçıyı** doğruluyor, **ilanı**
doğrulamıyor. KKTC'de asıl problem mükerrer ve hayalet ilan. `ilanDogrulandi`
(koçan fotokopisi görüldü / mülke gidildi / tarih) ayrı bir alan olmalı — CLAUDE.md'deki
"mükerrer ilan tespiti" maddesiyle aynı aileden ama farklı bir şey. Faz 1 kapsamı.

---

### 1.4 idealista.com *(açılamadı — bot kontrolü)* — **[doğrulanmadı]**

Filtre yoğunluğu yönetimi konusunda doğrulanmış bir şey söyleyemem. Aynı problemin
**gözlemlediğim** çözümleri funda ve Rightmove'da var; onları temel alıyorum.

---

### 1.5 compass.com *(gezildi — tasarım yönümüzün doğrulaması)*

Bölünmüş ekran: solda harita (%50), sağda 2 sütunlu kart ızgarası.

**Asıl ders, beklediğimin tersi çıktı:**

- Compass'ın kartında **gölge yok, çerçeve yok, arka plan beyaz.** Fotoğrafın kendisi
  karttır. Altında fiyat (orta ağırlık), tek satır `1 bed | 1 bath | – sqft`, adres, semt. Bitti.
- **Paletinde renk yok.** Siyah, beyaz, gri. Tüm rengi fotoğraflar sağlıyor.
- Rozet neredeyse hiç yok — sadece `Coming Soon`, `New Construction` gibi gerçek
  durum bilgisi. Pazarlama rozeti yok.

Bizim `IlanKarti`'mızda ise aynı anda: `kart-golge` + hover'da `kart-golge-yukari` +
`-translate-y-0.5` + fotoğrafta `scale-1.04` + sol üstte 2 rozet + sağ üstte AI rozeti +
sağ altta "temsilî görsel" damgası + başlıkta hover renk değişimi. **Yedi ayrı efekt.**
Bu "Akdeniz Editoryal" değil, "her şeyi göster". Compass'ın yaptığı şey *çıkarmak*.

Senin listende olmayan ama bence en yüksek etkili tasarım müdahalesi bu:
**karttan eksiltmek, eklemek değil.**

`Draw on Map` (poligon çizerek arama) da var — Faz 1 harita işiyle birlikte düşünülmeli.

---

### 1.6 sothebysrealty.com *(gezildi)*

- **Başlık = adres.** Pazarlama cümlesi değil: `1629 Taylor Street / San Francisco,
  California, 94133`. Fiyat onun altında, küçük, düz metin.
- Künye ikon satırı değil, **madde işaretli dikey liste**: `5 Bedrooms · Bathrooms
  (4 Full 1 Partial) · Interior: 4,405 Sq.Ft. · Exterior: 6,599 Sq.Ft.`
- Lacivert + beyaz, ince çizgiler, çok geniş boşluk, minik harf aralıklı büyük harf etiketler.
- `Marketed By …` italik, en altta, küçük — atıf var ama öne çıkmıyor.

**Bize uyan:** tipografik ölçek ve boşluk cesareti. Bizim kartta 20px fiyat, 14.5px
başlık, 13px konum, 12.5px künye — dört boyut, aralarında 1.5px fark. Ölçek sıkışık.
Sotheby's'in yaptığı: az sayıda, birbirinden **net ayrılmış** boyut.

**Bize uymayan:** başlığı adres yapmak. KKTC'de sokak adresi hem çoğu zaman yok, hem de
alıcı için anlamsız. Bizim karşılığımız **`Bölge, Şehir`** — "Ozanköy, Girne". Verimiz
zaten var; hiyerarşideki yeri yanlış (şu an üçüncü satır, gri, 13px).

---

### 1.7 theagencyre.com *(gezildi)*

- Kartta **`Price Reduced` etiketi + üstü çizili eski fiyat**: `$370,449` ~~$515,000~~.
  Bir satırda güven + aciliyet. Çok ucuz, çok etkili.
- `New Listing` etiketi.
- Filtre çiplerinde **seçim sayısı**: `Status (2)`, `Type (4)`, `More (0)`.
  Kullanıcı hangi filtrenin açık olduğunu paneli açmadan görüyor.
- `Grid` / `Map` net geçiş, `Save Search` her zaman görünür.

Fiyat düşüşü göstermek için `fiyat` tek değer olmaktan çıkıp `oncekiFiyat?` alması
gerekiyor — veri modeli işi.

---

### 1.8 airbnb.com *(gezildi)*

- **Kartın kabı yok.** Yuvarlatılmış köşeli fotoğraf, altında metin. Gölge yok, çerçeve yok.
  Compass ile aynı sonuca farklı yoldan varmış. Sektörün fiilî standardı bu.
- Fotoğrafın üstünde tek bir anlamlı rozet (`Misafirlerin favorisi`), sağ üstte kalp.
- Fiyatta **üstü çizili eski fiyat + indirim notu** — The Agency ile aynı kalıp.
- Filtre çubuğunun **altında hızlı özellik çipleri**: `Çamaşır makinesi · Havuz · Wifi ·
  Ücretsiz otopark · Klima`. Tam senin istediğin şey (havuz, jeneratör, deniz manzarası).
  Yanında `Filtreler` düğmesi tam paneli açıyor. **İki katmanlı model: sık kullanılan
  3–5 özellik çip olarak dışarıda, gerisi panelde.**

Bu, "mobilde filtre paneli sığmıyor" probleminin de çözümü: mobilde çipler yatay kayar
(kasten), tam panel alttan açılan bir sayfa olur.

---

### 1.9 rightmove.co.uk *(gezildi — İngiliz alıcı tanıdıklığı)*

KKTC'nin İngiliz alıcısı bu kalıpları biliyor:

- **`Min Price → Max Price`** ve **`Min Beds → Max Beds`** — ikisi de çift uçlu.
  (Bizde sadece `max` var; senin tespitin doğru.)
- **`Save Search` + `Create Alert`** yan yana, sonuç sayısının hemen üstünde.
- **`Prioritise properties with…` + `Add keyword`** — serbest metin anahtar kelime filtresi.
  KKTC için mükemmel: "Türk koçanı", "deniz manzarası", "jeneratör" yazıp eleyebilmek.
  Dikkat: bu, 101evler'in başlığa sıkıştırma probleminin *kullanıcı tarafı* çözümü.
  Biz yapısal alan koyduğumuz için buna ihtiyacımız olmamalı — ama açıklama metninde
  arama yine de faydalı.
- Kartta **`Reduced on 14/09/2026 by Beresford Adams, Mold`** / **`Added on 03/06/2026 by…`**
  — tarih + ajans, tek satırda.
- **Fiyat niteleyicisi**: `Offers Over`, `Guide Price`. Fiyat tek bir sayı değil, bir *tür*.
- Telefon numarası kartta açık, `Contact` + `Save` düğmeleri.
- Kartta `×` ile ilanı gizleme. `This area only` yarıçap seçici.

**KKTC karşılığı — sende olmayan bir fikir:** Rightmove'un `Offers Over`'ının bizdeki
karşılığı fiyat niteleyicisi değil, **fiyata neyin dahil olduğu.** KKTC'de alıcının en
büyük sürprizi KDV, devir harcı ve stopaj. `£150,000` gördüğü ilan ona `£168,000`'e
patlıyor. Kartta veya detayda `KDV dahil / KDV hariç` + tahmini devir maliyeti göstermek
— rakipte **hiç yok**, yabancı alıcının en çok yandığı yer, ve "tapu şeffaflığı"
konumlandırmamızın doğal devamı. Faz 1 farklılaştırıcı listesine eklemeni öneriyorum.

---

### 1.10 funda.nl *(gezildi)*

- Filtre iki satır: üstte alan çipleri (`Amsterdam ×`, `+`, `0 km`, `Kaart`, **`Bewaar`**
  = aramayı kaydet), altta `Koop | Prijs | Woningtype | Aangeboden | Woonoppervlakte |
  Slaapkamers | Alle filters`.
- **`Aangeboden sinds`** (ne zamandır yayında) birinci sınıf filtre. Tazelik.
  CLAUDE.md'deki "30 günlük tazeleme döngüsü" ile doğrudan bağlantılı.
- `Selecteer buurten` — **çoklu mahalle seçimi.** Bizim `bolge` alanı bunu destekler,
  arayüz desteklemiyor (tek `sehir` select'i var).
- Kart: 1 büyük + 2 küçük fotoğraf. Fiyat `€ 565.000 k.k.` — **"k.k." = masraflar alıcıya.**
  Yine fiyat niteleyicisi; Hollandalı bunu okur okumaz toplam maliyeti biliyor.
- Künye ikon satırı: `98 m² (yaşam) · 95 m² (arsa) · 3 oda · A (enerji sınıfı)`.
- Sponsorlu satır **açıkça etiketli** (`Toppositie`) ve altında ifşa notu:
  *"Aşağıdakiler kısmen ücretli imkânlara bağlıdır."*

**Bu son madde önemli:** bizim `vitrin` alanımız ücretli yerleşim ve **hiçbir ifşası yok**.
101evler'in `Öne Çıkan`/`Premium` rozetlerinde de yok. Ücretli yerleşimi açıkça
etiketlemek hem doğru olan, hem de "biz onlar gibi değiliz" konumlandırmasının somut
kanıtı. Bir satır metin.

---

### 1.11 domain.com.au *(gezildi)*

- `List view` / `Map view` / `Inspections & Auctions` — **üç eşit sekme.** Harita bir
  overlay veya toggle değil, listeyle eşit bir görünüm. Faz 1'de harita gelirken bu modeli
  öneririm (bölünmüş ekran yerine sekme) — bölünmüş ekran mobilde çalışmıyor.
- `Create alert` düğmesi.
- Sağ sütunda **bölge profili modülü**: "Looking in Melbourne? … Median house prices".
  101evler'in `Bölge Raporu`'nun aynısı. İki farklı pazarda da var — gerçek ihtiyaç.

---

## 2. Beni şaşırtan üç şey

**1. 101evler'in en büyük zayıflığı tapu; bizim en büyük eksiğimiz proje.**
Tapu konusunda haklıydık ve rakip gerçekten savunmasız — başlıklarda CAPS LOCK'la
"TÜRK KOÇAN" yazıyorlar. Ama aynı menüde `Projeler` ve `Projeden İkinci El` birinci sınıf
kategori olarak duruyor ve bizde bunun izi bile yok. PropertyFinder'da da aynı şey
(`Off-plan` / `Ready` / `Offplan: Re-Sale`). İki bağımsız pazar aynı ihtiyacı aynı şekilde
çözmüş. KKTC'de yabancıya satışın ağırlığı maketten. **Bu prototipin kapsamında değil ama
Faz 1 planında açık bir boşluk ve müşteriye bunu biz söylemeliyiz, müşteri bize değil.**

**2. İyi siteler kartı süslemiyor, soyuyor.** Compass ve Airbnb — biri lüks emlak, diğeri
kitlesel ürün — aynı yere varmış: gölgesiz, çerçevesiz, fotoğraf = kart. Bizim kartımızda
yedi ayrı görsel efekt var. "Fotoğraf birinci sınıf vatandaş" kararımızı kartın kendisi
ihlal ediyor.

**3. Fiyat bir sayı değil, bir ifade.** Rightmove `Offers Over`, funda `k.k.`, The Agency
üstü çizili eski fiyat, 101evler çift para birimi. Dördü de fiyatın yanına bağlam koyuyor.
Bizim `Fiyat` bileşeni 16 satır ve tek bir sayı basıyor. KKTC'de bu bağlam **KDV + devir
harcı**dır ve hiçbir rakipte yok.

---

## 3. Kendi kodumuzda bulduğum somut hatalar

Bunlar görüş değil, hata.

**H1 — Kontrast, ölçülmüş değerlerle.**
- `--color-kum-400: #C4B69C` beyaz üstünde **2.0:1**. WCAG AA metin için 4.5:1 ister.
  Kullanıldığı yerler: `app/[dil]/ilan/[slug]/page.tsx:47` (`#{ilan.id}`), `:172`
  (görüntülenme sayısı), `components/Filtreler.tsx:57` (placeholder). **Kalıyor.**
- `--color-sis: #6B7780` beyaz üstünde 4.59:1 (geçer), ama sayfanın **asıl arka planı**
  `kum-100 #F5F0E8` ve orada **4.05:1 — kalıyor.** `text-sis` ikincil metinlerin
  neredeyse tamamında kullanılıyor, çoğu 12.5–13px.
- `etiket` = 11px + `uppercase` + `tracking-.14em`. `text-sis` ile birleştiğinde
  (örn. `components/IlanKarti.tsx:47`) hem küçük hem düşük kontrast.

**H2 — Odak halkası hiç yok.** `app/globals.tailwind.css` içinde tek bir `:focus-visible`
kuralı yok ve bileşenlerde `outline-none` var (`components/Filtreler.tsx:24`). Klavyeyle
gezen kullanıcı nerede olduğunu göremiyor. Tek başına erişilebilirlik denetiminden kalma sebebi.

**H3 — `prefers-reduced-motion` yok.** `html { scroll-behavior: smooth }` ve `.belir`
animasyonu koşulsuz. Vestibüler rahatsızlığı olan kullanıcılar için sorun; kurumsal
müşteri denetim yaptırırsa ilk bakılan yerlerden.

**H4 — Galeri ok düğmelerinin erişilebilir adı bozuk.** `components/Galeri.tsx:17`:
`aria-label={s}` — ve `s` değeri `"‹"` / `"›"`. Ekran okuyucu "tek sol açılı tırnak
düğmesi" diyor. Küçük resim düğmelerinin (`components/Galeri.tsx:41`) hiç adı yok (`alt=""`).

**H5 — `Filtreler`'deki hiçbir `select`/`input`'un etiketi yok.** Görsel olarak seçili
değer anlaşılıyor ama programatik ad yok.

**H6 — `ozellikler: string[]` çok dilliliği kırıyor.** `lib/veri.ts`'te değerler Türkçe
**görüntü metni**: `"Deniz manzarası"`, `"Jeneratör"`, `"Ortak havuz"`. Detay sayfası
bunları olduğu gibi basıyor (`app/[dil]/ilan/[slug]/page.tsx:150`) — yani **Rusça sayfada
Türkçe özellik listesi görünüyor.** Senin istediğin özellik filtrelerini bu modelin
üstüne kurarsak, Rus kullanıcı Türkçe stringlere göre filtrelemiş olur. Önce koda
çevirmek gerekiyor (`OzellikKodu` + `sozluk`). 24 ayrı değer var, ikisi neredeyse aynı
(`"Şehir içi"` / `"Şehir manzarası"`), biri anlamsız (`"Yol"`).

**H7 — Oda gösterimi `"3+1"` yabancı alıcıya kapalı.** Üç dilde de `3+1` basılıyor.
İngiliz/Rus alıcı bunu okumayı bilmiyor. `3 bed + lounge` / `3 спальни + гостиная`.
Rakip de yapmıyor; ucuz farklılaştırıcı.

**H8 — `m2` tek ölçü.** Arsa ilanlarında KKTC dönüm/evlek kullanıyor. 101evler bunun için
ayrı bir çevirici aracı koymuş.

**H9 — "Otomatik üretildi" ama üreteç yok.** `lib/veri.ts` başında `// OTOMATIK URETILDI`
yazıyor, CLAUDE.md "elle düzenleme" diyor, brief'in "üreteci güncelle" diyor.
**`bakeoff/` içinde böyle bir script yok** (`ai-uret.mjs`, `fotograf-indir.mjs`, `run.mjs`,
`stiller.mjs` — hiçbiri ilan üretmiyor). Repoda da yok. Yani "üreteci güncelle" şu an
uygulanamaz bir talimat. Bölüm 5.3'te önerim var.

---

## 4. Öncelikli uygulama listesi

Süreler tek geliştirici, kesintisiz çalışma varsayımıyla.

### Kademe A — yüksek etki, düşük risk (toplam ≈ 1 gün)

| # | İş | Neden | Süre |
|---|---|---|---|
| **A1** | **Karttan eksiltme.** Gölgeyi ve çerçeveyi kaldır, hover'ı tek harekete indir (sadece fotoğraf `scale`), rozet sayısını 4'ten 2'ye düşür, tipografik ölçeği aç (fiyat 22px, konum 15px `murekkep`, künye 13px). | Compass + Airbnb aynı sonuca varmış; "fotoğraf birinci sınıf vatandaş" kararımızı kartın kendisi ihlal ediyor. Yedi efekt fotoğrafla yarışıyor. | 2 sa |
| **A2** | **Kartta tapu tipi + yabancı uygunluk rozeti** (ve filtrede tapu seçici). | Rakibin en savunmasız noktası ve bizim en güçlü kozumuz, şu an sadece detayda. Alıcı elemesini listede yapıyor. | 1.5 sa |
| **A3** | **Erişilebilirlik temeli:** `:focus-visible` halkası (terra-500, 2px, offset 2px), `prefers-reduced-motion`, `kum-400` metin kullanımlarını `sis`'e çek, `sis`'i `#5A666F`'e koyulaştır (kum-100 üstünde 5.1:1), Galeri/Filtreler etiketleri. | H1–H5. Kurumsal müşteriye satılacak üründe pazarlık konusu değil. Palet **değişmiyor**, sadece `sis` bir ton koyulaşıyor — Akdeniz Editoryal bozulmuyor. | 3 sa |
| **A4** | **Fiyat min alanı + oda/banyo/m² aralık filtreleri.** | Rightmove/funda standardı; tek uçlu fiyat filtresi yarım iş. | 2 sa |
| **A5** | **m² fiyatı** (detay künyesinde). `fiyat / m2` — veri değişikliği yok. | Yatırımcının tek karşılaştırma metriği. Rakipte yok. | 30 dk |
| **A6** | **Göreli tazelik:** kartta ve detayda `12 gün önce yayınlandı`. `yayinTarihi`'nden türetilir. | PropertyFinder + Rightmove; tazelik güven sinyali, 30 günlük tazeleme döngümüzün arayüz karşılığı. | 1 sa |
| **A7** | **Vitrin ifşası:** vitrin kartlarında "Öne çıkarılmış ilan" + liste altında bir cümlelik ifşa notu. | funda yapıyor, 101evler yapmıyor. Doğru olan + konumlandırma kanıtı. | 30 dk |

### Kademe B — yüksek etki, orta iş (toplam ≈ 1.5 gün)

| # | İş | Neden | Süre |
|---|---|---|---|
| **B1** | **Özellik kodlaması + çip filtreleri.** `ozellikler` → `OzellikKodu[]`, `sozluk`'e 3 dil, filtre çubuğunda 5 hızlı çip (Havuz · Deniz manzarası · Jeneratör · Otopark · Eşyalı), gerisi panelde. | Senin istediğin özellik filtresi. **H6 düzeltilmeden yapılamaz** — yoksa Rus kullanıcı Türkçe stringle filtreler. | 4 sa |
| **B2** | **Mobil filtre: alttan açılan panel.** Dışarıda yatay kayan çipler + "Filtreler (3)" düğmesi sayı rozetiyle. | Airbnb + The Agency modeli; mobilde yatay taşmanın doğru çözümü. Sayı rozeti = hangi filtre açık, paneli açmadan görünür. | 4 sa |
| **B3** | **Galeri lightbox** + klavye (← → ESC) + odak tuzağı + fotoğraf sayacı. | Emlakta fotoğraf her şey; tam ekran yok. Klavye desteği aynı işte geliyor. | 3 sa |
| **B4** | **Detayda yapışkan alt-menü + daralmış fiyat başlığı + "‹ Sonuçlara dön".** | PropertyFinder; detay sayfamız 177 satır ve 9 bölüm, gezinme iskelesi yok. | 3 sa |
| **B5** | **Mobilde sabit alt iletişim çubuğu** (Ara · WhatsApp · Favori). | Senin tespitin; mobil dönüşümün en büyük kaldıracı. | 2 sa |
| **B6** | **Favoriler** (localStorage) + kartta kalp + `/tr/favoriler`. | Emlak kararı haftalar sürer. **Uyarı:** üyelik olmadan bu cihaz-bazlı bir illüzyon; müşteriye böyle anlatılmalı, "favoriler çalışıyor" denmemeli. | 3 sa |
| **B7** | **İskelet yükleme durumu** + `loading.tsx`. | Senin tespitin. | 1.5 sa |

### Kademe C — değerli ama sonra (liste olarak bırakıyorum)

- Çift para birimi (£ + ₺ birlikte), `ParaSecici`'yi tamamlayıcı yapmak
- Emlakçıda **konuştuğu diller** + yanıt süresi (`Emlakci`'ye alan)
- Oda notasyonu çevirisi (`3+1` → `3 bed + lounge`)
- Şehir çiplerinde ilan sayısı
- `Bölge, Şehir`'i kart hiyerarşisinde yukarı taşımak (Sotheby's modeli)
- Aramayı kaydet (üyelik gerektirir → Faz 1)
- Son bakılan ilanlar (localStorage)
- İlan karşılaştırma (2–3 ilan yan yana)
- Boş durum ve 404'ün yeniden tasarımı
- Sayfa geçiş hareketleri (`prefers-reduced-motion` ile birlikte)
- Ana sayfadaki AI bölümünün yeniden kurgusu — **ayrı bir tur hak ediyor**, bkz. 5.4
- Dönüm/evlek gösterimi (arsa ilanları)
- Açıklama metninde anahtar kelime arama

### Faz 1'e taşınmasını önerdiklerim (prototip kapsamında değil)

1. **Proje / maketten satış katmanı** — en büyük yapısal boşluk (Bölüm 2)
2. **KDV / devir harcı şeffaflığı** — rakipte hiç yok, yabancı alıcının en çok yandığı yer
3. **İlan doğrulama** (`ilanDogrulandi`) — emlakçı doğrulamasından ayrı
4. **Bölge rehberi** — 101evler ve Domain'de var, ikisinde de gerçek talep
5. **Fiyat geçmişi** (`oncekiFiyat` + "fiyat düştü" etiketi)
6. Harita: **sekme modeli** (Domain), bölünmüş ekran değil — mobilde bölünmüş çalışmıyor

---

## 5. İtirazlarım

**5.1 — Harita yer tutucusuna karşıyım.**
Listende "en azından yer tutucu tasarımı düşünülmeli" var. Müşteri sunumunda sahte harita
kötü fikir: ya gerçek sanılır (sonra hayal kırıklığı), ya sahte olduğu anlaşılır (o zaman
neden koyduk). Yerine önerim: **`Konum` bölümü** — bölge adı ve KKTC'ye özel gerçek mesafe
bilgisi (Ercan Havalimanı, şehir merkezi, en yakın plaj, market). Yabancı alıcının
haritadan aradığı bilgi zaten bu. Veri eklemesi gerekir ama sahte değil, ve harita
geldiğinde bu bölüm silinmez, haritanın yanında durur.

**5.2 — Özellik filtrelerini H6'yı düzeltmeden yapmayalım.**
"Veri modelini bozma" dedin, haklısın; ama `ozellikler` şu an zaten **bozuk** — Rusça
sayfada Türkçe metin basıyor. Filtreleri üstüne kurarsak hatayı çoğaltmış oluruz. Bu,
`lib/tipler.ts`'e ekleme + `lib/veri.ts`'te tek bir alanın dönüştürülmesi demek (24 değer,
script'le). Onayına ihtiyacım var çünkü `veri.ts`'e dokunuyor.

**5.3 — "Üreteci güncelle" şu an uygulanamaz.** Üreteç repoda yok (H9). Kararını almadan
`veri.ts`'e dokunmam. Önerim: yeni alanların büyük kısmını (m² fiyatı, tazelik, oda
çevirisi) `lib/yardimci.ts`'te **türetmek** ve `veri.ts`'i hiç ellememek. Sadece B1
(özellik kodları) gerçek veri dönüşümü gerektiriyor.

**5.4 — Ana sayfadaki AI bölümü için "sesini yükseltmek" yanlış çözüm olabilir.**
Sorunun ses seviyesi olduğundan emin değilim. `AiTasarim` bileşeni detay sayfasında, yani
kullanıcı ilanı zaten seçtikten *sonra* görünüyor. Oysa AI'nın satış argümanı "bu boş
daire döşenince nasıl görünür" — bu **liste sayfasında, eleme anında** işe yarar.
Önerim: ana sayfada daha büyük bir blok yapmak yerine, kartta AI rozetine tıklanınca
açılan bir önizleme ya da liste üstünde "AI ile döşenmiş 14 ilan" girişi. Bu daha büyük
bir iş ve ayrı tartışılmalı — bu yüzden Kademe C'de. Ana sayfa bloğunu büyütmemi istersen
yaparım, ama gerekçemi bilmeni istedim.

**5.5 — Tailwind yeniden derlemesi gerekecek.**
A1, A3 ve B2'nin hepsi `app/globals.tailwind.css`'e dokunuyor (`sis` tonu,
`:focus-visible`, `prefers-reduced-motion`, kart stilleri). Kaynakta yapacağım, sonra
**senin** şunu çalıştırman gerekiyor:

```
npx @tailwindcss/cli -i app/globals.tailwind.css -o app/globals.css --minify
```

…ve sonra font `@import` satırlarını dosyanın başına geri eklemen. Her tur sonunda
hatırlatacağım.

---

## 6. Uygulama durumu — 18 Eylül 2026

Canlı: **https://northernemlak.vercel.app**

### Yapıldı

| # | İş | Not |
|---|---|---|
| A1 | Kart sadeleştirme | Gölge/çerçeve/yükselme kaldırıldı, hover tek harekete indi, tipografik ölçek açıldı |
| A2 | Kartta tapu çipi + filtrede tapu | Yabancı kısıtı yalnızca kısıtlıyken gösteriliyor |
| A3 | Erişilebilirlik tabanı | `:focus-visible`, `prefers-reduced-motion`, `sis` → `#5A666F` (5.19:1), `kum-400` metinden çıktı, içeriğe atla, galeri/filtre etiketleri |
| A4 | Aralık filtreleri | Fiyat min–max, oda, banyo, m² min–max, bina yaşı |
| A5 | m² birim fiyatı | Kartta ve detay künyesinde |
| A6 | Göreli tazelik | Kartta `guncelleme`, detayda göreli + mutlak birlikte |
| A7 | Vitrin ifşası | "Öne çıkarılmış" + liste altında ücretli yerleşim notu |
| B1 | Özellik kodlaması + hızlı çipler | 25 değer koda çevrildi, 3 dil, 4 grup |
| B2 | İki katmanlı filtre + panel | Mobilde alttan açılan sayfa, sayı rozeti, ESC + odak tuzağı |
| B3 | Tam ekran galeri | ← → ESC, odak tuzağı, sayaç, şerit |
| B4 | Detay yapışkan başlığı | Fiyat + bölüm menüsü + sonuçlara dön + paylaş + favori |
| B5 | Mobil alt iletişim çubuğu | Fiyat, favori, WhatsApp, telefon |
| B6 | Favoriler | localStorage, başlıkta sayaç, `/favoriler` sayfası, prototip uyarısı |
| B7 | İskelet yükleme | `loading.tsx` + boş durum yeniden tasarımı |
| C | Oda notasyonu çevirisi | `3+1` EN/RU'da açılıyor |
| C | Danışmanın konuştuğu diller | `Emlakci.konustuguDiller`, TR/EN/RU/DE/FA |
| C | Şehir çiplerinde ilan sayısı | Filtre seçicisinde |
| 5.1 | Harita yerine `Konum` bölümü | Gerçek kuş uçuşu mesafeler (haversine), sahte harita yok |

### Yol boyunca bulunup düzeltilenler

- `<html lang="tr">` tüm dillerde sabitti; `text-transform: uppercase` Türkçe kuralıyla
  İngilizce etiketleri bozuyordu (`PRİCE`). `lang` sarmalayıcı div'e taşındı.
- Bileşen CSS sınıfları Tailwind yardımcı sınıflarını eziyordu (`hidden lg:flex` çalışmıyordu).
  Hepsi `@layer components` içine alındı.
- Liste sayfası başlığı "Tüm ilanları gör" yazıyordu (CTA metni başlık olarak kullanılmış).
- Font `@import`'ları CSS'ten JS import'una taşındı — her derlemeden sonra elle geri
  ekleme zorunluluğu ortadan kalktı.
- Tailwind derlemesi `npm run build`'e bağlandı; Vercel Linux'ta derliyor, yerel
  Application Control engeli artık iş akışını kesmiyor.

### İkinci turda eklenenler

| İş | Neden |
|---|---|
| **Toplam maliyet hesabı** | Bölüm 1.9'daki özgün tespit. KDV + tapu devir harcı + damga pulu + avukat + satın alma izni. £745.000 ilan → **£795.425** tahmini toplam. Rakipte hiç yok. Oranlar görünür ve uyarılı. |
| **Karşılaştırma tablosu** | Favorilerin devamı olarak; farklı olan satırlar koyu zeminde işaretli (alıcı farkı arar, aynıyı değil). Karta yeni kontrol eklemeden. |
| **Son incelediğiniz ilanlar** | 101evler'de sağ sütunda var; emlak kararı haftalar sürüyor. |
| **Çift para birimi** | Fiyatın altında hep ikincil satır: £ seçiliyse ₺, değilse £. Satıcı ₺ düşünüyor, alıcı £. |
| **Dönüm / evlek gösterimi** | Arsa ilanlarında `3,2 dönüm · 4.280 m²`. 101evler bunun için ayrı bir çevirici araç koymuş. |
| **404 sayfaları** | Kök 404 (geçersiz dil kodu) ve ilan bulunamadı, üç dilde. |

### Yapılmadı (bilinçli)

- **Proje / maketten satış katmanı** — Faz 1. Prototip kapsamını aşıyor, ama en büyük boşluk.
- **KDV / devir harcı şeffaflığı** — Faz 1, veri modeli işi.
- Kaydedilmiş arama ve uyarı (üyelik gerektirir), ilan karşılaştırma, video,
  dönüm/evlek gösterimi, fiyat geçmişi, bölge rehberi, çift para birimi.
- **Ana sayfadaki AI bölümü** — 5.4'teki itirazım duruyor: sorun ses seviyesi değil
  konum olabilir. Ayrı bir tur hak ediyor.
