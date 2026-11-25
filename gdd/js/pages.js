// Páginas arrancadas: cada folha é pintada em pixel art num canvas atrás do texto.
// Bordas rasgadas com fibra clara, mordidas, queimados, manchas, vinco, furos e canto dobrado.
(() => {
  'use strict';
  const U = 3;   // px de tela por pixel da folha (igual ao cenário)
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Perfil de uma borda rasgada: passeio aleatório com algumas mordidas mais fundas.
  function edge(n, r, lo, hi, rough, bites) {
    const a = new Float32Array(n);
    let v = lo + r() * (hi - lo) * 0.5;
    for (let i = 0; i < n; i++) {
      if (r() < rough) v += r() < 0.5 ? -1 : 1;
      if (r() < rough * 0.15) v += (r() - 0.5) * 4;
      v = Math.max(lo, Math.min(hi, v));
      a[i] = v;
    }
    for (let b = 0; b < bites; b++) {
      const c = Math.floor(r() * n), wd = 3 + Math.floor(r() * 6), dp = 3 + r() * 5;
      for (let i = -wd; i <= wd; i++) { const k = c + i; if (k >= 0 && k < n) a[k] = Math.max(a[k], Math.min(hi + 4, lo + dp * (1 - Math.abs(i) / (wd + 1)))); }
    }
    return a;
  }

  function paint(page, seed) {
    const pw = page.offsetWidth, ph = page.offsetHeight;
    if (!pw || !ph) return;
    let cv = page.querySelector(':scope > .paper');
    if (!cv) { cv = document.createElement('canvas'); cv.className = 'paper'; cv.setAttribute('aria-hidden', 'true'); page.prepend(cv); }
    const w = Math.ceil(pw / U), h = Math.ceil(ph / U);
    if (cv.width === w && cv.height === h && cv.dataset.seed === String(seed)) return;
    cv.width = w; cv.height = h; cv.dataset.seed = String(seed);
    const g = cv.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    const r = rng(seed * 9973 + 11);

    const top = edge(w, r, 1, 5, 0.6, 1 + Math.floor(w / 90));
    const bot = edge(w, r, 1, 7, 0.65, 1 + Math.floor(w / 70));
    const lef = edge(h, r, 2, 8, 0.75, 1 + Math.floor(h / 60));   // lado arrancado da lombada: o mais irregular
    const rig = edge(h, r, 0, 3, 0.4, Math.floor(h / 120));
    // canto que falta e canto dobrado
    const miss = Math.floor(r() * 3), ms = 6 + Math.floor(r() * 8);          // 0: sup. esq., 1: sup. dir., 2: inf. esq.
    const ear = 8 + Math.floor(r() * 6);                                     // dobra no canto inferior direito
    // queimados na borda, manchas, furos e vinco
    const burns = []; for (let i = 0, n = 1 + Math.floor(r() * 3); i < n; i++) { const s = Math.floor(r() * 4); burns.push({ x: s === 2 ? 1 : s === 3 ? w - 2 : r() * w, y: s === 0 ? 1 : s === 1 ? h - 2 : r() * h, rad: 7 + r() * 11 }); }
    const stains = []; for (let i = 0, n = 1 + Math.floor(r() * 2); i < n; i++) stains.push({ x: r() * w, y: r() * h, rx: 8 + r() * 22, ry: 6 + r() * 14 });
    const holes = []; for (let i = 0, n = Math.floor(r() * 3); i < n; i++) { const s = r() < 0.5; holes.push({ x: s ? 9 + r() * 5 : w - 8 - r() * 4, y: 12 + r() * (h - 24), rad: 1.5 + r() * 1.8 }); }
    const crease = Math.round(h * (0.38 + r() * 0.24)), vcrease = r() < 0.5 ? Math.round(w * (0.42 + r() * 0.16)) : -1;
    const fox = []; for (let i = 0, n = 10 + Math.floor(r() * 14); i < n; i++) fox.push([Math.floor(r() * w), Math.floor(r() * h), r() < 0.3 ? 2 : 1]);

    const inside = (x, y) => {
      if (x < lef[y] || x >= w - rig[y] || y < top[x] || y >= h - bot[x]) return false;
      if (miss === 0 && x + y < ms + lef[y]) return false;
      if (miss === 1 && (w - 1 - x) + y < ms) return false;
      if (miss === 2 && x + (h - 1 - y) < ms + lef[y]) return false;
      if ((w - 1 - x) + (h - 1 - y) < ear) return false;                    // parte dobrada para cima
      for (const b of burns) { const dx = x - b.x, dy = y - b.y; if (dx * dx + dy * dy < b.rad * b.rad * 0.22) return false; }
      for (const o of holes) { const dx = x - o.x, dy = y - o.y; if (dx * dx + dy * dy < o.rad * o.rad) return false; }
      return true;
    };
    const mask = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) mask[y * w + x] = inside(x, y) ? 1 : 0;
    // distância até a borda (até 6), por varreduras
    const dist = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) dist[i] = mask[i] ? 7 : 0;
    for (let pass = 1; pass <= 6; pass++) {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (dist[i] !== 7) continue;
        const e = pass - 1;
        const nb = (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? (e === 0) : (dist[i - 1] === e || dist[i + 1] === e || dist[i - w] === e || dist[i + w] === e);
        if (nb) dist[i] = pass === 7 ? 6 : pass;
      }
    }

    const noise = rng(seed * 31 + 5);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x, j = i * 4;
        if (!mask[i]) continue;
        const bay = BAYER[(x & 3) + ((y & 3) << 2)] / 16 - 0.5;
        // papel: mais claro no alto, levemente mais escuro embaixo
        const t = y / h;
        let cr = 228 - 20 * t, cg = 200 - 28 * t, cb = 146 - 32 * t;
        let k = 1 + (noise() - 0.5) * 0.05;
        // manchas com anel mais escuro
        for (const s of stains) {
          const wob = 1 + 0.18 * Math.sin(Math.atan2(y - s.y, x - s.x) * 3 + s.x) + 0.1 * Math.sin(Math.atan2(y - s.y, x - s.x) * 7 + s.y);
          const q = (((x - s.x) / s.rx) ** 2 + ((y - s.y) / s.ry) ** 2) / wob;
          if (q < 1) k *= q > 0.8 + bay * 0.12 ? 0.93 : 0.975;
        }
        // envelhecido perto da borda, em degraus com pontilhado
        const dd = dist[i];
        if (dd < 7) { const lv = Math.floor(dd + bay * 1.6); k *= lv <= 2 ? 0.76 : lv <= 4 ? 0.86 : 0.94; }
        // queimado: marrom que vira carvão junto ao buraco
        let burn = 0;
        for (const b of burns) { const q = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2) / b.rad; if (q < 1) burn = Math.max(burn, 1 - q); }
        if (burn > 0) {
          const bl = Math.min(1, Math.floor((burn * 1.5 + bay * 0.25) * 5) / 5);
          cr += (38 - cr) * bl; cg += (20 - cg) * bl; cb += (18 - cb) * bl;
        }
        // vincos de dobra
        if (y === crease) k *= 0.84; else if (y === crease - 1) k *= 1.07;
        if (x === vcrease) k *= 0.88; else if (x === vcrease - 1) k *= 1.05;
        cr *= k; cg *= k; cb *= k;
        // fibra clara exposta no rasgo
        if (dd === 1 && burn < 0.25) { const f = noise() < 0.75 ? 0.85 : 0.4; cr += (246 - cr) * f; cg += (232 - cg) * f; cb += (198 - cb) * f; }
        else if (dd === 2 && burn < 0.25 && noise() < 0.35) { cr += (246 - cr) * 0.4; cg += (232 - cg) * 0.4; cb += (198 - cb) * 0.4; }
        d[j] = cr; d[j + 1] = cg; d[j + 2] = cb; d[j + 3] = 255;
      }
    }
    // pintas de mofo (foxing)
    for (const [fx, fy, s] of fox) for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) {
      const x = fx + xx, y = fy + yy; if (x >= w || y >= h || !mask[y * w + x]) continue;
      const j = (y * w + x) * 4; d[j] *= 0.8; d[j + 1] *= 0.72; d[j + 2] *= 0.62;
    }
    // canto dobrado: verso mais claro, com sombra na dobra
    for (let y = h - ear * 2; y < h; y++) for (let x = w - ear * 2; x < w; x++) {
      if (x < 0 || y < 0) continue;
      const s = (w - 1 - x) + (h - 1 - y), j = (y * w + x) * 4;
      if (s >= ear && s < ear * 2 && (w - 1 - x) < ear * 2 - 1 && (h - 1 - y) < ear * 2 - 1 && mask[y * w + x]) {
        const edgeK = s === ear ? 0.62 : s === ear + 1 ? 0.8 : s >= ear * 2 - 2 ? 0.86 : 1;
        if ((w - 1 - x) < ear && (h - 1 - y) < ear) { d[j] = 240 * edgeK; d[j + 1] = 222 * edgeK; d[j + 2] = 180 * edgeK; d[j + 3] = 255; }
        else if (s === ear * 2 - 1 || s === ear) { d[j] *= 0.8; d[j + 1] *= 0.8; d[j + 2] *= 0.8; }
      }
    }
    g.putImageData(img, 0, 0);
  }

  window.thendTear = paint;   // usado pelo leitor do diário, que só ganha tamanho ao abrir
  const pages = Array.from(document.querySelectorAll('.page'));
  const paintAll = () => pages.forEach((p, i) => paint(p, i + 1));
  paintAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintAll);
  addEventListener('load', paintAll);
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(paintAll, 120); });
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(paintAll, 120); }); pages.forEach((p) => ro.observe(p)); }

  const sheets = document.querySelectorAll('.sheet');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    sheets.forEach((s) => io.observe(s));
  } else {
    sheets.forEach((s) => s.classList.add('in'));
  }
})();
