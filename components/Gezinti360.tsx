"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * 360 GEZINTI — bagimliliksiz WebGL silindirik panorama goruntuleyici.
 *
 * Neden kendi yazdik: three.js / pannellum eklemek yerine ~120 satirlik bir
 * fragment shader yetiyor. CLAUDE.md "yeni agir bagimlilik ekleme" diyor.
 *
 * Kaynak goruntu 4:1 silindirik panorama (~±38 dikey).
 *
 * ONEMLI: AI ile uretilen panoramalar gercekten 360 derece KAPANMIYOR —
 * sol ve sag kenar birbirini tutmuyor (olculdu: ortalama kenar farki 26/255,
 * en kotu satir 146/255). Sinirsiz dondurulurse kullanici sert bir dikise
 * carpiyor. Bu yuzden `tam360` false iken yatay aci, dikis goruntuye hic
 * girmeyecek sekilde sinirlaniyor ve otomatik donus ucta geri donuyor.
 * Gercek 360 kamera cikisi kullanilirsa tam360 true verilir.
 *
 * Dikisi olcmek icin: node scripts/panorama-dikis.mjs <dosya>
 */

const VS = `
attribute vec2 kose;
varying vec2 ndc;
void main() { ndc = kose; gl_Position = vec4(kose, 0.0, 1.0); }
`;

const FS = `
precision highp float;
varying vec2 ndc;
uniform sampler2D doku;
uniform float yaw, pitch, fov, en, boy;
const float PI = 3.14159265359;

void main() {
  float tanYari = tan(fov * 0.5);
  vec3 d = normalize(vec3(ndc.x * tanYari * (en / boy), ndc.y * tanYari, -1.0));

  // pitch (X ekseni) sonra yaw (Y ekseni)
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);

  float lon = atan(d.x, -d.z);
  float u = lon / (2.0 * PI) + 0.5;

  // Silindirik izdusum: v, enlem tanjantinda dogrusaldir (4:1 -> +-38 derece)
  float yatayUz = max(length(d.xz), 1e-4);
  float yCyl = d.y / yatayUz;
  float v = 0.5 - yCyl / (PI * 0.5);

  vec3 renk = texture2D(doku, vec2(u, clamp(v, 0.0, 1.0))).rgb;
  // Dikey sinirin disinda hafif karart — smear yerine kasitli vinyet
  float disari = max(0.0, abs(v - 0.5) - 0.5) * 6.0;
  renk *= 1.0 - clamp(disari, 0.0, 0.75);
  gl_FragColor = vec4(renk, 1.0);
}
`;

