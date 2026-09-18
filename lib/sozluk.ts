import { Dil } from "./tipler";

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
  sonuc:      { tr: "ilan bulundu", en: "listings found", ru: "объявлений найдено" },
  sirala:     { tr: "Sırala", en: "Sort", ru: "Сортировка" },
  sonEklenen: { tr: "Son eklenen", en: "Newest", ru: "Новые" },
  fiyatArtan: { tr: "Fiyat (artan)", en: "Price (low to high)", ru: "Цена (по возрастанию)" },
  fiyatAzalan:{ tr: "Fiyat (azalan)", en: "Price (high to low)", ru: "Цена (по убыванию)" },

  vitrin:      { tr: "Vitrin", en: "Featured", ru: "Рекомендуем" },
  oneCikanlar: { tr: "Öne çıkan ilanlar", en: "Featured listings", ru: "Рекомендуемые объявления" },
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
  ruhsatli:       { tr: "Ruhsatlı emlakçı", en: "Licensed agent", ru: "Лицензированный агент" },
  digerIlanlari:  { tr: "Bu danışmanın diğer ilanları", en: "Other listings by this agent", ru: "Другие объявления агента" },
  benzerIlanlar:  { tr: "Benzer ilanlar", en: "Similar listings", ru: "Похожие объявления" },

  temsiliGorsel: { tr: "Temsilî görsel", en: "Stock image", ru: "Иллюстрация" },
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

export type SozlukAnahtar = keyof typeof S;
export const t = (anahtar: SozlukAnahtar, dil: Dil): string => S[anahtar][dil];
export const SOZLUK = S;
