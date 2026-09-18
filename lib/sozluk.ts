import { Dil, KonusulanDil, Metin, OzellikGrubu, OzellikKodu } from "./tipler";

export const DILLER: { kod: Dil; ad: string; kisa: string }[] = [
  { kod: "tr", ad: "Türkçe", kisa: "TR" },
  { kod: "en", ad: "English", kisa: "EN" },
  { kod: "ru", ad: "Русский", kisa: "RU" },
];

const S = {
  marka:            { tr: "NorthernEmlak", en: "NorthernEmlak", ru: "NorthernEmlak" },
  sloganUst:        { tr: "Kuzey Kıbrıs", en: "North Cyprus", ru: "Северный Кипр" },
  kahramanBaslik:   { tr: "Kıbrıs'ta evinizi\ngörmeden hayal edin", en: "Picture your home\nin Cyprus before you see it", ru: "Представьте свой дом\nна Кипре заранее" },
  kahramanAlt:      { tr: "Boş bir dairenin dört farklı tasarımını tek tıkla görün. Kuzey Kıbrıs'ın tapu bilgisi şeffaf, altı dilli emlak platformu.", en: "See four different designs of an empty flat in one click. North Cyprus property, with transparent title deeds, in six languages.", ru: "Посмотрите четыре варианта дизайна пустой квартиры одним кликом. Недвижимость Северного Кипра с прозрачными документами, на шести языках." },

  satilik:   { tr: "Satılık", en: "For sale", ru: "Продажа" },
  kiralik:   { tr: "Kiralık", en: "To rent", ru: "Аренда" },
  projeler:  { tr: "Projeler", en: "Projects", ru: "Проекты" },
  emlakcilar:{ tr: "Emlakçılar", en: "Agents", ru: "Агенты" },
  rehber:    { tr: "Rehber", en: "Guide", ru: "Гид" },

  ara:        { tr: "Ara", en: "Search", ru: "Поиск" },
  tumSehirler:{ tr: "Tüm bölgeler", en: "All regions", ru: "Все регионы" },
  tumTipler:  { tr: "Tüm tipler", en: "All types", ru: "Все типы" },
  fiyatAralik:{ tr: "Fiyat aralığı", en: "Price range", ru: "Цена" },
  enAz:       { tr: "En az", en: "Min", ru: "От" },
  enCok:      { tr: "En çok", en: "Max", ru: "До" },
  filtreler:  { tr: "Filtreler", en: "Filters", ru: "Фильтры" },
  temizle:    { tr: "Temizle", en: "Clear", ru: "Сбросить" },
  hepsi:      { tr: "Hepsi", en: "All", ru: "Все" },
  tumFiltreler:{ tr: "Tüm filtreler", en: "All filters", ru: "Все фильтры" },
  kapat:      { tr: "Kapat", en: "Close", ru: "Закрыть" },
  sonucuGoster:{ tr: "ilanı göster", en: "listings", ru: "объявлений" },
  goster:     { tr: "Göster", en: "Show", ru: "Показать" },
  fiyatGbp:   { tr: "Fiyat (£)", en: "Price (£)", ru: "Цена (£)" },
  enAzOda:    { tr: "En az oda", en: "Min bedrooms", ru: "Спален от" },
  enAzBanyo:  { tr: "En az banyo", en: "Min bathrooms", ru: "Ванных от" },
  alanAralik: { tr: "Alan (m²)", en: "Area (m²)", ru: "Площадь (м²)" },
  enFazlaYas: { tr: "En fazla bina yaşı", en: "Max building age", ru: "Возраст здания до" },
  tumTapular: { tr: "Tüm tapu tipleri", en: "All title types", ru: "Все типы титула" },
  farketmez:  { tr: "Farketmez", en: "Any", ru: "Любой" },
  yabanciFiltre:{ tr: "Sadece yabancı alıcıya uygun", en: "Eligible for foreign buyers only", ru: "Только доступные иностранцам" },
  aiFiltre:   { tr: "AI tasarımlı", en: "With AI design", ru: "С AI-дизайном" },
  sonuc:      { tr: "ilan bulundu", en: "listings found", ru: "объявлений найдено" },
  sirala:     { tr: "Sırala", en: "Sort", ru: "Сортировка" },
  sonEklenen: { tr: "Son eklenen", en: "Newest", ru: "Новые" },
  fiyatArtan: { tr: "Fiyat (artan)", en: "Price (low to high)", ru: "Цена (по возрастанию)" },
  fiyatAzalan:{ tr: "Fiyat (azalan)", en: "Price (high to low)", ru: "Цена (по убыванию)" },

  vitrin:      { tr: "Vitrin", en: "Featured", ru: "Рекомендуем" },
  oneCikarilmis: { tr: "Öne çıkarılmış", en: "Promoted", ru: "Продвигаемое" },
  vitrinIfsa:  {
    tr: "“Öne çıkarılmış” ilanlar emlakçı tarafından ücretli olarak öne alınmıştır ve sıralamayı etkiler.",
    en: "“Promoted” listings are paid placements by the agent and affect ranking.",
    ru: "«Продвигаемые» объявления оплачены агентом и влияют на порядок выдачи.",
  },
  oneCikanlar: { tr: "Öne çıkan ilanlar", en: "Featured listings", ru: "Рекомендуемые объявления" },
  tumIlanlarBaslik: { tr: "Tüm ilanlar", en: "All listings", ru: "Все объявления" },
  tumIlanlar:  { tr: "Tüm ilanları gör", en: "See all listings", ru: "Все объявления" },
  aiIleTasarlandi: { tr: "AI tasarım mevcut", en: "AI design available", ru: "Доступен AI-дизайн" },

  oda:    { tr: "Oda", en: "Rooms", ru: "Комнаты" },
  banyo:  { tr: "Banyo", en: "Baths", ru: "Ванные" },
  alan:   { tr: "Alan", en: "Area", ru: "Площадь" },
  binaYasi:{ tr: "Bina yaşı", en: "Building age", ru: "Возраст здания" },
  esyaDurumu: { tr: "Eşya durumu", en: "Furnishing", ru: "Мебель" },
  esyali: { tr: "Eşyalı", en: "Furnished", ru: "С мебелью" },
  esyasiz:{ tr: "Eşyasız", en: "Unfurnished", ru: "Без мебели" },
  yari:   { tr: "Yarı eşyalı", en: "Part furnished", ru: "Частично меблирована" },
  aidat:  { tr: "Site aidatı", en: "Site fee", ru: "Взнос за обслуживание" },
  ayda:   { tr: "/ay", en: "/mo", ru: "/мес" },
  m2Fiyat:{ tr: "m² birim fiyatı", en: "Price per m²", ru: "Цена за м²" },

  bugunEklendi: { tr: "Bugün eklendi", en: "Added today", ru: "Добавлено сегодня" },
  dunEklendi:   { tr: "Dün eklendi", en: "Added yesterday", ru: "Добавлено вчера" },
  gunOnce:      { tr: "gün önce", en: "days ago", ru: "дн. назад" },
  haftaOnce:    { tr: "hafta önce", en: "weeks ago", ru: "нед. назад" },
  ayOnce:       { tr: "ay önce", en: "months ago", ru: "мес. назад" },
  yayindaSure:  { tr: "Yayında", en: "Listed", ru: "В продаже" },

  tapuTipi:   { tr: "Tapu tipi", en: "Title deed", ru: "Тип титула" },
  turkKocani: { tr: "Türk Koçanı", en: "Turkish Title", ru: "Турецкий титул" },
  esdeger:    { tr: "Eşdeğer", en: "Exchange Title", ru: "Обменный титул" },
  tmd:        { tr: "TMD / Tahsis", en: "TRNC Allocation", ru: "Распределённый титул" },
  leasehold:  { tr: "Leasehold", en: "Leasehold", ru: "Лизхолд" },
  yabanciUygun:   { tr: "Yabancı alıcıya uygun", en: "Eligible for foreign buyers", ru: "Доступно иностранцам" },
  yabanciUygunDegil:{ tr: "Yabancı alımı kısıtlı", en: "Restricted for foreign buyers", ru: "Ограничено для иностранцев" },
  tapuNot:    { tr: "Bilgilendirme amaçlıdır, hukuki tavsiye değildir.", en: "For information only, not legal advice.", ru: "Только для информации, не юридическая консультация." },

  ozellikler: { tr: "Özellikler", en: "Features", ru: "Особенности" },
  aciklama:   { tr: "Açıklama", en: "Description", ru: "Описание" },
  konum:      { tr: "Konum", en: "Location", ru: "Расположение" },
  ilanNo:     { tr: "İlan no", en: "Ref", ru: "Номер" },
  yayin:      { tr: "Yayın", en: "Published", ru: "Опубликовано" },
  guncelleme: { tr: "Güncelleme", en: "Updated", ru: "Обновлено" },
  goruntulenme:{ tr: "görüntülenme", en: "views", ru: "просмотров" },
  makineCeviri:{ tr: "NorthernEmlak tarafından çevrildi", en: "Translated by NorthernEmlak", ru: "Переведено NorthernEmlak" },

  aiBaslik:   { tr: "Bu evi nasıl döşerdiniz?", en: "How would you furnish this home?", ru: "Как бы вы обставили этот дом?" },
  aiAlt:      { tr: "Boş odanın dört farklı tasarımı. Yapay zekâ ile üretildi, temsilîdir.", en: "Four designs of the empty room. AI-generated, for illustration only.", ru: "Четыре варианта дизайна пустой комнаты. Создано ИИ, иллюстративно." },
  orijinal:   { tr: "Orijinal", en: "Original", ru: "Оригинал" },
  aiRozet:    { tr: "AI ile oluşturuldu — temsilîdir", en: "AI-generated — illustrative", ru: "Создано ИИ — иллюстративно" },
  karsilastir:{ tr: "Öncesi / sonrası", en: "Before / after", ru: "До / после" },

  telefonuGoster: { tr: "Telefonu göster", en: "Show phone", ru: "Показать телефон" },
  mesajGonder:    { tr: "Mesaj gönder", en: "Send message", ru: "Написать" },
  whatsapp:       { tr: "WhatsApp", en: "WhatsApp", ru: "WhatsApp" },
  yil:            { tr: ". yılı", en: "th year", ru: "-й год" },
  konusulanDiller:{ tr: "Konuştuğu diller", en: "Speaks", ru: "Языки" },
  ruhsatli:       { tr: "Ruhsatlı emlakçı", en: "Licensed agent", ru: "Лицензированный агент" },
  digerIlanlari:  { tr: "Bu danışmanın diğer ilanları", en: "Other listings by this agent", ru: "Другие объявления агента" },
  benzerIlanlar:  { tr: "Benzer ilanlar", en: "Similar listings", ru: "Похожие объявления" },

  favoriler:       { tr: "Favoriler", en: "Saved", ru: "Избранное" },
  favoriyeEkle:    { tr: "Favorilere ekle", en: "Save listing", ru: "В избранное" },
  favorindenCikar: { tr: "Favorilerden çıkar", en: "Remove from saved", ru: "Убрать из избранного" },
  favoriYok:       { tr: "Henüz favori eklemediniz.", en: "You haven't saved any listings yet.", ru: "Вы пока ничего не сохранили." },
  favoriNot:       {
    tr: "Favoriler şu an yalnızca bu tarayıcıda saklanır. Üyelik sistemi Faz 1'de gelecek.",
    en: "Saved listings are stored in this browser only. Accounts arrive in Phase 1.",
    ru: "Избранное хранится только в этом браузере. Аккаунты появятся в первой фазе.",
  },

  konumBaslik:  { tr: "Konum ve mesafeler", en: "Location & distances", ru: "Расположение и расстояния" },
  havalimani:   { tr: "Ercan Havalimanı", en: "Ercan Airport", ru: "Аэропорт Эрджан" },
  sehirMerkezi: { tr: "Şehir merkezi", en: "City centre", ru: "Центр города" },
  kusUcusu:     {
    tr: "Kuş uçuşu yaklaşık mesafedir; harita ve yol mesafesi Faz 1'de gelecek.",
    en: "Approximate straight-line distances. Map and driving distance arrive in Phase 1.",
    ru: "Приблизительные расстояния по прямой. Карта появится в первой фазе.",
  },
  bolumler:     { tr: "Sayfa bölümleri", en: "Page sections", ru: "Разделы страницы" },
  sonucaDon:    { tr: "Sonuçlara dön", en: "Back to results", ru: "К результатам" },
  iletisim:     { tr: "İletişim", en: "Contact", ru: "Связаться" },
  paylas:       { tr: "Paylaş", en: "Share", ru: "Поделиться" },
  kopyalandi:   { tr: "Bağlantı kopyalandı", en: "Link copied", ru: "Ссылка скопирована" },
  tumFotograflar:{ tr: "Tüm fotoğraflar", en: "All photos", ru: "Все фото" },

  temsiliGorsel: { tr: "Temsilî görsel", en: "Stock image", ru: "Иллюстрация" },
  foto:          { tr: "Fotoğraf", en: "Photo", ru: "Фото" },
  oncekiFoto:    { tr: "Önceki fotoğraf", en: "Previous photo", ru: "Предыдущее фото" },
  sonrakiFoto:   { tr: "Sonraki fotoğraf", en: "Next photo", ru: "Следующее фото" },
  iceriveAtla:   { tr: "İçeriğe atla", en: "Skip to content", ru: "Перейти к содержимому" },
  prototipUyari: { tr: "Prototip — ilanlar ve görseller temsilîdir", en: "Prototype — listings and images are illustrative", ru: "Прототип — объявления и изображения иллюстративны" },

  neden1Baslik: { tr: "Tapu şeffaflığı", en: "Title transparency", ru: "Прозрачность титула" },
  neden1Metin:  { tr: "Her ilanda tapu tipi ve yabancı alıcı uygunluğu açıkça yazar. Sürpriz yok.", en: "Every listing states the title type and foreign-buyer eligibility. No surprises.", ru: "В каждом объявлении указан тип титула и доступность для иностранцев." },
  neden2Baslik: { tr: "Altı dilde yayın", en: "Six languages", ru: "Шесть языков" },
  neden2Metin:  { tr: "İlanınızı Türkçe yazın, altı dilde yayınlansın. Çeviriyi biz hallederiz.", en: "Write your listing in Turkish, publish in six languages. We handle translation.", ru: "Напишите объявление по-турецки — опубликуем на шести языках." },
  neden3Baslik: { tr: "AI sanal dekorasyon", en: "AI virtual staging", ru: "AI-визуализация" },
  neden3Metin:  { tr: "Boş daireler dört farklı stilde döşenmiş olarak görünür. Alıcı hayal etmek zorunda kalmaz.", en: "Empty flats appear furnished in four styles. Buyers don't have to imagine.", ru: "Пустые квартиры показываются в четырёх стилях. Покупателю не нужно воображать." },

  bolgelerBaslik: { tr: "Bölgeler", en: "Regions", ru: "Регионы" },
  ilan:           { tr: "ilan", en: "listings", ru: "объявлений" },
  sonucYok:       { tr: "Aramanıza uygun ilan bulunamadı.", en: "No listings match your search.", ru: "Ничего не найдено." },
  filtreyiTemizle:{ tr: "Filtreleri temizle", en: "Clear filters", ru: "Сбросить фильтры" },

  altbilgiHak: { tr: "Tüm hakları saklıdır.", en: "All rights reserved.", ru: "Все права защищены." },
  altbilgiNot: { tr: "Bu bir prototiptir. İlanlar ve görseller temsilîdir, gerçek mülkleri yansıtmaz.", en: "This is a prototype. Listings and images are illustrative and do not represent real properties.", ru: "Это прототип. Объявления и изображения иллюстративны." },
} as const;

