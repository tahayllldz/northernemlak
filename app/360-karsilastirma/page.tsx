import Gezinti360 from "@/components/Gezinti360";
import GezintiPannellum from "@/components/GezintiPannellum";

/**
 * 360 MOTOR KARSILASTIRMASI — gecici deneme sayfasi.
 *
 * Ayni panorama iki motorda yan yana: kendi yazdigimiz WebGL goruntuleyici ve
 * Pannellum. Karar verilince bu sayfa silinir.
 *
 * Marzipano listeye alinmadi: Google depoyu arsivledi, son commit Kasim 2021.
 */
const PANO = "/gorsel/360/girne-salon-test-360.jpeg";

export const metadata = { title: "360 motor karşılaştırması" };

export default function Karsilastirma() {
  return (
    <main className="kapsayici py-10">
      <h1 className="baslik text-[28px] text-deniz-700">360 motor karşılaştırması</h1>
      <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-sis">
        Aynı panorama, iki motor. Telefonda da açıp parmakla deneyin: sürükleme akıcılığı,
        yakınlaştırma, tam ekran ve kenara geldiğinizde ne olduğu farklı.
      </p>

      <section className="mt-8">
        <h2 className="baslik text-[20px] text-deniz-700">1 · Kendi görüntüleyicimiz</h2>
        <p className="mb-3 text-[13px] text-sis">
          Sıfır bağımlılık · ~13 KB kaynak · yatay açı elle sınırlandı (±131°)
        </p>
        <Gezinti360 kaynak={PANO} dil="tr" baslik="Girne salon" />
      </section>

      <section className="mt-12">
        <h2 className="baslik text-[20px] text-deniz-700">2 · Pannellum</h2>
        <p className="mb-3 text-[13px] text-sis">
          MIT · 56 KB + 10 KB CSS (gzip ~21 KB) · <code>haov=262</code>, <code>vaov=76</code> ile
          kısmi panorama olarak tanımlandı — sınırlamayı kütüphane kendisi yapıyor
        </p>
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-kum-200 kart-golge">
          <GezintiPannellum kaynak={PANO} />
        </div>
      </section>

      <section className="mt-12 max-w-[70ch] rounded-xl border border-hat bg-white p-5">
        <h2 className="baslik text-[18px] text-deniz-700">Bilinmesi gereken</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-murekkep/85">
          Motor değiştirmek içerik sorununu çözmez. Bu panorama gerçek bir 360 kamera
          çıktısı değil; altı fotoğraftan AI ile birleştirildi, yaklaşık 262° kullanılabilir
          yay veriyor ve kenarları birbirini tutmuyor. Her iki motorda da aynı görüntüyü
          görüyorsunuz. Gerçek kazanç 360 kamerayla çekilmiş, gerçekten kapanan
          panoramalarda ortaya çıkar.
        </p>
      </section>
    </main>
  );
}
