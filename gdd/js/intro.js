// Abertura: o livro vermelho de Thucker abre, as páginas voam e se corrompem até virar a logo.
// Com a logo travada, o olho segue o mouse. Ao rolar a página, tudo volta: a logo some e o livro se fecha.
(() => {
  'use strict';
  const cv = document.getElementById('book');
  const sec = document.getElementById('intro');
  if (!cv || !sec) return;
  const ctx = cv.getContext('2d');
  const hint = document.querySelector('.hint');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tudo é desenhado nas coordenadas da logo (635 x 601), com uma margem em volta.
  const LW = 635, LH = 601, PAD = 70, OW = LW + PAD * 2, OH = LH + PAD * 2;
  const BX = 318 + PAD, BY = 292 + PAD;        // miolo do livro dentro da logo
  const PW = 250, PGH = 300, M = 10;           // página e margem da capa
  const TOP = BY - PGH / 2;
  const EYE = { x: 316 + PAD, y: 142 + PAD };  // orbe da logo
  const Q = 4, MW = Math.ceil(OW / Q), MH = Math.ceil(OH / Q);

  // Linha do tempo, em segundos
  const END = 5.4, T_OPEN0 = 0.7, T_OPEN1 = 1.7, T_FLIP0 = 1.5, T_FLIP1 = 4.3, T_DIS0 = 3.5, T_DIS1 = 5.1, T_CLOSED = 0.7;

  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (t) => t * t * (3 - 2 * t);
  const mix = (a, b, t) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const logo = new Image();
  let ready = false;
  let logoShadow = null;
  logo.onload = () => {
    logoShadow = mk(logo.naturalWidth, logo.naturalHeight);
    const sg = logoShadow.getContext('2d');
    sg.drawImage(logo, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#000'; sg.fillRect(0, 0, logoShadow.width, logoShadow.height);
    ready = true;
  };
  logo.src = 'assets/logo.png';

  const bookL = mk(OW, OH), bg = bookL.getContext('2d');
  const tmpA = mk(OW, OH), ga = tmpA.getContext('2d');
  const tmpB = mk(OW, OH), gb = tmpB.getContext('2d');
  const tmpU = mk(OW, OH), gu = tmpU.getContext('2d');
  const maskC = mk(MW, MH), gm = maskC.getContext('2d');
  const emberC = mk(MW, MH), ge = emberC.getContext('2d');
  const maskD = gm.createImageData(MW, MH), emberD = ge.createImageData(MW, MH);
  [bg, ga, gb, gu].forEach((g) => { g.imageSmoothingEnabled = false; });

  // Ordem em que a corrupção se espalha: do miolo para fora, com ruído.
  const thr = new Float32Array(MW * MH);
  (() => {
    const r = rng(31), GN = 12, grid = Array.from({ length: (GN + 1) * (GN + 1) }, () => r());
    const sm = (t) => t * t * (3 - 2 * t);
    const gv = (a, b) => grid[Math.min(GN, b) * (GN + 1) + Math.min(GN, a)];
    const vn = (u, v) => {
      const x = u * GN, y = v * GN, x0 = Math.floor(x), y0 = Math.floor(y), fx = sm(x - x0), fy = sm(y - y0);
      return (gv(x0, y0) * (1 - fx) + gv(x0 + 1, y0) * fx) * (1 - fy) + (gv(x0, y0 + 1) * (1 - fx) + gv(x0 + 1, y0 + 1) * fx) * fy;
    };
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const d = Math.min(1, Math.hypot((x * Q - BX) / 340, (y * Q - BY) / 320));
      thr[y * MW + x] = Math.min(0.995, 0.74 * d + 0.22 * vn(x / MW, y / MH) + 0.04 * r());
    }
  })();

  // ----- Capa vermelha (textura fixa) -----
  const CW = PW + M, CH = PGH + M * 2;
  const coverTex = mk(CW, CH);
  (() => {
    const g = coverTex.getContext('2d'), r = rng(8);
    const line = (x0, y0, x1, y1, w, col) => {
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2);
      g.fillStyle = col;
      for (let i = 0; i <= n; i++) {
        const f = i / n, t = Math.max(2, Math.round(w * Math.sin(Math.PI * f) + 1));
        g.fillRect(Math.round(x0 + (x1 - x0) * f - t / 2), Math.round(y0 + (y1 - y0) * f - t / 2), t, t);
      }
    };
    g.fillStyle = '#a83646'; g.fillRect(0, 0, CW, CH);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = r() < 0.5 ? '#b5404c' : '#9a3042';
      g.fillRect(Math.floor(r() * CW), Math.floor(r() * CH), 2 + Math.floor(r() * 3), 1 + Math.floor(r() * 2));
    }
    // luz quente no canto inferior
    for (let i = 0; i < 26; i++) { g.fillStyle = i % 2 ? '#c85a50' : '#bb4a4c'; g.fillRect(40 + i * 8, CH - 30 + Math.floor(r() * 10), 10, 22); }
    g.fillStyle = '#e07a4e'; g.fillRect(24, CH - 7, CW - 30, 3);
    // bordas e lombada
    g.fillStyle = '#7c2438'; g.fillRect(0, 0, CW, 4); g.fillRect(CW - 4, 0, 4, CH); g.fillRect(0, CH - 4, CW, 4);
    g.fillStyle = '#8a2a3c'; g.fillRect(0, 0, 20, CH);
    g.fillStyle = '#c9545a'; g.fillRect(20, 4, 2, CH - 8);
    g.fillStyle = '#5e1c30'; g.fillRect(0, 44, 20, 4); g.fillRect(0, CH - 48, 20, 4); g.fillRect(0, 0, 3, CH);
    // assinatura rabiscada e os cortes na capa
    const ink = '#4a1428';
    let px = 78, py = 52;
    [[92, 40], [100, 56], [112, 42], [124, 58], [138, 44], [150, 56], [166, 46], [190, 50]].forEach(([x, y]) => { line(px, py, x, y, 2, ink); px = x; py = y; });
    line(70, 46, 96, 36, 2, ink);
    line(118, 110, 196, 236, 6, ink);
    line(168, 104, 126, 222, 5, ink);
    line(100, 158, 206, 190, 5, ink);
    line(176, 130, 150, 250, 4, ink);
  })();

  // O livro é montado a partir da arte frontal (assets/book-front.webp): a proporção, a lombada,
  // a borda das folhas e as cores vêm dela. Sem a imagem, vale a capa desenhada em código acima.
  let art = null;
  const P0 = { pw: PW, pgh: PGH };   // medidas do livro fechado (depois mudam para as da logo)
  const AW = 257, SPINE_F = 0.092, STRIP_F = 0.036;
  const bookImg = new Image();
  bookImg.onload = () => {
    const sw = bookImg.naturalWidth, sh = bookImg.naturalHeight;
    const sc = mk(sw, sh), sg = sc.getContext('2d', { willReadFrequently: true });
    sg.drawImage(bookImg, 0, 0);
    const im = sg.getImageData(0, 0, sw, sh), d = im.data;
    // Recorte: tira o fundo e a franja clara que sobra na borda da arte.
    // 1) fundo = transparente, ou claro e sem cor; 2) encolhe a silhueta alguns pixels.
    const solid = new Uint8Array(sw * sh);
    for (let i = 0, k = 0; i < sw * sh; i++, k += 4) {
      const mx = Math.max(d[k], d[k + 1], d[k + 2]), mn = Math.min(d[k], d[k + 1], d[k + 2]);
      solid[i] = d[k + 3] > 200 && !(mn > 185 && mx - mn < 45) ? 1 : 0;
    }
    const ER = Math.max(2, Math.round(sw / 290));
    const tmp = new Uint8Array(sw * sh);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let v = 1;
      for (let e = -ER; e <= ER && v; e++) { const xx = x + e; if (xx < 0 || xx >= sw || !solid[y * sw + xx]) v = 0; }
      tmp[y * sw + x] = v;
    }
    let x0 = sw, y0 = sh, x1 = 0, y1 = 0;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let v = 1;
      for (let e = -ER; e <= ER && v; e++) { const yy = y + e; if (yy < 0 || yy >= sh || !tmp[yy * sw + x]) v = 0; }
      const k = (y * sw + x) * 4;
      if (!v) { d[k + 3] = 0; continue; }
      d[k + 3] = 255;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 <= x0 || y1 <= y0) return;
    sg.putImageData(im, 0, 0);
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    const ah = Math.round(AW * bh / bw);
    const tc = mk(AW, ah), tg = tc.getContext('2d', { willReadFrequently: true });
    tg.imageSmoothingEnabled = true; tg.imageSmoothingQuality = 'high';
    tg.drawImage(sc, x0, y0, bw, bh, 0, 0, AW, ah);
    const spine = Math.round(AW * SPINE_F), strip = Math.round(AW * STRIP_F), face = AW - spine - strip;
    // contorno duro e menos tons, para combinar com o pixel art; e a cor média da capa
    const o = tg.getImageData(0, 0, AW, ah), q = o.data;
    let r = 0, gg = 0, bl = 0, n = 0;
    for (let i = 0; i < q.length; i += 4) {
      q[i + 3] = q[i + 3] > 215 ? 255 : 0;
      q[i] = Math.round(q[i] / 14) * 14; q[i + 1] = Math.round(q[i + 1] / 14) * 14; q[i + 2] = Math.round(q[i + 2] / 14) * 14;
      const x = (i / 4) % AW;
      if (q[i + 3] && x > spine + 8 && x < spine + face - 8) { r += q[i]; gg += q[i + 1]; bl += q[i + 2]; n++; }
    }
    tg.putImageData(o, 0, 0);
    if (n) {
      const avg = [r / n, gg / n, bl / n];
      C.cover[0] = avg.map((v) => v * 0.9); C.coverDeep[0] = avg.map((v) => v * 0.6); C.endpaper[0] = avg.map((v) => v * 0.72);
    }
    P0.pw = face - M; P0.pgh = ah - M * 2;
    art = { c: tc, w: AW, h: ah, spine, strip, face };
  };
  bookImg.src = 'assets/book-front.webp';

  // ----- Detalhes fixos do livro -----
  const dashes = (() => {
    const r = rng(12), rows = [];
    for (let row = 0; row < 23; row++) {
      const segs = []; let x = 22;
      while (x < PW - 26) { const w = 8 + Math.floor(r() * 34); if (r() > 0.14) segs.push([x, Math.min(w, PW - 26 - x)]); x += w + 5; }
      rows.push(segs);
    }
    return rows;
  })();
  const blots = (() => { const r = rng(44), a = []; for (let i = 0; i < 70; i++) a.push({ x: r() * PW, y: r() * PGH, w: 6 + r() * 30, h: 4 + r() * 18, t: r() }); return a; })();
  const drips = (() => { const r = rng(61), a = []; for (let i = 0; i < 16; i++) a.push({ x: BX - 240 + r() * 480, len: 18 + r() * 80, w: 4 + Math.floor(r() * 3) * 2 }); return a; })();
  const SPIKES = [[-228, -150, -0.55, -0.83, 92, 28], [228, -150, 0.55, -0.83, 92, 28], [-258, -50, -1, -0.25, 62, 22], [258, -50, 1, -0.25, 62, 22], [-80, -158, -0.3, -0.95, 58, 22], [80, -158, 0.3, -0.95, 58, 22], [-262, 90, -1, 0.3, 40, 18], [262, 90, 1, 0.3, 40, 18]];
  const NLEAF = 12;
  const leaves = Array.from({ length: NLEAF }, (_, i) => {
    const f = i / (NLEAF - 1);
    const dur = 0.52 - 0.24 * f;
    return { t0: T_FLIP0 + Math.pow(f, 0.8) * (T_FLIP1 - T_FLIP0 - 0.3), dur };
  });
  const fliers = (() => {
    const r = rng(99), a = [];
    for (let i = 0; i < 28; i++) {
      const t0 = T_FLIP0 + 0.15 + r() * (T_FLIP1 - T_FLIP0 - 0.7);
      a.push({ t0, t1: Math.min(t0 + 1.5 + r() * 1.1, T_DIS1 - 0.05), R: 190 + r() * 190, a0: r() * 6.283, dir: r() < 0.5 ? -1 : 1, turns: 2.4 + r() * 3, ph: r() * 6.283, sz: 0.75 + r() * 0.6, ox: 0, oy: 0 });
    }
    return a;
  })();

  const C = {
    cover: [[124, 36, 56], [30, 14, 34]], coverDeep: [[94, 28, 48], [20, 9, 24]], endpaper: [[110, 40, 52], [44, 20, 42]],
    page: [[238, 216, 166], [205, 128, 62]], shade: [[196, 164, 116], [110, 52, 44]], ink: [[92, 58, 52], [40, 14, 30]],
  };

  let pw = PW, pgh = PGH, top = TOP, curveK = 1;   // curveK: 0 com o livro fechado (páginas retas), 1 aberto

  // Mapa de tinta por linha (quais colunas têm traço) e grão do papel, gerados uma vez.
  const INK = dashes.map((segs) => { const m = new Uint8Array(PW + 8); segs.forEach(([dx, dw]) => { for (let i = dx; i < dx + dw && i < m.length; i++) m[i] = 1; }); return m; });
  const GRAIN = (() => { const r = rng(203), a = []; for (let i = 0; i < 520; i++) a.push({ x: r(), y: r(), d: r() < 0.6, w: 1 + Math.floor(r() * 3) }); return a; })();
  const FIBERS = (() => { const r = rng(57), a = []; for (let i = 0; i < 26; i++) a.push({ x: r(), y: r(), len: 6 + Math.floor(r() * 16) }); return a; })();

  // Curva da página aberta: afunda junto ao miolo e faz uma barriga no meio.
  // f = 0 na lombada, 1 na borda externa. Retorna o desvio do topo e da base.
  function pageCurve(f) {
    const sag = 12 * Math.pow(1 - f, 2.4) * curveK;
    const belly = -5 * Math.sin(Math.PI * Math.min(1, f * 1.1)) * curveK;
    // a base fica sempre dentro da capa: só acompanha de leve a barriga e desce no máximo 3 px no miolo
    return [sag + belly, belly * 0.6 + 3 * Math.pow(1 - f, 1.5) * curveK];
  }
  // Luz ao longo da página: sombra no miolo, crista clara, leve queda na borda.
  function pageLight(f) {
    const gutter = clamp(f / 0.26);
    return 0.18 + 0.82 * (gutter * gutter * (3 - 2 * gutter)) - 0.14 * clamp((f - 0.72) / 0.28);
  }
  const TONES = 7;
  function tone(l, xi) { return clamp(Math.floor(l * TONES + (xi % 4 === 0 ? 0.5 : 0)) / TONES); }

  // Pontilhado: padrões 4x4 que misturam dois tons vizinhos, para o sombreado não sair em faixas lisas.
  const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const patC = Array.from({ length: (TONES + 2) * 3 }, () => mk(4, 4));
  let toneCol = [], tonePat = [];
  function setTones(g, sh, pg) {
    toneCol = []; tonePat = [];
    for (let lv = 0; lv <= TONES + 1; lv++) {
      const col = mix(sh, pg, clamp(lv / TONES)); toneCol.push(col);
      const row = [null];
      for (let k = 1; k <= 3; k++) {
        const c2 = patC[lv * 3 + k - 1], g2 = c2.getContext('2d');
        g2.clearRect(0, 0, 4, 4); g2.fillStyle = col;
        for (let i = 0; i < 16; i++) if (BAYER4[i] < k * 4) g2.fillRect(i & 3, i >> 2, 1, 1);
        row.push(g.createPattern(c2, 'repeat'));
      }
      tonePat.push(row);
    }
  }
  function ditherRect(g, x, y, w, h, l) {
    const v = clamp(l) * TONES, lv = Math.floor(v); let k = Math.round((v - lv) * 4), b = lv;
    if (k === 4) { b = lv + 1; k = 0; }
    g.fillStyle = toneCol[b]; g.fillRect(x, y, w, h);
    if (k > 0) { g.fillStyle = tonePat[b + 1][k]; g.fillRect(x, y, w, h); }
  }

  // Caligrafia: cada coluna de uma linha guarda o traço base (1), haste para cima (2), para baixo (4) ou corpo da letra (8).
  const SCRIPT = (() => {
    const r = rng(321), rows = [];
    for (let row = 0; row < 26; row++) {
      const m = new Uint8Array(PW + 8); let x = 20 + (r() < 0.2 ? 12 : 0);
      const end = PW - 22 - (r() < 0.25 ? Math.floor(r() * 80) : 0);
      while (x < end) {
        const wl = 6 + Math.floor(r() * 22);
        for (let i = 0; i < wl && x + i < end; i++) {
          let v = 1; const q = r();
          if (q < 0.16) v |= 2; else if (q < 0.26) v |= 4; else if (q < 0.5) v |= 8;
          if (r() < 0.12) v = 0;
          m[x + i] = v;
        }
        x += wl + 4 + Math.floor(r() * 4);
      }
      rows.push(m);
    }
    return rows;
  })();

  // Veias da corrupção: nascem no miolo e se espalham pelas páginas (coordenadas de 0 a 1 dentro da página).
  const VEINS = (() => {
    const r = rng(777), list = [];
    for (let i = 0; i < 20; i++) {
      let x = 0, y = 0.06 + r() * 0.88, a = (r() - 0.5) * 1.2;
      const pts = [], n = 60 + Math.floor(r() * 90);
      for (let k = 0; k < n; k++) { a += (r() - 0.5) * 0.45; a *= 0.96; x += Math.cos(a) * 0.011; y += Math.sin(a) * 0.009; if (x > 0.97 || x < 0 || y < 0.03 || y > 0.97) break; pts.push([x, y]); }
      list.push({ side: i % 2 ? 1 : -1, pts, start: r() * 0.35 });
    }
    return list;
  })();
  function inkLine(g, x0, y0, x1, y1, w) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) g.fillRect(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), w, w);
  }

  function pageBlock(g, sx, dir, w, c, flipped) {
    const pg = [0, 1, 2].map((j) => C.page[0][j] + (C.page[1][j] - C.page[0][j]) * c);
    const sh = [0, 1, 2].map((j) => C.shade[0][j] + (C.shade[1][j] - C.shade[0][j]) * c);
    const dk = sh.map((v) => v * 0.62);
    const ink = mix(C.ink[0], C.ink[1], c);
    const rows = Math.floor((pgh - 44) / 13);
    setTones(g, sh, pg);
    for (let xi = 0; xi < pw; xi += 2) {
      const f = (xi + 1) / pw, x = dir > 0 ? sx + xi : sx - xi - 2;
      const cv2 = pageCurve(f), y0 = Math.round(top + cv2[0]), y1 = Math.round(top + pgh + cv2[1]);
      const l = tone(pageLight(f), xi / 2);
      // pilha de folhas aparecendo por baixo, na base e na borda externa
      if (curveK > 0.5) {
        g.fillStyle = mix(dk, sh, 0.5); g.fillRect(x, y1, 2, 5);
        g.fillStyle = mix(sh, pg, 0.6); g.fillRect(x, y1 + 1, 2, 1); g.fillRect(x, y1 + 3, 2, 1);
      }
      ditherRect(g, x, y0, 2, y1 - y0, pageLight(f));
      // bordas envelhecidas
      g.fillStyle = mix(dk, pg, 0.55 * l + 0.2); g.fillRect(x, y0, 2, 2); g.fillRect(x, y1 - 3, 2, 3);
      g.fillStyle = mix(dk, pg, 0.75 * l + 0.2); g.fillRect(x, y0 + 2, 2, 2); g.fillRect(x, y1 - 6, 2, 3);
      if (f > 0.93) { g.fillStyle = mix(dk, sh, ((xi / 2) % 2) ? 0.9 : 0.35); g.fillRect(x, y0, 2, y1 - y0); }
      // caligrafia acompanhando a curva (pula a área do desenho)
      if (f > 0.08 && f < 0.92) {
        g.fillStyle = ink; g.globalAlpha = (0.78 - c * 0.3) * (0.55 + 0.45 * l);
        for (let r = 0; r < rows; r++) {
          const by = 24 + r * 13;
          if (r === 0) { if (xi > pw * 0.28 && xi < pw * 0.72) g.fillRect(x, y0 + 19, 2, 3); continue; }   // título
          if (f > 0.46 && f < 0.9 && by > pgh * 0.56 && by < pgh * 0.86) continue;
          const v = SCRIPT[(flipped ? r * 5 + 3 : r) % SCRIPT.length][xi];
          if (!v) continue;
          g.fillRect(x, y0 + by, 2, 2);
          if (v & 8) g.fillRect(x, y0 + by - 2, 1, 2);
          if (v & 2) g.fillRect(x, y0 + by - 6, 1, 6);
          if (v & 4) g.fillRect(x + 1, y0 + by + 2, 1, 4);
        }
        g.globalAlpha = 1;
      }
    }
    // capitular em vermelho, grão e fibras do papel
    const at = (fx) => { const xi = Math.round(fx * pw); return [dir > 0 ? sx + xi : sx - xi, pageCurve(fx)[0]]; };
    // desenhos a tinta: uma gosma na página da direita, a marca da capa na da esquerda
    {
      const q = at(0.68), cx2 = q[0], cy2 = Math.round(top + q[1] + pgh * 0.74);
      g.fillStyle = ink; g.globalAlpha = 0.8 - c * 0.3;
      if (!flipped) {
        for (let a = 0; a <= 40; a++) { const t = Math.PI * a / 40; g.fillRect(Math.round(cx2 + Math.cos(t) * 21), Math.round(cy2 - Math.sin(t) * 17 * (1 + 0.12 * Math.sin(t * 5))), 2, 2); }
        for (let i = -23; i <= 23; i += 2) g.fillRect(cx2 + i, cy2 + Math.round(Math.sin(i * 0.5) * 1.5), 2, 2);
        g.fillRect(cx2 - 8, cy2 - 9, 3, 3); g.fillRect(cx2 + 5, cy2 - 9, 3, 3);
        inkLine(g, cx2 - 4, cy2 - 3, cx2 + 4, cy2 - 3, 1); inkLine(g, cx2 - 26, cy2 + 3, cx2 - 30, cy2 + 8, 1); inkLine(g, cx2 + 26, cy2 + 3, cx2 + 31, cy2 + 7, 1);
      } else {
        inkLine(g, cx2 - 12, cy2 - 20, cx2 + 14, cy2 + 16, 2); inkLine(g, cx2 + 8, cy2 - 22, cx2 - 6, cy2 + 14, 2); inkLine(g, cx2 - 18, cy2 - 4, cx2 + 18, cy2 + 6, 2);
      }
      g.globalAlpha = 1;
    }
    if (!flipped) { const q = at(0.12); g.fillStyle = mix([140, 40, 44], C.ink[1], c); g.fillRect(q[0], Math.round(top + q[1] + 33), 12, 15); g.fillStyle = mix(C.page[0], C.page[1], c); g.fillRect(q[0] + 3, Math.round(top + q[1] + 36), 6, 3); g.fillRect(q[0] + 3, Math.round(top + q[1] + 42), 3, 6); }
    GRAIN.forEach((n) => {
      if (n.x < 0.03 || n.x > 0.95) return;
      const q = at(n.x);
      g.globalAlpha = n.d ? 0.2 : 0.3; g.fillStyle = n.d ? mix(dk, dk, 0) : '#fff3d0';
      g.fillRect(q[0], Math.round(top + q[1] + 6 + n.y * (pgh - 14)), n.w, 1);
    });
    g.globalAlpha = 0.16; g.fillStyle = mix(dk, dk, 0);
    FIBERS.forEach((n) => { if (n.x < 0.06 || n.x > 0.9) return; const q = at(n.x); g.fillRect(q[0], Math.round(top + q[1] + 8 + n.y * (pgh - 40)), 1, n.len); });
    g.globalAlpha = 1;
  }

  // Corrupção desenhada por cima das folhas: manchas de tinta escura e veias que crescem do miolo.
  function corruption(g, sx, dir, c) {
    if (c <= 0) return;
    const at = (fx) => { const xi = Math.round(fx * pw); return [dir > 0 ? sx + xi : sx - xi, pageCurve(fx)[0]]; };
      // tinta escura que se espalha em manchas redondas
      const lo = dir > 0 ? sx : sx - pw, hi = lo + pw;
      blots.forEach((b2) => {
        if (b2.t >= c * 0.9) return;
        const fx = clamp(b2.x / PW), q = at(fx);
        const rad = Math.min(b2.w * 0.6, (c * 0.9 - b2.t) * 46);
        const cy2 = top + q[1] + 6 + (b2.y / PGH) * (pgh - 30);
        g.globalAlpha = Math.min(0.7, (c * 0.9 - b2.t) * 3);
        for (let dy2 = -rad; dy2 <= rad; dy2 += 2) {
          const half = Math.sqrt(rad * rad - dy2 * dy2) * (0.85 + 0.15 * Math.sin(dy2 * 0.9 + b2.t * 40));
          const x0 = Math.max(lo, Math.round(q[0] - half)), x1 = Math.min(hi, Math.round(q[0] + half));
          if (x1 > x0) { g.fillStyle = Math.abs(dy2) > rad * 0.7 ? '#4a2058' : '#231029'; g.fillRect(x0, Math.round(cy2 + dy2), x1 - x0, 2); }
        }
      });
      g.globalAlpha = 1;
      // veias que crescem a partir do miolo
      VEINS.forEach((v) => {
        if (v.side !== dir) return;
        const n = Math.floor(clamp((c - v.start) / 0.55) * v.pts.length);
        for (let k = 0; k < n; k++) {
          const fx = v.pts[k][0], px = dir > 0 ? sx + fx * pw : sx - fx * pw, py = top + pageCurve(fx)[0] + 3 + v.pts[k][1] * (pgh - 8);
          const th2 = k < n * 0.35 ? 3 : 2;
          g.fillStyle = '#2a0f36'; g.fillRect(Math.round(px), Math.round(py), th2, th2);
          g.fillStyle = k > n - 5 ? '#d070f0' : (k % 6 === 0 ? '#8a3aa6' : '#5a2274'); g.fillRect(Math.round(px), Math.round(py), th2 - 1, th2 - 1);
        }
      });
  }

  // Folha virando com curvatura: a base puxa e a ponta vem atrasada, como papel de verdade.
  function turningLeaf(g, sx, ph, c, idx) {
    const pg = [0, 1, 2].map((j) => C.page[0][j] + (C.page[1][j] - C.page[0][j]) * c);
    const sh = [0, 1, 2].map((j) => C.shade[0][j] + (C.shade[1][j] - C.shade[0][j]) * c);
    const N = 56, seg = pw / N, sn = Math.sin(ph), lag = 1.05 * sn, flat = 1 - 0.75 * sn;
    setTones(g, sh, pg);
    // sombra da folha sobre a página de baixo
    const tip = pw * Math.cos(ph) * 0.9;
    g.fillStyle = `rgba(22,8,24,${0.3 * sn})`;
    if (tip >= 0) g.fillRect(sx, top + 2, Math.round(tip + 16), pgh - 2); else g.fillRect(Math.round(sx + tip - 16), top + 2, Math.round(-tip + 16), pgh - 2);
    g.fillStyle = `rgba(22,8,24,${0.18 * sn})`;
    if (tip >= 0) g.fillRect(sx, top + 2, Math.round(tip + 28), pgh - 2); else g.fillRect(Math.round(sx + tip - 28), top + 2, Math.round(-tip + 28), pgh - 2);
    const rowsL = Math.floor((pgh - 44) / 13), inkL = mix(C.ink[0], C.ink[1], c);
    let x = 0, up = 0;
    for (let i = 0; i < N; i++) {
      const f = (i + 0.5) / N, a = ph - lag * f * f;
      const nx = x + seg * Math.cos(a); up += seg * Math.sin(a) * 0.13;
      const cv2 = pageCurve(clamp(Math.abs(nx) / pw));
      const xa = Math.round(sx + Math.min(x, nx)), wd = Math.max(1, Math.round(Math.abs(nx - x)) + 1);
      const y0 = Math.round(top + cv2[0] * flat - up), y1 = Math.round(top + pgh + cv2[1] * flat - up * 0.3);
      const ca = Math.cos(a);
      const l = ca >= 0 ? 0.42 + 0.58 * ca : 0.3 + 0.5 * -ca;
      ditherRect(g, xa, y0, wd, y1 - y0, l - (f < 0.1 ? 0.25 : 0));
      // texto na frente e no verso da folha, mais visível quando ela está deitada
      if (Math.abs(ca) > 0.4 && f > 0.08 && f < 0.92) {
        g.fillStyle = inkL; g.globalAlpha = 0.6 * Math.abs(ca);
        const col = (Math.round((ca >= 0 ? f : 1 - f) * pw)) & ~1;
        for (let r = 1; r < rowsL; r++) { const v = SCRIPT[(r * 3 + idx * 7 + (ca >= 0 ? 0 : 11)) % SCRIPT.length][col]; if (v) { g.fillRect(xa, y0 + 24 + r * 13, wd, 2); if (v & 2) g.fillRect(xa, y0 + 18 + r * 13, 1, 6); } }
        g.globalAlpha = 1;
      }
      g.fillStyle = mix(sh.map((v) => v * 0.62), pg, 0.35 + 0.4 * l); g.fillRect(xa, y0, wd, 2); g.fillRect(xa, y1 - 2, wd, 2);
      if (i === N - 1) { g.fillStyle = mix(sh.map((v) => v * 0.62), sh, 0.4); g.fillRect(Math.round(sx + nx), y0, 2, y1 - y0); }
      x = nx;
    }
  }

  // Folha girando em torno da lombada: w com sinal (positivo = lado direito).
  function leaf(g, sx, w, lift, hPad, paint) {
    const n = Math.max(1, Math.ceil(Math.abs(w) / 3));
    for (let i = 0; i < n; i++) {
      const f = (i + 0.5) / n, up = lift * f;
      const x = Math.round(w > 0 ? sx + i * 3 : sx - (i + 1) * 3);
      paint(x, f, Math.round(top - hPad - up), Math.round(pgh + hPad * 2 + up * 0.72));
    }
  }

  function drawBook(T) {
    const g = bg;
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.clearRect(0, 0, OW, OH);
    const c = clamp((T - 1.9) / 2.5);
    const o = ease(clamp((T - T_OPEN0) / (T_OPEN1 - T_OPEN0)));
    const th = o * Math.PI;
    // medidas: começa na proporção da capa e passa para a da logo enquanto se corrompe
    const m = ease(clamp((T - 1.9) / 1.7));
    pw = Math.round(P0.pw + (PW - P0.pw) * m); pgh = Math.round(P0.pgh + (PGH - P0.pgh) * m); top = Math.round(BY - pgh / 2);
    curveK = o;
    const spW = art ? art.spine : 0, stW = art ? art.strip : 0;
    const sxClosed = BX - (spW + pw + M + stW) / 2 + spW;
    const sx = Math.round(BX + (sxClosed - BX) * (1 - o));
    const cover = mix(C.cover[0], C.cover[1], c), deep = mix(C.coverDeep[0], C.coverDeep[1], c);

    // espinhos e gotas que nascem com a corrupção
    const k = clamp((c - 0.6) / 0.4);
    if (k > 0) {
      SPIKES.forEach(([x, y, dx, dy, len, bw], si) => {
        const L = len * k, px = -dy, py = dx, bend = (si % 2 ? 1 : -1) * 9;
        for (let i = 0; i < L; i += 2) {
          const q = i / len, w = Math.max(1.5, bw * Math.pow(1 - q, 1.3)), cvx = Math.sin(q * Math.PI * 0.9) * bend;
          const cx2 = BX + x + dx * i + px * cvx, cy2 = BY + y + dy * i + py * cvx;
          g.fillStyle = '#231029'; g.fillRect(Math.round(cx2 - w / 2), Math.round(cy2 - w / 2), Math.ceil(w), Math.ceil(w));
          g.fillStyle = '#5c3270'; g.fillRect(Math.round(cx2 - w / 2), Math.round(cy2 - w / 2), Math.max(1, Math.ceil(w * 0.25)), Math.max(1, Math.ceil(w * 0.25)));
        }
      });
      drips.forEach((d) => {
        const L = Math.round(d.len * k); if (L < 3) return;
        const x0 = Math.round(d.x), y0 = top + pgh + M - 2;
        g.fillStyle = '#231029'; g.fillRect(x0, y0, d.w - 2, L); g.fillRect(x0 - 1, y0 + L - 5, d.w, 6); g.fillRect(x0, y0 + L + 1, d.w - 2, 2);
        g.fillStyle = '#5c3270'; g.fillRect(x0, y0, 1, L); g.fillRect(x0, y0 + L - 3, 1, 2);
      });
    }

    // sombra do livro projetada na parede
    {
      const lwS = o > 0.5 ? Math.round((pw + M) * -Math.cos(th)) : Math.round(spW * Math.max(0, 1 - o * 1.8));
      g.fillStyle = 'rgba(0,0,0,0.42)'; g.fillRect(sx - lwS - 3 + 9, top - M + 13, lwS + pw + M + 3 + stW * (1 - o), pgh + M * 2);
      g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(sx - lwS - 3 + 13, top - M + 18, lwS + pw + M + 3 + stW * (1 - o), pgh + M * 2);
    }

    // pranchas da capa
    g.fillStyle = cover; g.fillRect(sx - 3, top - M, pw + M + 3, pgh + M * 2);
    g.fillStyle = deep; g.fillRect(sx - 3, top + pgh + M - 5, pw + M + 3, 5); g.fillRect(sx + pw + M - 4, top - M, 4, pgh + M * 2);
    const lw = o > 0.5 ? Math.round((pw + M) * -Math.cos(th)) : 0;
    if (lw > 0) {
      g.fillStyle = cover; g.fillRect(sx - lw, top - M, lw, pgh + M * 2);
      g.fillStyle = deep; g.fillRect(sx - lw, top + pgh + M - 5, lw, 5); g.fillRect(sx - lw, top - M, 4, pgh + M * 2);
    }
    g.fillStyle = deep; g.fillRect(sx - 5, top - M, 10, pgh + M * 2);

    pageBlock(g, sx, 1, pw, c, false);
    const done = leaves.filter((l) => T >= l.t0 + l.dur).length;
    if (o >= 1) {
      if (done > 0) pageBlock(g, sx, -1, pw, c, true);
      else { g.fillStyle = mix(C.endpaper[0], C.endpaper[1], c); g.fillRect(sx - pw, top, pw, pgh); }
    }

    // miolo: costura e fitilho marcador
    if (o > 0.6) {
      const gy = pageCurve(0)[0];
      g.fillStyle = mix([214, 196, 150], [70, 34, 70], c);
      for (let y = top + 16; y < top + pgh - 10; y += 22) g.fillRect(sx - 3, Math.round(y + gy), 6, 2);
      const rb = mix([150, 34, 48], [44, 16, 40], c), rb2 = mix([196, 62, 70], [70, 30, 62], c);
      for (let y = top - M + 2; y < top + pgh + M + 18; y += 2) {
        const wob = Math.round(Math.sin(y * 0.045) * 1.5), tail = y > top + pgh + M + 10;
        g.fillStyle = rb; g.fillRect(sx + 7 + wob, y, tail ? 2 : 5, 2);
        if (tail) g.fillRect(sx + 10 + wob, y, 2, 2);
        g.fillStyle = rb2; g.fillRect(sx + 7 + wob, y, 1, 2);
      }
    }

    // folhas virando
    leaves.forEach((l, i) => {
      const u = (T - l.t0) / l.dur;
      if (u > 0 && u < 1) turningLeaf(g, sx, ease(u) * Math.PI, c, i);
    });

    if (o >= 1) { corruption(g, sx, 1, c); corruption(g, sx, -1, c); }

    // a capa abrindo, girando na dobra entre a lombada e a face
    if (o < 1) {
      const cs = Math.cos(th), sn = Math.sin(th), w = (pw + M) * cs;
      if (cs >= 0) {
        const ww = Math.max(3, w), nst = Math.max(1, Math.ceil(ww / 3));
        const tex = art ? art.c : coverTex, tx0 = art ? art.spine : 0, tw = art ? art.face : CW, tH = art ? art.h : CH;
        const cwS = Math.max(1, Math.round(tw / nst));
        leaf(g, sx, ww, sn * 30, M, (x, f, y, h) => { g.drawImage(tex, tx0 + Math.min(tw - cwS, Math.max(0, Math.floor((f - 0.5 / nst) * tw))), 0, cwS, tH, x, y, 3, h); });
      } else {
        leaf(g, sx, w, sn * 30, M, (x, f, y, h) => { g.fillStyle = f > 0.94 || f < 0.04 ? deep : mix(C.endpaper[0], C.endpaper[1], c); g.fillRect(x, y, 3, h); });
      }
      if (art) {
        const ws = Math.round(art.spine * Math.max(0, 1 - o * 1.8));   // lombada some conforme o livro deita aberto
        if (ws > 0) g.drawImage(art.c, 0, 0, art.spine, art.h, sx - ws, top - M, ws, pgh + M * 2);
        g.globalAlpha = 1 - o;                                          // borda das folhas à direita
        g.drawImage(art.c, art.w - art.strip, 0, art.strip, art.h, sx + pw + M, top - M, art.strip, pgh + M * 2);
        g.globalAlpha = 1;
      }
    }
  }

  // ----- Tela -----
  let S = 1, W = 0, H = 0, ox = 0, oy = 0;
  const mouse = { x: 0, y: 0, on: false };
  let vw = 0, vh = 0;
  function resize() {
    vw = cv.parentElement.clientWidth; vh = cv.parentElement.clientHeight;
    const s = Math.min((vw * 0.94) / LW, (vh * 0.8) / LH);
    S = s >= 1 ? Math.floor(s) : s;
    W = Math.ceil(vw / S); H = Math.ceil(vh / S);
    cv.width = W; cv.height = H;
    cv.style.width = W * S + 'px'; cv.style.height = H * S + 'px';
    cv.style.imageRendering = S >= 1 ? 'pixelated' : 'auto';
    ox = Math.round(W / 2 - (317 + PAD)); oy = Math.round(H / 2 - (300 + PAD) - 14);
  }
  addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / S; mouse.y = (e.clientY - r.top) / S; mouse.on = true; }, { passive: true });

  const FIXED_T = (() => { const v = new URLSearchParams(location.search).get('t'); return v === null || isNaN(+v) ? null : +v; })();
  const embers = [], burn = [], wisps = [];
  const TIPS = [[212, 78], [318, 12], [424, 78], [22, 232], [612, 236], [70, 122], [566, 122], [180, 560], [318, 596], [456, 560]];
  let autoT = reduce ? END : 0, last = performance.now(), clock = 0;

  // Partículas das trevas: fiapos de sombra que saem do livro, giram em volta e voltam ao miolo.
  function flierPos(p, u, fit) {
    const r = p.R * fit * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.8);
    const a = p.a0 + p.dir * p.turns * u;
    return [BX + Math.cos(a) * r * 1.2, BY - 40 * Math.sin(Math.PI * u) + Math.sin(a) * r * 0.62];
  }
  function drawFliers(T, c, dx, dy) {
    const fit = Math.min(1, Math.min(W / 760, H / 560));
    fliers.forEach((p, j) => {
      const span = p.t1 - p.t0, u = (T - p.t0) / span;
      if (u <= 0 || u >= 1) return;
      const head = flierPos(p, u, fit);
      const hx = ox + dx + head[0], hy = oy + dy + head[1];
      // as sombras desviam do cursor
      let tx = 0, ty = 0;
      if (mouse.on) { const mx = hx - mouse.x, my = hy - mouse.y, d = Math.hypot(mx, my); if (d < 130 && d > 0.01) { const f = (1 - d / 130) * 70; tx = (mx / d) * f; ty = (my / d) * f; } }
      p.ox += (tx - p.ox) * 0.18; p.oy += (ty - p.oy) * 0.18;
      const fade = Math.min(1, u * 6) * (1 - 0.45 * u * u);
      // fumaça que se esgarça: o rastro abre em flocos cada vez menores e mais espalhados
      for (let k = 11; k >= 0; k--) {
        const uk = u - (k * 0.03) / span;
        if (uk <= 0) continue;
        const q = flierPos(p, uk, fit), spread = k * 1.5;
        const bx = ox + dx + q[0] + p.ox * (1 - k * 0.07), by = oy + dy + q[1] + p.oy * (1 - k * 0.07) - k * 0.8;
        const base = Math.max(1, ((12 - k) * p.sz * fade) / 2);
        for (let n = 0; n < (k < 3 ? 1 : 3); n++) {
          const a = p.ph * 3 + k * 1.7 + n * 2.1 + clock * (1.2 + n * 0.5);
          const px = bx + Math.cos(a) * spread, py = by + Math.sin(a * 1.3) * spread * 0.7;
          const sz = Math.max(1, Math.round(base * (n ? 0.6 : 1)));
          if (k < 5 && n === 0) { ctx.globalAlpha = 0.7; ctx.fillStyle = '#4a2058'; ctx.fillRect(Math.round(px - sz / 2) - 1, Math.round(py - sz / 2), sz + 2, sz); ctx.fillRect(Math.round(px - sz / 2), Math.round(py - sz / 2) - 1, sz, sz + 2); }
          ctx.globalAlpha = k < 4 ? 1 : Math.max(0.12, 0.8 - (k - 4) * 0.09);
          ctx.fillStyle = k < 4 ? '#0a0410' : k < 8 ? '#1c0c26' : '#33183f';
          ctx.fillRect(Math.round(px - sz / 2), Math.round(py - sz / 2), sz, sz);
        }
      }
      ctx.globalAlpha = 1;
      if (Math.sin(clock * 9 + p.ph * 3 + j) > 0.55) { ctx.fillStyle = '#a04ac0'; ctx.fillRect(Math.round(hx + p.ox - 1), Math.round(hy + p.oy - 1), 2, 2); }
    });
  }

  function drawEye(dx, dy, a) {
    const ex = ox + dx + EYE.x, ey = oy + dy + EYE.y;
    let px = 0, py = 0;
    if (mouse.on) { const mx = mouse.x - ex, my = mouse.y - ey, d = Math.hypot(mx, my) || 1, k = Math.min(1, d / 60); px = (mx / d) * 6 * k; py = (my / d) * 5 * k; }
    const x = Math.round(ex + px), y = Math.round(ey + py);
    ctx.globalAlpha = a;
    const pulse = 0.16 + 0.08 * Math.sin(clock * 2.4);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(ex, ey, 2, ex, ey, 34);
    g.addColorStop(0, `rgba(255,150,60,${pulse})`); g.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g; ctx.fillRect(ex - 34, ey - 34, 68, 68);
    ctx.globalCompositeOperation = 'source-over';
    // pupila em fenda: dilata quando o cursor chega perto
    const near = mouse.on ? clamp(1 - Math.hypot(mouse.x - ex, mouse.y - ey) / 170) : 0;
    const hw = 2 + Math.round(near * 3), hh = 9 - Math.round(near * 2);
    ctx.fillStyle = '#1c0a16';
    ctx.fillRect(x - hw, y - hh + 3, hw * 2, hh * 2 - 6); ctx.fillRect(x - Math.max(1, hw - 1), y - hh + 1, Math.max(2, hw * 2 - 2), hh * 2 - 2); ctx.fillRect(x - 1, y - hh, 2, hh * 2);
    ctx.fillStyle = '#5a1420'; ctx.fillRect(x - hw, y - 1, 1, 2); ctx.fillRect(x + hw - 1, y - 1, 1, 2);
    ctx.fillStyle = '#fff3c2'; ctx.fillRect(x - hw - 2, y - hh + 2, 2, 2);
    // pálpebras: piscam de tempos em tempos
    const bc = clock % 5.3, b = bc < 0.18 ? Math.sin((bc / 0.18) * Math.PI) : 0;
    if (b > 0.03) {
      const R = 14, cxE = Math.round(ex), cyE = Math.round(ey), t0 = Math.round(-R + b * R), t1 = Math.round(R - b * R);
      for (let yy = -R; yy <= R; yy++) {
        if (yy > t0 && yy < t1) continue;
        const half = Math.round(Math.sqrt(R * R - yy * yy));
        ctx.fillStyle = yy === t0 || yy === t1 ? '#8a4456' : '#2a1226';
        ctx.fillRect(cxE - half, cyE + yy, half * 2, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    if (cv.parentElement.clientWidth !== vw || cv.parentElement.clientHeight !== vh) resize();
    const secH = sec.offsetHeight;
    if (scrollY > secH || !ready) { window.thendGlow = null; return; }
    autoT = Math.min(END, autoT + dt);
    if (FIXED_T !== null) autoT = FIXED_T;   // ?t=2.5 na URL congela a abertura nesse instante (para revisar quadros)
    const range = Math.max(1, secH - innerHeight);
    const s = clamp(scrollY / (range * 0.85));
    const T = Math.min(autoT, END - s * (END - T_CLOSED));
    if (hint) hint.classList.toggle('on', T >= END - 0.05 && s < 0.02);

    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    const c = clamp((T - 1.9) / 2.5);
    const p = clamp((T - T_DIS0) / (T_DIS1 - T_DIS0));
    const lock = clamp((T - 4.6) / 0.8);
    const appear = clamp(T / 0.5);
    const dx = Math.round(lock * (mouse.on ? (mouse.x / W - 0.5) * 8 : 0));
    const dy = Math.round(lock * (Math.sin(clock * 1.3) * 3 + (mouse.on ? (mouse.y / H - 0.5) * 6 : 0)) - (1 - ease(appear)) * 26);
    const flash = T > T_DIS1 ? 1 - clamp((T - T_DIS1) / 0.35) : 0;   // instante em que a logo trava
    const X = ox + dx + Math.round((Math.random() - 0.5) * 7 * flash), Y = oy + dy + Math.round((Math.random() - 0.5) * 5 * flash);
    const rect = cv.getBoundingClientRect();
    window.thendGlow = { x: rect.left + (X + BX) * S, y: rect.top + (Y + BY) * S, r: (300 + 150 * ease(clamp((T - 1) / 3)) + Math.sin(clock * 3) * 8) * (1 + flash * 0.6) * S, a: appear * (1 + flash * 1.3 + (p > 0 && p < 1 ? 0.25 : 0)) };

    if (p > 0 && logoShadow) { ctx.globalAlpha = appear * p * 0.42; ctx.drawImage(logoShadow, X + PAD + 9, Y + PAD + 13); }
    ctx.globalAlpha = appear;
    if (p <= 0) {
      drawBook(T); ctx.drawImage(bookL, X, Y);
    } else if (p >= 1) {
      ctx.drawImage(logo, X + PAD, Y + PAD);
    } else {
      // frente de queima: brasa clara na linha, laranja e vermelho logo à frente, e o livro chamuscando antes de sumir
      const md = maskD.data, ed = emberD.data;
      for (let i = 0, n = MW * MH; i < n; i++) {
        const e = thr[i] - p, j = i * 4;
        md[j + 3] = e < 0 ? 255 : 0;
        if (e > -0.006 && e < 0.012) { ed[j] = 255; ed[j + 1] = 238; ed[j + 2] = 176; ed[j + 3] = 255; }
        else if (e >= 0.012 && e < 0.03) { ed[j] = 255; ed[j + 1] = (i * 7) % 3 ? 150 : 190; ed[j + 2] = 60; ed[j + 3] = 255; }
        else if (e >= 0.03 && e < 0.05) { ed[j] = 160; ed[j + 1] = 44; ed[j + 2] = 46; ed[j + 3] = 235; }
        else if (e >= 0.05 && e < 0.1) { ed[j] = 24; ed[j + 1] = 10; ed[j + 2] = 20; ed[j + 3] = Math.round(175 * (1 - (e - 0.05) / 0.05)); }
        else ed[j + 3] = 0;
      }
      gm.putImageData(maskD, 0, 0); ge.putImageData(emberD, 0, 0);
      drawBook(T);
      gu.globalCompositeOperation = 'source-over'; gu.clearRect(0, 0, OW, OH); gu.drawImage(bookL, 0, 0); gu.drawImage(logo, PAD, PAD);
      bg.globalCompositeOperation = 'destination-out'; bg.drawImage(maskC, 0, 0, MW * Q, MH * Q); bg.globalCompositeOperation = 'source-over';
      ga.globalCompositeOperation = 'source-over'; ga.clearRect(0, 0, OW, OH); ga.drawImage(logo, PAD, PAD);
      ga.globalCompositeOperation = 'destination-in'; ga.drawImage(maskC, 0, 0, MW * Q, MH * Q);
      gb.globalCompositeOperation = 'source-over'; gb.clearRect(0, 0, OW, OH); gb.drawImage(emberC, 0, 0, MW * Q, MH * Q);
      gb.globalCompositeOperation = 'destination-in'; gb.drawImage(tmpU, 0, 0);
      // brasas e fumaça soltando da linha de queima
      for (let n = 0; n < 10 && burn.length < 160; n++) {
        const i = Math.floor(Math.random() * MW * MH), e = thr[i] - p, bx = (i % MW) * Q, by = Math.floor(i / MW) * Q;
        if (e > -0.01 && e < 0.03 && bx > PAD + 30 && bx < PAD + LW - 30 && by > PAD + 90 && by < PAD + LH - 90) {
          burn.push({ x: X + bx, y: Y + by, vx: (Math.random() - 0.5) * 0.7, vy: -(0.5 + Math.random() * 1.3), life: 0, max: 28 + Math.random() * 50, smoke: Math.random() < 0.4 });
        }
      }
      ctx.drawImage(bookL, X, Y); ctx.drawImage(tmpA, X, Y); ctx.drawImage(tmpB, X, Y);
    }
    ctx.globalAlpha = 1;

    // clarão no instante em que a logo trava
    if (flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = flash * 0.75; ctx.drawImage(logo, X + PAD, Y + PAD); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }

    const eyeA = clamp((T - (T_DIS1 - 0.5)) / 0.4);
    if (eyeA > 0) drawEye(dx, dy, eyeA);

    drawFliers(T, c, dx, dy);

    for (let i = burn.length - 1; i >= 0; i--) {
      const b = burn[i]; b.x += b.vx + Math.sin(b.life * 0.2 + i) * 0.25; b.y += b.vy; b.vy *= 0.985;
      const t = b.life / b.max;
      if (b.smoke) { ctx.globalAlpha = 0.5 * (1 - t); ctx.fillStyle = '#2a1a30'; const sz = 3 + Math.round(t * 3); ctx.fillRect(Math.round(b.x), Math.round(b.y), sz, sz); }
      else { ctx.globalAlpha = 1 - t * t; ctx.fillStyle = t < 0.3 ? '#fff0b8' : t < 0.65 ? '#ffb347' : '#e0522c'; ctx.fillRect(Math.round(b.x), Math.round(b.y), 2, 2); }
      if (++b.life > b.max) burn.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    // fiapos de sombra escapando das pontas da logo travada
    if (lock > 0.6 && wisps.length < 60 && Math.random() < 0.3) { const tp = TIPS[Math.floor(Math.random() * TIPS.length)]; wisps.push({ x: X + PAD + tp[0], y: Y + PAD + tp[1], vx: (Math.random() - 0.5) * 0.3, vy: -(0.2 + Math.random() * 0.35), life: 0, max: 70 + Math.random() * 70, ph: Math.random() * 6 }); }
    for (let i = wisps.length - 1; i >= 0; i--) {
      const w = wisps[i]; w.x += w.vx + Math.sin(w.life * 0.05 + w.ph) * 0.3; w.y += w.vy;
      const t = w.life / w.max, sz = t < 0.4 ? 4 : t < 0.75 ? 3 : 2;
      ctx.globalAlpha = 0.55 * (1 - t) * lock; ctx.fillStyle = t < 0.5 ? '#150a1c' : '#3a1c48';
      ctx.fillRect(Math.round(w.x), Math.round(w.y), sz, sz); ctx.fillRect(Math.round(w.x + Math.sin(w.ph + w.life * 0.1) * 3), Math.round(w.y + 3), sz - 1, sz - 1);
      if (++w.life > w.max) wisps.splice(i, 1);
    }
    ctx.globalAlpha = 1;

    // brasas subindo em volta da logo travada
    if (lock > 0.5 && embers.length < 40 && Math.random() < 0.35) embers.push({ x: X + BX + (Math.random() - 0.5) * 520, y: Y + BY + 60 + Math.random() * 150, vy: -(0.3 + Math.random() * 0.7), life: 0, max: 80 + Math.random() * 90, ph: Math.random() * 6 });
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.y += e.vy; e.x += Math.sin(e.life * 0.06 + e.ph) * 0.4;
      const t = e.life / e.max;
      ctx.globalAlpha = (t < 0.2 ? t * 5 : 1 - (t - 0.2) / 0.8) * lock;
      ctx.fillStyle = t < 0.5 ? '#ffc85a' : '#f47a2c';
      ctx.fillRect(Math.round(e.x), Math.round(e.y), 2, 2);
      if (++e.life > e.max) embers.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  resize();
  requestAnimationFrame(frame);
})();