/** Ozellik kodlarinin uc dilde karsiligi. Kod -> metin ayrimi icin bkz. tipler.ts */
export const OZELLIK_ADI: Record<OzellikKodu, Metin> = {
  "asansor":           { tr: "Asansör", en: "Lift", ru: "Лифт" },
  "jenerator":         { tr: "Jeneratör", en: "Generator", ru: "Генератор" },
  "somine":            { tr: "Şömine", en: "Fireplace", ru: "Камин" },
  "celik-kapi":        { tr: "Çelik kapı", en: "Security door", ru: "Бронедверь" },
  "guvenlik-kamerasi": { tr: "Güvenlik kamerası", en: "CCTV", ru: "Видеонаблюдение" },
  "yangin-alarmi":     { tr: "Yangın alarmı", en: "Fire alarm", ru: "Пожарная сигнализация" },
  "gunes-enerjisi":    { tr: "Güneş enerjisi", en: "Solar power", ru: "Солнечная энергия" },
  "ozel-havuz":        { tr: "Özel havuz", en: "Private pool", ru: "Частный бассейн" },
  "ortak-havuz":       { tr: "Ortak havuz", en: "Shared pool", ru: "Общий бассейн" },
  "bahce":             { tr: "Bahçe", en: "Garden", ru: "Сад" },
  "balkon":            { tr: "Balkon", en: "Balcony", ru: "Балкон" },
  "teras":             { tr: "Teras", en: "Terrace", ru: "Терраса" },
  "barbeku":           { tr: "Barbekü", en: "Barbecue", ru: "Барбекю" },
  "otopark":           { tr: "Otopark", en: "Parking", ru: "Парковка" },
  "kapali-otopark":    { tr: "Kapalı otopark", en: "Covered parking", ru: "Крытая парковка" },
  "deniz-manzarasi":   { tr: "Deniz manzarası", en: "Sea view", ru: "Вид на море" },
  "denize-sifir":      { tr: "Denize sıfır", en: "Beachfront", ru: "Первая линия моря" },
  "dag-manzarasi":     { tr: "Dağ manzarası", en: "Mountain view", ru: "Вид на горы" },
  "doga-manzarasi":    { tr: "Doğa manzarası", en: "Countryside view", ru: "Вид на природу" },
  "sehir-manzarasi":   { tr: "Şehir manzarası", en: "City view", ru: "Вид на город" },
  "sehir-ici":         { tr: "Şehir içi", en: "In town", ru: "В черте города" },
  "yol-erisimi":       { tr: "Yol erişimi", en: "Road access", ru: "Подъездная дорога" },
  "su-altyapisi":      { tr: "Su altyapısı", en: "Mains water", ru: "Водоснабжение" },
  "elektrik-altyapisi":{ tr: "Elektrik altyapısı", en: "Mains electricity", ru: "Электроснабжение" },
  "su-kuyusu":         { tr: "Su kuyusu", en: "Water well", ru: "Скважина" },
};

