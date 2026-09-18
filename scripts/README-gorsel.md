# Görsel üretim hattı — öğrenilenler

## AI sanal dekorasyon

**Model: `gemini-3.1-flash-image`.** 2.5 bu işte güvenilir değil — ilk denemede
Akdeniz stilinde televizyonu karşı duvara taşıdı ve taş kaplamayı sildi.

**Stil tarifleri yüzey malzemesi İÇERMEZ.** İlk sürümde tarifler
"lime-washed walls", "marble surfaces" diyordu; modele duvarı ve zemini
değiştirmesini bizzat biz söylemiş oluyorduk. Sonuç: mermer döşenmiş salon.
Stil yalnızca mobilya, tekstil ve dekoru tarif eder.

**Prompt mimariyi tek tek kilitler**: kamera açısı, duvarlar, taş kaplama,
zemin, boya, pencere/kapı sayısı, klima, priz, buzdolabı, televizyonun durduğu
duvar. Değişebilecekler ayrıca listelenir.

## 360 panorama

**Tek fotoğraftan 360 üretilmez.** Model odanın %70'ini uydurmak zorunda kalıyor
ve her seferinde başka bir ev çıkıyor — bir denemede evde olmayan bir mutfak
icat edip ortada sert bir dikiş bıraktı.

**Doğrusu: bütün fotoğrafları birlikte vermek.** Prompt "üret" değil "birleştir"
der; boşluk kalırsa uydurmak yerine düz duvar uzatması ister.

**Panoramalar gerçekten kapanmaz.** Ölçüldü:

    node scripts/panorama-dikis.mjs public/gorsel/360/xxx.jpeg

Bu evin panoramasında sol/sağ kenar farkı ortalama 26/255, en kötü satır 146/255.
Sınırsız döndürülürse kullanıcı sert bir dikişe çarpar. Bu yüzden `Gezinti360`
varsayılan olarak yatay açıyı sınırlar (`tam360={false}`). Emniyet payı 0.25 rad;
0.05'te dikiş sağ sınırda kadraja giriyordu. Gerçek 360 kamera çıktısı
kullanılırsa `tam360` true verilir.

## Dosya uzantısı

Model PNG isteyince de **JPEG** dönebiliyor. Uzantı dönen mime'a göre verilir,
yoksa `.png` adlı JPEG'ler oluşuyor.

## En/boy oranı

`gemini-2.5-flash-image` 4:1 desteklemiyor, 3.1 destekliyor. Gerçek eşdikdörtgen
(2:1) hiçbirinde üretilemedi; bu yüzden silindirik 4:1 kullanılıyor
(360 yatay, ~±38 dikey).