function programYap(gl: WebGLRenderingContext) {
  const derle = (tip: number, kaynak: string) => {
    const s = gl.createShader(tip)!;
    gl.shaderSource(s, kaynak);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, derle(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, derle(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "program");
  return p;
}

export default function Gezinti360({ kaynak, odalar, dil, baslik, tam360 = false }: { kaynak: string; odalar?: string[]; dil: Dil; baslik: string; tam360?: boolean }) {
  const liste = odalar && odalar.length > 1 ? odalar : [kaynak];
  const [odaIndeks, setOdaIndeks] = useState(0);
  const aktifKaynak = liste[Math.min(odaIndeks, liste.length - 1)];
  const kutuRef = useRef<HTMLDivElement>(null);
  const tuvalRef = useRef<HTMLCanvasElement>(null);
  const durum = useRef({ yaw: 0, pitch: 0, fov: 1.2, otomatik: true, yon: -1, surukluyor: false, sonX: 0, sonY: 0, pinch: 0 });

  /**
   * Dikis goruntuye girmesin: gorus alaninin yarisi + emniyet payi kadar iceride dur.
   * Pay 0.05 iken dikis sag sinirda kadraja giriyordu (olculdu); 0.25 rad (~14 derece)
   * ile iki sinir da temiz. fov 1.2'de tarama araligi ~262 derece kaliyor.
   */
  const EMNIYET = 0.25;
  const yawSinir = (fov: number) => Math.max(0.35, Math.PI - fov * 0.5 - EMNIYET);
  const yawKilitle = (y: number, fov: number) => {
    if (tam360) return y;
    const s = yawSinir(fov);
    return Math.max(-s, Math.min(s, y));
  };
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);
  const [tamEkran, setTamEkran] = useState(false);

  const tamEkranDegis = useCallback(() => {
    const el = kutuRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const f = () => setTamEkran(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  useEffect(() => {
    const tuval = tuvalRef.current;
    if (!tuval) return;
    const gl = tuval.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) { setHata(true); setYukleniyor(false); return; }

    let program: WebGLProgram;
    try { program = programYap(gl); } catch { setHata(true); setYukleniyor(false); return; }

    const tampon = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const kose = gl.getAttribLocation(program, "kose");
    gl.enableVertexAttribArray(kose);
    gl.vertexAttribPointer(kose, 2, gl.FLOAT, false, 0, 0);

    const u = {
      yaw: gl.getUniformLocation(program, "yaw"),
      pitch: gl.getUniformLocation(program, "pitch"),
      fov: gl.getUniformLocation(program, "fov"),
      en: gl.getUniformLocation(program, "en"),
      boy: gl.getUniformLocation(program, "boy"),
    };

    const doku = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, doku);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([235, 227, 214]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tam360 ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const gorsel = new Image();
    gorsel.crossOrigin = "anonymous";
    gorsel.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, doku);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, gorsel);
      setYukleniyor(false);
    };
    // Eniyileyici bir sebeple reddederse ham dosyaya dus; gezinti yine calissin.
    let denendi = false;
    gorsel.onerror = () => {
      if (!denendi) { denendi = true; gorsel.src = aktifKaynak; return; }
      setHata(true); setYukleniyor(false);
    };
    // Next'in eniyileyicisi ayni kaynaktan WebP dondurur.
    // q yalnizca 75 olabilir (Next 16 varsayilan images.qualities); 80 -> HTTP 400.
    gorsel.src = `/_next/image?url=${encodeURIComponent(aktifKaynak)}&w=2048&q=75`;

    let calisiyor = true;
    let sonZaman = performance.now();

    const ciz = (zaman: number) => {
      if (!calisiyor) return;
      const dt = Math.min(0.05, (zaman - sonZaman) / 1000);
      sonZaman = zaman;
      const d = durum.current;
      if (d.otomatik && !d.surukluyor) {
        d.yaw += d.yon * dt * 0.06;
        if (!tam360) {
          const s = yawSinir(d.fov);
          if (d.yaw <= -s || d.yaw >= s) { d.yon *= -1; d.yaw = Math.max(-s, Math.min(s, d.yaw)); }
        }
      }

      const oran = Math.min(window.devicePixelRatio || 1, 2);
      const en = Math.round(tuval.clientWidth * oran);
      const boy = Math.round(tuval.clientHeight * oran);
      if (tuval.width !== en || tuval.height !== boy) { tuval.width = en; tuval.height = boy; }
      gl.viewport(0, 0, en, boy);

      if (!tam360) d.yaw = Math.max(-yawSinir(d.fov), Math.min(yawSinir(d.fov), d.yaw));
      gl.uniform1f(u.yaw, d.yaw);
      gl.uniform1f(u.pitch, d.pitch);
      gl.uniform1f(u.fov, d.fov);
      gl.uniform1f(u.en, en);
      gl.uniform1f(u.boy, boy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(ciz);
    };
    requestAnimationFrame(ciz);

    return () => { calisiyor = false; gl.deleteTexture(doku); gl.deleteBuffer(tampon); gl.deleteProgram(program); };
  }, [aktifKaynak, tam360]);

  // --- Etkilesim ---
  const basla = (x: number, y: number) => {
    const d = durum.current;
    d.surukluyor = true; d.otomatik = false; d.sonX = x; d.sonY = y;
  };
  const tasi = (x: number, y: number) => {
    const d = durum.current;
    if (!d.surukluyor) return;
    const k = d.fov / 900;
    d.yaw = yawKilitle(d.yaw - (x - d.sonX) * k, d.fov);
    d.pitch = Math.max(-0.6, Math.min(0.6, d.pitch + (y - d.sonY) * k));
    d.sonX = x; d.sonY = y;
  };
  const bitir = () => { durum.current.surukluyor = false; };
  const yakinlastir = (fark: number) => {
    const d = durum.current;
    d.fov = Math.max(0.6, Math.min(1.6, d.fov + fark));
    d.yaw = yawKilitle(d.yaw, d.fov); // uzaklasinca sinir daralir
  };

  const tusBas = (e: React.KeyboardEvent) => {
    const d = durum.current;
    const adim = 0.08;
    if (e.key === "ArrowLeft") { d.otomatik = false; d.yaw = yawKilitle(d.yaw + adim, d.fov); e.preventDefault(); }
    else if (e.key === "ArrowRight") { d.otomatik = false; d.yaw = yawKilitle(d.yaw - adim, d.fov); e.preventDefault(); }
    else if (e.key === "ArrowUp") { d.otomatik = false; d.pitch = Math.min(0.6, d.pitch + adim); e.preventDefault(); }
    else if (e.key === "ArrowDown") { d.otomatik = false; d.pitch = Math.max(-0.6, d.pitch - adim); e.preventDefault(); }
    else if (e.key === "+" || e.key === "=") yakinlastir(-0.1);
    else if (e.key === "-") yakinlastir(0.1);
  };

  if (hata) return null;

  return (
    <div ref={kutuRef} className={`gezinti ${tamEkran ? "gezinti-tam" : ""}`}>
      <canvas
        ref={tuvalRef}
        className="gezinti-tuval"
        role="img"
        aria-label={`${t("gezinti360", dil)} — ${baslik}`}
        tabIndex={0}
        onKeyDown={tusBas}
        onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); basla(e.clientX, e.clientY); }}
        onPointerMove={(e) => tasi(e.clientX, e.clientY)}
        onPointerUp={bitir}
        onPointerCancel={bitir}
        onWheel={(e) => { durum.current.otomatik = false; yakinlastir(e.deltaY * 0.0012); }}
        onTouchMove={(e) => {
          if (e.touches.length !== 2) return;
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const mesafe = Math.hypot(dx, dy);
          const d = durum.current;
          if (d.pinch) yakinlastir((d.pinch - mesafe) * 0.002);
          d.pinch = mesafe;
        }}
        onTouchEnd={() => { durum.current.pinch = 0; }}
      />

      {yukleniyor && <div className="gezinti-yukleniyor"><span className="iskelet block h-full w-full" /></div>}

      {liste.length > 1 && (
        <div className="gezinti-odalar">
          {liste.map((_, n) => (
            <button key={n} type="button" onClick={() => { setYukleniyor(true); setOdaIndeks(n); }}
              aria-pressed={n === odaIndeks}
              className={`gezinti-oda ${n === odaIndeks ? "secili" : ""}`}>
              {t("odaSec", dil)} {n + 1}
            </button>
          ))}
        </div>
      )}

      <div className="gezinti-ipucu">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" /><path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" />
        </svg>
        {t("gezintiIpucu", dil)}
      </div>

      <button type="button" onClick={tamEkranDegis} aria-label={t(tamEkran ? "kapat" : "tamEkran", dil)}
        className="gezinti-dugme">
        {tamEkran ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className="damga">{t("aiRozet", dil)}</span>
    </div>
  );
}