/** Panelde yogunlugu yonetmek icin gruplama (idealista/funda modeli). */
export const OZELLIK_GRUPLARI: Record<OzellikGrubu, { ad: Metin; kodlar: OzellikKodu[] }> = {
  manzara: {
    ad: { tr: "Konum ve manzara", en: "Location & view", ru: "Расположение и вид" },
    kodlar: ["deniz-manzarasi", "denize-sifir", "dag-manzarasi", "doga-manzarasi", "sehir-manzarasi", "sehir-ici"],
  },
  disMekan: {
    ad: { tr: "Dış mekân", en: "Outdoor", ru: "Снаружи" },
    kodlar: ["ozel-havuz", "ortak-havuz", "bahce", "balkon", "teras", "barbeku", "otopark", "kapali-otopark"],
  },
  konfor: {
    ad: { tr: "Konfor ve güvenlik", en: "Comfort & security", ru: "Комфорт и безопасность" },
    kodlar: ["asansor", "jenerator", "somine", "celik-kapi", "guvenlik-kamerasi", "yangin-alarmi", "gunes-enerjisi"],
  },
  arsa: {
    ad: { tr: "Arsa altyapısı", en: "Land infrastructure", ru: "Инфраструктура участка" },
    kodlar: ["yol-erisimi", "su-altyapisi", "elektrik-altyapisi", "su-kuyusu"],
  },
};

/** Danismanin konustugu dillerin adlari. */
export const KONUSULAN_DIL_ADI: Record<KonusulanDil, Metin> = {
  tr: { tr: "Türkçe",  en: "Turkish", ru: "Турецкий" },
  en: { tr: "İngilizce", en: "English", ru: "Английский" },
  ru: { tr: "Rusça",   en: "Russian", ru: "Русский" },
  de: { tr: "Almanca", en: "German",  ru: "Немецкий" },
  fa: { tr: "Farsça",  en: "Persian", ru: "Персидский" },
};

export const ozellikAdi = (kod: OzellikKodu, dil: Dil) => OZELLIK_ADI[kod]?.[dil] ?? kod;

export type SozlukAnahtar = keyof typeof S;
export const t = (anahtar: SozlukAnahtar, dil: Dil): string => S[anahtar][dil];
export const SOZLUK = S;
