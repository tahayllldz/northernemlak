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
  emlakTipi:  { tr: "Emlak tipi", en: "Property type", ru: "Тип недвижимости" },
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
  // --- Sayfalama, arama, siralama ---
  sayfa:        { tr: "Sayfa", en: "Page", ru: "Страница" },
  onceki:       { tr: "Önceki", en: "Previous", ru: "Назад" },
  sonraki:      { tr: "Sonraki", en: "Next", ru: "Вперёд" },
  aramaYer:     { tr: "Bölge, şehir veya ilan başlığı", en: "Area, city or listing title", ru: "Район, город или заголовок" },
  aramaAktif:   { tr: "Arama", en: "Search", ru: "Поиск" },
  m2Artan:      { tr: "m² fiyatı (artan)", en: "Price per m² (low to high)", ru: "Цена за м² (по возрастанию)" },
  m2Azalan:     { tr: "m² fiyatı (azalan)", en: "Price per m² (high to low)", ru: "Цена за м² (по убыванию)" },
  enYeniGuncel: { tr: "Son güncellenen", en: "Recently updated", ru: "Недавно обновлённые" },
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

  // --- Sesli tur ---
  sesliDinle:  { tr: "Açıklamayı dinle", en: "Listen to description", ru: "Прослушать описание" },
  sesliDurdur: { tr: "Durdur", en: "Stop", ru: "Остановить" },
  sesliNot: {
    tr: "Rus ve İranlı alıcıların önemli kısmı yazılı İngilizceyi rahat okumuyor. Açıklama kendi dilinizde sesli okunur.",
    en: "Many Russian and Iranian buyers don't read written English comfortably. The description is read aloud in your language.",
    ru: "Описание озвучивается на вашем языке.",
  },

  // --- WhatsApp arama takibi ---
  whatsappTakip: { tr: "Bu aramayı WhatsApp'tan takip et", en: "Follow this search on WhatsApp", ru: "Следить за поиском в WhatsApp" },
  whatsappNot: {
    tr: "KKTC'de e-posta ölü, herkes WhatsApp'ta. Rakipler arama bildirimini e-postayla yolluyor.",
    en: "Email is dead in North Cyprus; everyone is on WhatsApp. Competitors send search alerts by email.",
    ru: "В Северном Кипре все в WhatsApp, а не в почте.",
  },
  whatsappMesaj: { tr: "Merhaba, şu aramaya uyan yeni ilan çıkınca haber verir misiniz?", en: "Hello, could you notify me when a new listing matches this search?", ru: "Здравствуйте, сообщите, когда появится новое объявление по этому запросу?" },

  // --- Goruntuleme rotasi ---
  rotaBaslik: { tr: "Görüntüleme rotası", en: "Viewing route", ru: "Маршрут просмотра" },
  rotaAlt: {
    tr: "Yabancı alıcı iki günlüğüne uçakla gelip sekiz mülk geziyor. Favorileriniz coğrafi olarak sıraya dizildi.",
    en: "Foreign buyers fly in for two days and view eight properties. Your saved listings are ordered geographically.",
    ru: "Иностранные покупатели прилетают на два дня. Избранное упорядочено географически.",
  },
  rotaOlustur:  { tr: "Rota oluştur", en: "Build route", ru: "Построить маршрут" },
  rotaKapat:    { tr: "Rotayı kapat", en: "Close route", ru: "Закрыть маршрут" },
  rotaToplam:   { tr: "Toplam yol", en: "Total distance", ru: "Общее расстояние" },
  rotaSure:     { tr: "Tahmini süre", en: "Estimated time", ru: "Ожидаемое время" },
  rotaNot: {
    tr: "Kuş uçuşu mesafeden hesaplanır; her görüntüleme için 30 dakika eklenir. Gerçek yol mesafesi harita ile Faz 1'de gelecek.",
    en: "Calculated from straight-line distance, plus 30 minutes per viewing. Real driving distance arrives with the map in Phase 1.",
    ru: "Рассчитано по прямой, плюс 30 минут на просмотр.",
  },
  saatKisa: { tr: "sa", en: "h", ru: "ч" },
  dakKisa:  { tr: "dk", en: "min", ru: "мин" },

  // --- Fiyat gecmisi ---
  fiyatDustu: { tr: "Fiyat düştü", en: "Price reduced", ru: "Цена снижена" },

  // --- Kira getirisi ---
  getiriBaslik: { tr: "Yatırım getirisi", en: "Investment return", ru: "Доходность инвестиции" },
  getiriAlt: {
    tr: "Kira tahmini, aynı bölgedeki kiralık ilanlarımızın m² medyanından hesaplanır. Uydurulmuş bir rakam değildir.",
    en: "Rent is estimated from the median £/m² of our own rental listings in the same area. It is not an invented figure.",
    ru: "Аренда оценивается по медиане £/м² наших объявлений аренды в том же районе.",
  },
  tahminiKira:   { tr: "Tahmini aylık kira", en: "Estimated monthly rent", ru: "Оценка аренды в месяц" },
  yazSezonu:     { tr: "Yaz sezonu (öğrenci yok)", en: "Summer (no students)", ru: "Лето (без студентов)" },
  yillikBrutKira:{ tr: "Yıllık brüt kira", en: "Annual gross rent", ru: "Валовая аренда в год" },
  yillikNetKira: { tr: "Yıllık net (gider sonrası)", en: "Annual net (after costs)", ru: "Чистый доход в год" },
  alimMaliyetiSat:{ tr: "Toplam alım maliyeti", en: "Total purchase cost", ru: "Общая стоимость покупки" },
  brutGetiri:    { tr: "Brüt getiri", en: "Gross yield", ru: "Валовая доходность" },
  netGetiri:     { tr: "Net getiri", en: "Net yield", ru: "Чистая доходность" },
  geriOdeme:     { tr: "Kendini amorti etme", en: "Payback period", ru: "Срок окупаемости" },
  yilKisa:       { tr: "yıl", en: "yrs", ru: "лет" },
  ogrenciNot: {
    tr: "Üniversite kenti: kira dönem içinde dolu, yaz aylarında düşer. Hesap bunu 9 ay tam + 3 ay düşük sezon olarak modelliyor — rakiplerde bu ayrım yok.",
    en: "University town: rent holds during term and drops in summer. The model uses 9 full months + 3 low-season months — no competitor makes this distinction.",
    ru: "Университетский город: аренда падает летом. Модель: 9 месяцев полных + 3 низкого сезона.",
  },
  getiriUyari: {
    tr: "Yönetim %8 ve bakım %5 varsayılmıştır. Tahmindir, garanti değildir.",
    en: "Assumes 8% management and 5% maintenance. An estimate, not a guarantee.",
    ru: "Предполагается 8% управление и 5% обслуживание. Это оценка, не гарантия.",
  },
  ornekIlan:     { tr: "kiralık ilandan hesaplandı", en: "rental listings used", ru: "объявлений аренды использовано" },

  // --- Altyapi ---
  altyapiBaslik: { tr: "Altyapı hazırlığı", en: "Infrastructure readiness", ru: "Готовность инфраструктуры" },
  altyapiAlt: {
    tr: "KKTC'de elektrik ve su kesintileri olur. “Jeneratör” bu yüzden bir lüks değil, bir ihtiyaçtır. Yerli alıcı bunu bilir, yabancı alıcı taşındıktan sonra öğrenir.",
    en: "Power and water cuts happen in North Cyprus. A generator is a necessity, not a luxury. Locals know this; foreign buyers find out after moving in.",
    ru: "В Северном Кипре бывают отключения электричества и воды. Генератор — необходимость, а не роскошь.",
  },
  altyapiVar:    { tr: "var", en: "yes", ru: "есть" },
  altyapiYok:    { tr: "belirtilmemiş", en: "not stated", ru: "не указано" },

  // --- Mukerrer ilan ---
  mukerrerBaslik:{ tr: "Bu mülke çok benzeyen ilanlar", en: "Very similar listings", ru: "Очень похожие объявления" },
  mukerrerAlt: {
    tr: "Aynı bölgede, aynı tipte ve neredeyse aynı büyüklükte başka ilanlar. KKTC'de bir mülk sıklıkla birden çok ofiste, farklı fiyatlarla listelenir. Hiçbir portal bunu göstermiyor.",
    en: "Other listings in the same area, same type, nearly the same size. In North Cyprus one property is often listed by several agencies at different prices. No portal shows this.",
    ru: "Другие объявления в том же районе того же типа и размера. Ни один портал этого не показывает.",
  },
  fiyatFarki:    { tr: "Fiyat farkı", en: "Price spread", ru: "Разброс цен" },

  // --- Kiralik sartlari ---
  kiraSartlari: { tr: "Kiralama şartları", en: "Rental terms", ru: "Условия аренды" },
  kiraSartlariAlt: {
    tr: "KKTC'de kiralamada peşin ödeme ve depozito alışılmışın üstünde olabilir; ilan fiyatı aylık kirayı gösterir, girişte ödenecek tutarı değil.",
    en: "Up-front payment and deposits in North Cyprus can be higher than expected; the listed price is the monthly rent, not what you pay on move-in.",
    ru: "Предоплата и депозит могут быть выше ожидаемого; указана месячная аренда.",
  },
  depozito:   { tr: "Depozito", en: "Deposit", ru: "Депозит" },
  pesinOdeme: { tr: "Peşin ödeme", en: "Paid up front", ru: "Предоплата" },
  minSure:    { tr: "Asgari süre", en: "Minimum term", ru: "Минимальный срок" },
  girisToplam:{ tr: "Girişte ödenecek", en: "Due on move-in", ru: "К оплате при заселении" },
  ayKisa:     { tr: "ay", en: "months", ru: "мес." },

  // --- AI eleme modu ---
  aiModAc:  { tr: "AI ile döşenmiş hâlini göster", en: "Show AI-staged version", ru: "Показать с AI-дизайном" },
  aiModKapat:{ tr: "Gerçek fotoğrafa dön", en: "Back to real photos", ru: "Вернуть реальные фото" },
  aiModNot: {
    tr: "Kartlardaki kapak fotoğrafı, AI ile döşenmiş hâliyle değişti. Boş veya eski döşenmiş daireleri eleme anında değerlendirmenizi sağlar. Tüm AI görselleri temsilîdir.",
    en: "Cover photos now show the AI-staged version, so you can judge empty or dated flats while you are still shortlisting. All AI images are illustrative.",
    ru: "Обложки показывают версию с AI-дизайном. Все AI-изображения иллюстративны.",
  },
  aiRozetKisa: { tr: "AI", en: "AI", ru: "AI" },

  // --- Projeler ---
  projelerBaslik: { tr: "Projeler", en: "New developments", ru: "Новостройки" },
  projelerAlt: {
    tr: "KKTC'de yabancıya satışın büyük kısmı maketten. Teslim tarihi, ödeme planı ve geliştiricinin teslim sicili her projede açıkça yazar.",
    en: "Most foreign purchases in North Cyprus are off-plan. Handover date, payment plan and the developer's delivery record are stated on every project.",
    ru: "Большинство покупок иностранцами — на стадии строительства. Срок сдачи, план оплаты и история застройщика указаны в каждом проекте.",
  },
  dOnSatis:      { tr: "Ön satış", en: "Pre-launch", ru: "Предпродажа" },
  dInsaat:       { tr: "İnşaat halinde", en: "Under construction", ru: "Строится" },
  dTamamlandi:   { tr: "Teslim edildi", en: "Delivered", ru: "Сдан" },
  teslimTarihi:  { tr: "Teslim", en: "Handover", ru: "Сдача" },
  konutSayisi:   { tr: "Konut", en: "Units", ru: "Единиц" },
  satilanOran:   { tr: "Satıldı", en: "Sold", ru: "Продано" },
  baslangicFiyat:{ tr: "Başlangıç fiyatı", en: "From", ru: "Цена от" },
  pesinat:       { tr: "Peşinat", en: "Down payment", ru: "Первый взнос" },
  taksitPlani:   { tr: "Taksit", en: "Instalments", ru: "Рассрочка" },
  ayTaksit:      { tr: "ay", en: "months", ru: "мес." },
  odaSecenek:    { tr: "Oda seçenekleri", en: "Unit types", ru: "Планировки" },
  projeIlanlari: { tr: "Bu projedeki ilanlar", en: "Listings in this project", ru: "Объявления в проекте" },
  projedenIkinciEl:{ tr: "Projeden ikinci el", en: "Off-plan resale", ru: "Перепродажа" },
  projeninParcasi:{ tr: "Bu konut bir projenin parçası", en: "Part of a development", ru: "Часть проекта" },
  projeyiGor:    { tr: "Projeyi incele", en: "View development", ru: "Смотреть проект" },
  projeYok:      { tr: "Bu kriterlere uygun proje yok.", en: "No developments match.", ru: "Проектов не найдено." },
  projeUyari: {
    tr: "Proje bilgileri prototip demosudur. Gerçek sürümde geliştiriciden alınan ve doğrulanabilir veriler yayınlanır.",
    en: "Project data is a prototype demo. The live product publishes verifiable data obtained from the developer.",
    ru: "Данные проекта — демонстрация прототипа.",
  },

  // --- Tapu zinciri ---
  tapuZinciri:   { tr: "Tapu süreci", en: "Title process", ru: "Процесс оформления титула" },
  tapuZinciriAlt:{
    tr: "KKTC'de asıl soru tapunun tipi değil, sürecin neresinde olduğu. Bu mülk şu an burada:",
    en: "In North Cyprus the real question isn't the deed type but where in the process it sits. This property is here:",
    ru: "Главный вопрос — не тип титула, а стадия процесса. Этот объект находится здесь:",
  },
  asInsaat:       { tr: "İnşaat halinde", en: "Under construction", ru: "Строится" },
  asKayit:        { tr: "Sözleşme tapuda kayıtlı", en: "Contract registered", ru: "Договор зарегистрирован" },
  asIzinBekliyor: { tr: "Bakanlar Kurulu izni bekleniyor", en: "Awaiting Council of Ministers permit", ru: "Ожидание разрешения" },
  asIzinAlindi:   { tr: "İzin alındı", en: "Permit granted", ru: "Разрешение получено" },
  asDevredildi:   { tr: "Tapu satıcı adına", en: "Title in seller's name", ru: "Титул на имя продавца" },
  tapuSureNot:    { tr: "Bu aşamadan sonra tipik bekleme", en: "Typical wait from this stage", ru: "Типичное ожидание с этой стадии" },
  tapuAy:         { tr: "ay", en: "months", ru: "мес." },
  tapuZinciriUyari:{
    tr: "Süreler KKTC'de gözlemlenen tipik aralıklardır, taahhüt değildir. Her dosya farklı ilerler.",
    en: "Durations are typical observed ranges in North Cyprus, not a commitment. Every file differs.",
    ru: "Сроки — типичные наблюдаемые диапазоны, не обязательство.",
  },

  // --- Gelistirici sicili ---
  gelistiriciBaslik:{ tr: "Geliştirici sicili", en: "Developer track record", ru: "История застройщика" },
  gelistiriciAlt:{
    tr: "Maketten alımda tek gerçek soru: teslim eder mi? İlan edilen teslim tarihi ile gerçekleşeni karşılaştırıyoruz.",
    en: "The only real question when buying off-plan: will they deliver? We compare announced vs actual handover dates.",
    ru: "Единственный реальный вопрос при покупке на стадии проекта: сдадут ли?",
  },
  kurulus:        { tr: "Kuruluş", en: "Founded", ru: "Основана" },
  teslimEdilen:   { tr: "Teslim edilen proje", en: "Projects delivered", ru: "Сдано проектов" },
  teslimKonut:    { tr: "Teslim edilen konut", en: "Units delivered", ru: "Сдано единиц" },
  ortGecikme:     { tr: "Ortalama gecikme", en: "Average delay", ru: "Средняя задержка" },
  devamEden:      { tr: "Devam eden proje", en: "Ongoing projects", ru: "Текущие проекты" },
  gecikmeYok:     { tr: "Zamanında", en: "On time", ru: "Вовремя" },
  sicilIyi:       { tr: "Güçlü sicil", en: "Strong record", ru: "Хорошая история" },
  sicilOrta:      { tr: "Orta sicil", en: "Mixed record", ru: "Смешанная история" },
  sicilZayif:     { tr: "Zayıf sicil", en: "Weak record", ru: "Слабая история" },
  gelistiriciUyari:{
    tr: "Veriler prototip demosudur. Gerçek sürümde yalnızca doğrulanabilir teslim tarihleri yayınlanır.",
    en: "Data shown is a prototype demo. The live product publishes only verifiable handover dates.",
    ru: "Данные — демонстрация прототипа.",
  },

  ozellikler: { tr: "Özellikler", en: "Features", ru: "Особенности" },
  aciklama:   { tr: "Açıklama", en: "Description", ru: "Описание" },
  konum:      { tr: "Konum", en: "Location", ru: "Расположение" },
  ilanNo:     { tr: "İlan no", en: "Ref", ru: "Номер" },
  yayin:      { tr: "Yayın", en: "Published", ru: "Опубликовано" },
  guncelleme: { tr: "Güncelleme", en: "Updated", ru: "Обновлено" },
  goruntulenme:{ tr: "görüntülenme", en: "views", ru: "просмотров" },
  makineCeviri:{ tr: "NorthernEmlak tarafından çevrildi", en: "Translated by NorthernEmlak", ru: "Переведено NorthernEmlak" },

  gezinti360:    { tr: "360° gezinti", en: "360° tour", ru: "360° тур" },
  gezinti360Alt: {
    tr: "Odanın içinde dolaşın. Sürükleyin, yakınlaştırın, tam ekrana alın. Görüntü gerçek fotoğraflardan birleştirildi.",
    en: "Look around inside the room. Drag, zoom, go fullscreen. Stitched from the real photographs.",
    ru: "Осмотритесь в комнате. Перетаскивайте, приближайте, разверните. Собрано из реальных фотографий.",
  },
  odaSec:        { tr: "Oda", en: "Room", ru: "Комната" },
  gezintiIpucu:  { tr: "Sürükleyerek bakın", en: "Drag to look around", ru: "Перетащите, чтобы осмотреться" },
  tamEkran:      { tr: "Tam ekran", en: "Fullscreen", ru: "Полный экран" },

  aiBaslik:   { tr: "Bu evi nasıl döşerdiniz?", en: "How would you furnish this home?", ru: "Как бы вы обставили этот дом?" },
  aiAlt:      { tr: "Boş odanın dört farklı tasarımı. Yapay zekâ ile üretildi, temsilîdir.", en: "Four designs of the empty room. AI-generated, for illustration only.", ru: "Четыре варианта дизайна пустой комнаты. Создано ИИ, иллюстративно." },
  orijinal:   { tr: "Orijinal", en: "Original", ru: "Оригинал" },
  aiRozet:    { tr: "AI ile oluşturuldu — temsilîdir", en: "AI-generated — illustrative", ru: "Создано ИИ — иллюстративно" },
  karsilastir:{ tr: "Öncesi / sonrası", en: "Before / after", ru: "До / после" },

  telefonuGoster: { tr: "Telefonu göster", en: "Show phone", ru: "Показать телефон" },
  mesajGonder:    { tr: "Mesaj gönder", en: "Send message", ru: "Написать" },
  whatsapp:       { tr: "WhatsApp", en: "WhatsApp", ru: "WhatsApp" },
  yil:            { tr: ". yılı", en: "th year", ru: "-й год" },
  demoKayit: { tr: "Demo kayıt", en: "Demo record", ru: "Демо-запись" },
  demoKisiNot: {
    tr: "Bu prototipteki danışman adları, telefonları ve ruhsat numaraları kurgusaldır. Numaralar tahsis edilmemiş bir bloktandır, kimseye ulaşmaz.",
    en: "Agent names, phone numbers and licence numbers in this prototype are fictional. The numbers are from an unassigned block and do not reach anyone.",
    ru: "Имена агентов, телефоны и номера лицензий в прототипе вымышлены и никому не принадлежат.",
  },
  konusulanDiller:{ tr: "Konuştuğu diller", en: "Speaks", ru: "Языки" },
  ruhsatli:       { tr: "Ruhsatlı emlakçı", en: "Licensed agent", ru: "Лицензированный агент" },
  danismanIlanlari:{ tr: "İlanları", en: "Listings", ru: "Объявления" },
  danismanProfil: { tr: "Danışman profili", en: "Agent profile", ru: "Профиль агента" },
  mesajBaslik:    { tr: "Danışmana mesaj", en: "Message the agent", ru: "Сообщение агенту" },
  mesajAciklama:  {
    tr: "Prototipte mesaj sunucuya gitmez; metin WhatsApp'a hazır olarak aktarılır. Faz 1'de lead sistemine bağlanacak.",
    en: "In the prototype nothing is sent to a server; the text is handed to WhatsApp. Phase 1 connects this to the lead system.",
    ru: "В прототипе сообщение не уходит на сервер; текст передаётся в WhatsApp.",
  },
  mesajYerTutucu: { tr: "Merhaba, bu ilanla ilgileniyorum. Görüntüleme için uygun olduğunuz bir zaman var mı?", en: "Hello, I'm interested in this listing. When would be a good time to view it?", ru: "Здравствуйте, меня интересует это объявление. Когда можно посмотреть?" },
  whatsappGonder: { tr: "WhatsApp ile gönder", en: "Send via WhatsApp", ru: "Отправить в WhatsApp" },
  digerIlanlari:  { tr: "Bu danışmanın diğer ilanları", en: "Other listings by this agent", ru: "Другие объявления агента" },
  benzerIlanlar:  { tr: "Benzer ilanlar", en: "Similar listings", ru: "Похожие объявления" },

  favoriler:       { tr: "Favoriler", en: "Saved", ru: "Избранное" },
  favoriyeEkle:    { tr: "Favorilere ekle", en: "Save listing", ru: "В избранное" },
  favorindenCikar: { tr: "Favorilerden çıkar", en: "Remove from saved", ru: "Убрать из избранного" },
  ilanKarsilastir: { tr: "Karşılaştır", en: "Compare", ru: "Сравнить" },
  karsilastirmaKapat:{ tr: "Karşılaştırmayı kapat", en: "Close comparison", ru: "Закрыть сравнение" },
  karsilastirmaNot:{ tr: "Farklı olan satırlar koyu zeminde. En fazla 6 ilan karşılaştırılır.", en: "Rows that differ are highlighted. Up to 6 listings are compared.", ru: "Различающиеся строки выделены. Сравнивается до 6 объявлений." },
  sonBakilanlar:   { tr: "Son incelediğiniz ilanlar", en: "Recently viewed", ru: "Вы недавно смотрели" },
  favoriYok:       { tr: "Henüz favori eklemediniz.", en: "You haven't saved any listings yet.", ru: "Вы пока ничего не сохранили." },
  favoriNot:       {
    tr: "Favoriler şu an yalnızca bu tarayıcıda saklanır. Üyelik sistemi Faz 1'de gelecek.",
    en: "Saved listings are stored in this browser only. Accounts arrive in Phase 1.",
    ru: "Избранное хранится только в этом браузере. Аккаунты появятся в первой фазе.",
  },

  // --- Toplam maliyet ---
  maliyetBaslik: { tr: "Toplam maliyet", en: "Total cost to buy", ru: "Полная стоимость покупки" },
  maliyetAlt: {
    tr: "İlan fiyatının üstüne binen vergi ve harçlar. Rakiplerde bu hesap yok; alıcı genellikle bunu tapuda öğreniyor.",
    en: "Taxes and fees on top of the asking price. Competitors don't show this; buyers usually find out at the land registry.",
    ru: "Налоги и сборы сверх цены объявления. У конкурентов этого расчёта нет.",
  },
  ilanFiyati:   { tr: "İlan fiyatı", en: "Asking price", ru: "Цена объявления" },
  ekMaliyetler: { tr: "Ek maliyetler", en: "Additional costs", ru: "Дополнительные расходы" },
  toplamOdeme:  { tr: "Tahmini toplam", en: "Estimated total", ru: "Итого (оценка)" },
  kdvDahilEtiket:  { tr: "Fiyata KDV dahil", en: "VAT included in price", ru: "НДС включён в цену" },
  kdvHaricEtiket:  { tr: "Fiyata KDV dahil değil", en: "VAT not included in price", ru: "НДС не включён" },
  ilkAlimHakki: { tr: "İlk alım hakkını kullanıyorum (devir harcı %3)", en: "Using first-purchase right (transfer fee 3%)", ru: "Право первой покупки (сбор 3%)" },
  yabanciAliciyim: { tr: "Yabancı alıcıyım (satın alma izni gerekir)", en: "I am a foreign buyer (purchase permit required)", ru: "Я иностранный покупатель (нужно разрешение)" },
  maliyetUyari: {
    tr: "Oranlar prototip varsayılanıdır ve bağlayıcı değildir. Hukuki ve mali tavsiye yerine geçmez; işlem öncesi avukatınıza doğrulatın.",
    en: "Rates are prototype defaults and not binding. This is not legal or financial advice; confirm with your lawyer before proceeding.",
    ru: "Ставки — значения прототипа, не обязательные. Это не юридическая консультация; уточните у юриста.",
  },

  mKdv:        { tr: "KDV", en: "VAT", ru: "НДС" },
  mKdvNot:     { tr: "KDV mükellefi satıcıdan ilk devirde", en: "On first transfer from a VAT-registered vendor", ru: "При первой передаче от плательщика НДС" },
  mDevir:      { tr: "Tapu devir harcı", en: "Title transfer fee", ru: "Сбор за передачу титула" },
  mDevirNot:   { tr: "Standart oran", en: "Standard rate", ru: "Стандартная ставка" },
  mDevirIlkNot:{ tr: "Bir kereye mahsus indirimli hak", en: "One-time reduced entitlement", ru: "Однократная льготная ставка" },
  mDamga:      { tr: "Damga pulu", en: "Stamp duty", ru: "Гербовый сбор" },
  mDamgaNot:   { tr: "Sözleşmenin tapuya kaydı için", en: "For registering the contract", ru: "Для регистрации договора" },
  mAvukat:     { tr: "Avukat ücreti", en: "Legal fees", ru: "Услуги юриста" },
  mAvukatNot:  { tr: "Yaklaşık, sabit", en: "Approximate, fixed", ru: "Приблизительно, фиксировано" },
  mIzin:       { tr: "Satın alma izni başvurusu", en: "Purchase permit application", ru: "Заявление на разрешение" },
  mIzinNot:    { tr: "Yabancı alıcılar için", en: "For foreign buyers", ru: "Для иностранных покупателей" },

  arsaBuyuklugu:{ tr: "Arsa büyüklüğü", en: "Plot size", ru: "Размер участка" },
  donum:       { tr: "dönüm", en: "donum", ru: "донюм" },

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
