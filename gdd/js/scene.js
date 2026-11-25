// Cenário fixo da masmorra, todo desenhado em código:
// parede de pedra com volume (seca no topo, úmida no meio, corrompida no fundo), tochas com chama
// em camadas que reage ao mouse, iluminação em degraus com pontilhado, poeira, gotas, olhos no escuro
// e correntes em primeiro plano.
(() => {
  'use strict';
  const cv = document.getElementById('scene');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const U = 3;                    // px de tela por pixel do cenário
  const ROW = 16, ROWS = 24, PH = ROW * ROWS;   // fileira de pedras e altura do padrão que se repete
  const TY = 118;                 // altura da tocha dentro do padrão
  const LS = 2;                   // tamanho da célula de luz, em pixels do cenário
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, TX = 0, vw = 0, vh = 0, docH = 1;
  let walls = [], light, lctx, limg, LW = 0, LH = 0, grate = null, chainX = 0, drips = [];
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
  const flames = [{ lean: 0, gust: 0 }, { lean: 0, gust: 0 }];
  const embers = [], smoke = [], drops = [], dust = [], eyes = [];
  let tick = 0, lastScroll = 0;

  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const rgb = (a, k = 1) => `rgb(${Math.min(255, Math.round(a[0] * k))},${Math.min(255, Math.round(a[1] * k))},${Math.min(255, Math.round(a[2] * k))})`;
  const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Parede ----------
  const PAL = [
    { mortar: '#0d070f', stones: [[36, 22, 41], [41, 25, 46], [46, 29, 51], [33, 20, 36], [39, 26, 48]] },   // seca
    { mortar: '#090810', stones: [[29, 25, 42], [33, 29, 47], [27, 26, 40], [36, 30, 49], [25, 23, 38]] },   // úmida
    { mortar: '#06030a', stones: [[31, 15, 40], [37, 18, 47], [26, 12, 34], [42, 20, 53], [22, 11, 30]] },   // corrompida
  ];

  function drawTorch(g, x, y, flip) {
    const d = flip ? -1 : 1;
    // placa na parede com rebites
    g.fillStyle = '#120d16'; g.fillRect(x - 3 - d * 10, y + 6, 6, 20);
    g.fillStyle = '#2f2937'; g.fillRect(x - 2 - d * 10, y + 7, 4, 18);
    g.fillStyle = '#4b4456'; g.fillRect(x - 2 - d * 10, y + 7, 1, 18);
    g.fillStyle = '#6a6278'; g.fillRect(x - 1 - d * 10, y + 9, 1, 1); g.fillRect(x - 1 - d * 10, y + 22, 1, 1);
    // braço curvo
    g.fillStyle = '#120d16';
    for (let i = 0; i < 10; i++) g.fillRect(x - d * i - 1, y + 15 + Math.round(Math.sin(i / 9 * 1.5) * 3), 2, 3);
    g.fillStyle = '#3a3444';
    for (let i = 0; i < 10; i++) g.fillRect(x - d * i - 1, y + 15 + Math.round(Math.sin(i / 9 * 1.5) * 3), 2, 1);
    // cabo de madeira com veios
    g.fillStyle = '#3d2317'; g.fillRect(x - 2, y + 4, 4, 26);
    g.fillStyle = '#6a4329'; g.fillRect(x - 2, y + 4, 1, 26);
    g.fillStyle = '#22120c'; g.fillRect(x + 1, y + 4, 1, 26); g.fillRect(x - 2, y + 28, 4, 2);
    g.fillStyle = '#2b180f'; g.fillRect(x - 1, y + 10, 1, 5); g.fillRect(x, y + 19, 1, 4);
    // cesto de ferro
    g.fillStyle = '#17121c'; g.fillRect(x - 7, y - 3, 14, 4); g.fillRect(x - 6, y + 1, 12, 3); g.fillRect(x - 4, y + 4, 8, 2);
    g.fillStyle = '#5a5266'; g.fillRect(x - 7, y - 3, 14, 1);
    g.fillStyle = '#3b3545'; g.fillRect(x - 6, y - 2, 2, 5); g.fillRect(x - 1, y - 2, 2, 5); g.fillRect(x + 4, y - 2, 2, 5);
    g.fillStyle = '#17121c'; g.fillRect(x - 8, y - 7, 2, 5); g.fillRect(x + 6, y - 7, 2, 5); g.fillRect(x - 3, y - 5, 1, 2); g.fillRect(x + 2, y - 5, 1, 2);
    g.fillStyle = '#5a5266'; g.fillRect(x - 8, y - 7, 1, 1); g.fillRect(x + 6, y - 7, 1, 1);
  }

  function stone(g, x, y, w, b, mortar, r) {
    g.fillStyle = rgb(b); g.fillRect(x + 1, y + 1, w - 1, ROW - 1);
    // volume: luz em cima e à esquerda, sombra embaixo e à direita
    g.fillStyle = rgb(b, 1.42); g.fillRect(x + 2, y + 1, w - 3, 1);
    g.fillStyle = rgb(b, 1.18); g.fillRect(x + 1, y + 2, w - 1, 1); g.fillRect(x + 1, y + 1, 1, ROW - 3);
    g.fillStyle = rgb(b, 0.82); g.fillRect(x + 1, y + ROW - 5, w - 1, 2);
    g.fillStyle = rgb(b, 0.58); g.fillRect(x + 1, y + ROW - 3, w - 1, 2); g.fillRect(x + w - 1, y + 2, 1, ROW - 3);
    // cantos lascados
    g.fillStyle = mortar;
    if (r() < 0.7) g.fillRect(x + 1, y + 1, 1, 1);
    if (r() < 0.7) g.fillRect(x + w - 1, y + 1, 1, 1);
    if (r() < 0.5) g.fillRect(x + 1, y + ROW - 2, 2, 1);
    if (r() < 0.5) g.fillRect(x + w - 2, y + ROW - 2, 2, 1);
    // grão e veios da pedra
    for (let k = 0; k < 9; k++) {
      g.fillStyle = r() < 0.5 ? rgb(b, 1.3) : rgb(b, 0.66);
      g.fillRect(x + 3 + Math.floor(r() * (w - 6)), y + 4 + Math.floor(r() * (ROW - 9)), 1 + Math.floor(r() * 2), 1);
    }
    if (r() < 0.45) { g.fillStyle = rgb(b, 0.78); g.fillRect(x + 4 + Math.floor(r() * (w - 14)), y + 5 + Math.floor(r() * 5), 4 + Math.floor(r() * 8), 1); }
    if (r() < 0.14) {   // rachadura com borda clara
      let cx = x + 5 + Math.floor(r() * (w - 10)), cy = y + 2;
      while (cy < y + ROW - 3) { g.fillStyle = mortar; g.fillRect(cx, cy, 1, 2); g.fillStyle = rgb(b, 1.3); g.fillRect(cx + 1, cy, 1, 1); cy += 2; cx += r() < 0.5 ? -1 : 1; }
    }
  }

  function buildWall(v) {
    const c = mk(W, PH), g = c.getContext('2d');
    const rl = rng(77), rd = rng(1000 + v), p = PAL[v];   // rl: disposição (igual nas três versões); rd: enfeites
    g.fillStyle = p.mortar; g.fillRect(0, 0, W, PH);
    const list = [];
    for (let row = 0; row < ROWS; row++) {
      const y = row * ROW;
      let x = -Math.floor(rl() * 30) - (row % 2) * 18;
      while (x < W) {
        const w = 26 + Math.floor(rl() * 18), idx = Math.floor(rl() * 5), tone = 0.9 + rl() * 0.2;
        stone(g, x, y, w, p.stones[idx].map((n) => n * tone), p.mortar, rng(row * 131 + x + 7));
        list.push([x, y, w]); x += w;
      }
    }
    if (v >= 1) {   // umidade: manchas escorridas e musgo
      for (let i = 0; i < Math.round(W / 9); i++) {
        const x = Math.floor(rd() * W), y = Math.floor(rd() * ROWS) * ROW, len = 10 + Math.floor(rd() * 44);
        g.fillStyle = `rgba(4,3,10,${0.18 + rd() * 0.2})`; g.fillRect(x, y, 2 + Math.floor(rd() * 3), len);
        g.fillStyle = 'rgba(88,110,150,0.22)'; g.fillRect(x, y + 1, 1, Math.floor(len * 0.6));
      }
      const moss = ['#1f3a26', '#2c4a2e', '#3a6338', '#4f7a3e'];
      for (let i = 0; i < Math.round(W / 6); i++) {
        const s = list[Math.floor(rd() * list.length)], n = 5 + Math.floor(rd() * 12);
        let mx = s[0] + 2 + Math.floor(rd() * Math.max(1, s[2] - 6));
        for (let k = 0; k < n; k++) {
          g.fillStyle = moss[Math.floor(rd() * moss.length)];
          g.fillRect(mx, s[1] + ROW - 2 + Math.floor(rd() * 2), 1 + Math.floor(rd() * 2), 1 + Math.floor(rd() * 3));
          mx += rd() < 0.7 ? 1 : 2;
        }
      }
    }
    if (v === 2) {   // corrupção: veias roxas e pústulas
      for (let i = 0; i < Math.max(5, Math.round(W / 40)); i++) {
        let x = rd() * W, y = rd() * PH, a = rd() * 6.283;
        const len = 50 + rd() * 110;
        for (let k = 0; k < len; k++) {
          a += (rd() - 0.5) * 0.5; x += Math.cos(a); y += Math.sin(a);
          const yy = ((Math.round(y) % PH) + PH) % PH, th = k < len * 0.3 ? 2 : 1;
          g.fillStyle = '#3d1750'; g.fillRect(Math.round(x), yy, th + 1, th + 1);
          g.fillStyle = k % 5 === 0 ? '#9a48b8' : '#64287e'; g.fillRect(Math.round(x), yy, th, th);
          if (rd() < 0.03) { g.fillStyle = '#7a2a52'; g.fillRect(Math.round(x) - 1, yy - 1, 4, 4); g.fillStyle = '#c05a8a'; g.fillRect(Math.round(x), yy - 1, 1, 1); }
        }
      }
    }
    // grade de cela
    const gx = grate.x, gy = grate.y;
    g.fillStyle = rgb(p.stones[2], 1.25); g.fillRect(gx - 3, gy - 3, 28, 34);
    g.fillStyle = rgb(p.stones[2], 0.6); g.fillRect(gx - 3, gy + 29, 28, 2); g.fillRect(gx + 23, gy - 3, 2, 34);
    g.fillStyle = '#020103'; g.fillRect(gx, gy, 22, 28);
    for (let i = 0; i < 4; i++) { g.fillStyle = '#211c28'; g.fillRect(gx + 2 + i * 6, gy, 2, 28); g.fillStyle = '#4a4356'; g.fillRect(gx + 2 + i * 6, gy, 1, 28); }
    g.fillStyle = '#211c28'; g.fillRect(gx, gy + 12, 22, 2); g.fillStyle = '#4a4356'; g.fillRect(gx, gy + 12, 22, 1);
    // argola e corrente presas à parede
    const kx = chainX, ky = ROW * 4 + 4;
    g.fillStyle = '#17121c'; g.fillRect(kx - 3, ky - 3, 7, 7); g.fillStyle = '#4b4456'; g.fillRect(kx - 2, ky - 2, 5, 1); g.fillStyle = '#020103'; g.fillRect(kx - 1, ky - 1, 3, 3);
    for (let i = 0; i < 9; i++) {
      const yy = ky + 4 + i * 5;
      g.fillStyle = '#17121c'; g.fillRect(kx - (i % 2 ? 1 : 2), yy, i % 2 ? 3 : 5, 5);
      g.fillStyle = '#5a5266'; g.fillRect(kx - (i % 2 ? 1 : 2), yy, 1, 4);
      g.fillStyle = p.mortar; if (!(i % 2)) g.fillRect(kx - 1, yy + 1, 3, 3);
    }
    g.fillStyle = '#17121c'; g.fillRect(kx - 4, ky + 49, 9, 7); g.fillStyle = '#020103'; g.fillRect(kx - 2, ky + 51, 5, 3); g.fillStyle = '#5a5266'; g.fillRect(kx - 4, ky + 49, 9, 1);
    drawTorch(g, TX, TY, false);
    drawTorch(g, W - TX, TY, true);
    return c;
  }

  function resize() {
    vw = document.documentElement.clientWidth; vh = innerHeight;
    W = Math.ceil(vw / U); H = Math.ceil(vh / U);
    cv.width = W; cv.height = H;
    cv.style.width = W * U + 'px'; cv.style.height = H * U + 'px';
    TX = Math.max(13, Math.round(W * 0.075));
    grate = { x: Math.round(W * 0.2), y: ROW * 14 + 2 };
    chainX = Math.round(W * 0.83);
    drips = [{ x: TX + 24, y: TY - 34 }, { x: grate.x + 5, y: grate.y + 31 }, { x: W - TX - 30, y: ROW * 16 }];
    walls = [buildWall(0), buildWall(1), buildWall(2)];
    LW = Math.ceil(W / LS); LH = Math.ceil(H / LS);
    light = mk(LW, LH); lctx = light.getContext('2d'); limg = lctx.createImageData(LW, LH);
    dust.length = 0;
    for (let i = 0; i < Math.round(W * H / 1500); i++) dust.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.08, vy: -0.02 - Math.random() * 0.05, ph: Math.random() * 6.283, z: 0.75 + Math.random() * 0.6 });
  }

  addEventListener('pointermove', (e) => {
    const x = e.clientX / U, y = e.clientY / U;
    if (mouse.x > -9000) { mouse.vx += (x - mouse.x) * 0.5; mouse.vy += (y - mouse.y) * 0.5; }
    mouse.x = x; mouse.y = y;
  }, { passive: true });
  addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  // ---------- Chama ----------
  const FIRE = [[255, 243, 194], [255, 200, 90], [244, 122, 44], [182, 58, 60]];
  const FOUL = [[246, 230, 255], [215, 156, 255], [154, 74, 208], [74, 32, 112]];   // chama corrompida, no fundo
  let fireCol = FIRE.map((c) => rgb(c));
  const FLAME_SPEED = 0.3;   // 1 = velocidade original; menor = chama mais calma

  function stepFlame(s, ox, oy) {
    const f = flames[s];
    const dx = mouse.x - ox, dy = mouse.y - (oy - 9), dist = Math.hypot(dx, dy);
    const fall = 1 / (1 + (dist / 55) * (dist / 55));
    const wx = Math.max(-1.2, Math.min(1.2, mouse.vx * 0.4)) * fall;
    let target = wx * 0.9;
    if (dist < 30) target += (dx > 0 ? -1 : 1) * (1 - dist / 30) * 0.55;   // a chama foge do cursor
    f.lean += (Math.max(-1, Math.min(1, target)) - f.lean) * 0.1;
    f.gust += (Math.abs(wx) - f.gust) * 0.15;
    if (tick % 16 === 0) embers.push({ s, x: (Math.random() - 0.5) * 5, y: -12 - Math.random() * 6, vx: f.lean * 0.5 + (Math.random() - 0.5) * 0.2, vy: -0.18 - Math.random() * 0.22, life: 0, max: 60 + Math.random() * 70 });
    if (tick % 9 === 0) smoke.push({ s, x: (Math.random() - 0.5) * 4 + f.lean * 14, y: -18, vx: f.lean * 0.3 + (Math.random() - 0.5) * 0.1, vy: -0.14 - Math.random() * 0.1, life: 0, max: 100 + Math.random() * 70 });
    if (f.gust > 0.75 && Math.random() < 0.2) embers.push({ s, x: 0, y: -8, vx: wx * 1.2 + (Math.random() - 0.5), vy: -1 - Math.random(), life: 0, max: 30 + Math.random() * 20, g: 0.06 });
  }

  function drawFlame(s, ox, oy) {
    const f = flames[s], t = tick * FLAME_SPEED;   // tempo da chama, mais lento que o do quadro
    const hb = 18 + 3 * Math.sin(t * 0.21 + s * 3) + 2 * Math.sin(t * 0.47 + s) - f.gust * 4;
    const layers = [[1, 5.6, 3], [0.8, 4.4, 2], [0.58, 3.2, 1], [0.34, 1.9, 0]];
    for (const [hk, half, ci] of layers) {
      ctx.fillStyle = fireCol[ci];
      const h = hb * hk;
      for (let y = 0; y < h; y++) {
        const q = y / h;
        const wv = half * Math.pow(1 - q, 0.7) * Math.min(1, 0.55 + q * 3) * (0.86 + 0.14 * Math.sin(t * 0.5 + y * 0.8 + s + ci));
        const cx = ox + f.lean * y * (0.35 + q * 0.9) + Math.sin(t * 0.33 + y * 0.45 + s * 2) * q * 1.6;
        ctx.fillRect(Math.round(cx - wv), oy - y, Math.max(1, Math.round(wv * 2)), 1);
      }
    }
    // brasas no cesto
    ctx.fillStyle = (Math.floor(t) >> 3) % 2 ? fireCol[2] : fireCol[1];
    ctx.fillRect(ox - 4, oy + 1, 2, 1); ctx.fillRect(ox + 1, oy + 2, 2, 1);
    ctx.fillStyle = fireCol[3]; ctx.fillRect(ox - 1, oy + 1, 2, 1);
  }

  // ---------- Luz em degraus com pontilhado ----------
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const DARK = [238, 212, 176, 132, 86, 44, 10];

  function computeLight(lights, ambient) {
    const d = limg.data, n = lights.length, N = DARK.length - 1;
    for (let y = 0, i = 0; y < LH; y++) {
      const py = y * LS + 1;
      for (let x = 0; x < LW; x++, i += 4) {
        const px = x * LS + 1;
        let L = ambient;
        for (let k = 0; k < n; k++) {
          const l = lights[k], dx = (px - l.x) * l.sx, dy = py - l.y;
          L += l.i / (1 + (dx * dx + dy * dy) * l.k);
        }
        let q = Math.floor(L * N + BAYER[(x & 3) + ((y & 3) << 2)] / 16 - 0.25);
        if (q < 0) q = 0; else if (q > N) q = N;
        d[i] = 5; d[i + 1] = 2; d[i + 2] = 9; d[i + 3] = DARK[q];
      }
    }
    lctx.putImageData(limg, 0, 0);
  }

  // ---------- Quadro ----------
  function frame() {
    tick++;
    if (document.documentElement.clientWidth !== vw || innerHeight !== vh) resize();
    if (tick % 30 === 1) docH = document.documentElement.scrollHeight;
    const depth = clamp(scrollY / Math.max(1, docH - vh)) * 2;   // 0 seca, 1 úmida, 2 corrompida
    const va = Math.min(1, Math.floor(depth)), vf = depth - va;
    const foul = clamp(depth - 1) * 0.65;
    fireCol = FIRE.map((c, i) => rgb(lerp3(c, FOUL[i], foul)));

    const off = Math.floor((scrollY * 0.6) / U) % PH;
    const inst = [];
    ctx.imageSmoothingEnabled = false;
    for (let y0 = -off; y0 < H; y0 += PH) {
      ctx.drawImage(walls[va], 0, y0);
      if (vf > 0.02) { ctx.globalAlpha = vf; ctx.drawImage(walls[va + 1], 0, y0); ctx.globalAlpha = 1; }
      inst.push(y0);
    }
    const sides = [TX, W - TX];

    // olhos atrás da grade: aparecem de vez em quando e somem se o cursor chega perto
    for (const y0 of inst) {
      const gx = grate.x + 11, gy = y0 + grate.y + 7;
      const cyc = (tick + Math.floor((y0 + off) / PH) * 400) % 900, near = Math.hypot(mouse.x - gx, mouse.y - gy) < 46;
      if (cyc < 260 && !near && !(cyc > 120 && cyc < 127)) {
        const lx = Math.max(-1, Math.min(1, Math.round((mouse.x - gx) / 60)));
        ctx.fillStyle = '#e8c04a'; ctx.fillRect(gx - 4 + lx, gy, 2, 1); ctx.fillRect(gx + 3 + lx, gy, 2, 1);
      }
    }

    // gotas
    if (depth > 0.5 || tick % 3 === 0) {
      for (const y0 of inst) for (const s of drips) if (Math.random() < 0.004 + depth * 0.004) drops.push({ x: s.x, y: s.y, py: y0, vy: 0.2, life: 0 });
    }
    const dScroll = (scrollY - lastScroll) / U;
    for (let i = drops.length - 1; i >= 0; i--) {
      const p = drops[i];
      p.vy += 0.07; p.y += p.vy; p.py -= dScroll * 0.6; p.life++;
      const sy = p.py + p.y;
      ctx.fillStyle = 'rgba(150,175,215,0.85)'; ctx.fillRect(Math.round(p.x), Math.round(sy), 1, 2);
      if (p.life > 46) { ctx.fillRect(Math.round(p.x) - 2, Math.round(sy) + 1, 1, 1); ctx.fillRect(Math.round(p.x) + 2, Math.round(sy) + 1, 1, 1); drops.splice(i, 1); }
    }

    // chamas, fumaça e brasas
    const tops = inst.map((y0) => y0 + TY - 4);
    sides.forEach((sx, s) => {
      let best = tops[0], bd = Infinity;
      for (const y of tops) { const dd = Math.abs(y - mouse.y); if (dd < bd) { bd = dd; best = y; } }
      stepFlame(s, sx, best);
    });
    for (let i = smoke.length - 1; i >= 0; i--) {
      const p = smoke[i]; p.x += p.vx + Math.sin((p.life + i) * 0.08) * 0.15; p.y += p.vy;
      const t = p.life / p.max;
      ctx.fillStyle = `rgba(60,48,70,${0.34 * (1 - t)})`;
      for (const y of tops) ctx.fillRect(Math.round(sides[p.s] + p.x), Math.round(y + p.y), t > 0.5 ? 3 : 2, 2);
      if (++p.life > p.max) smoke.splice(i, 1);
    }
    sides.forEach((sx, s) => { for (const y of tops) if (y > -40 && y < H + 50) drawFlame(s, sx, y); });
    for (let i = embers.length - 1; i >= 0; i--) {
      const p = embers[i]; p.vy += p.g || 0; p.x += p.vx + Math.sin((p.life + i) * 0.2) * 0.12; p.y += p.vy;
      ctx.fillStyle = p.life / p.max < 0.5 ? fireCol[1] : fireCol[2];
      for (const y of tops) ctx.fillRect(Math.round(sides[p.s] + p.x), Math.round(y + p.y), 1, 1);
      if (++p.life > p.max) embers.splice(i, 1);
    }
    mouse.vx *= 0.82; mouse.vy *= 0.82;

    // luz
    const lights = [];
    sides.forEach((sx, s) => {
      const lt = tick * FLAME_SPEED;
      const fl = Math.sin(lt * 0.31 + s * 2) * 2.5 + Math.sin(lt * 0.13 + s) * 3 + Math.sin(lt * 0.71 + s * 5) * 1 - flames[s].gust * 5;
      const r = Math.min(W * 0.42, 54) + fl;
      for (const y of tops) if (y > -r * 3 && y < H + r * 3) lights.push({ x: sx + flames[s].lean * 6, y: y - 8, sx: 1, i: 1.25, k: 1 / (r * r) });
    });
    const gl = window.thendGlow;
    if (gl && gl.a > 0.01) { const r = (gl.r / U) * 0.5; lights.push({ x: gl.x / U, y: gl.y / U, sx: 0.8, i: 0.95 * gl.a, k: 1 / (r * r) }); }
    if (tick % 2 === 0 || reduce || tick < 3) computeLight(lights, 0.11 - depth * 0.03);
    ctx.drawImage(light, 0, 0, LW * LS, LH * LS);

    // tom quente (ou violeta, no fundo) sobre as pedras perto do fogo
    ctx.globalCompositeOperation = 'lighter';
    const warm = lerp3([255, 140, 50], [170, 80, 230], foul);
    sides.forEach((sx) => {
      for (const y of tops) {
        const g = ctx.createRadialGradient(sx, y - 6, 2, sx, y - 6, 64);
        g.addColorStop(0, `rgba(${warm[0] | 0},${warm[1] | 0},${warm[2] | 0},0.22)`); g.addColorStop(1, `rgba(${warm[0] | 0},${warm[1] | 0},${warm[2] | 0},0)`);
        ctx.fillStyle = g; ctx.fillRect(sx - 64, y - 70, 128, 128);
      }
    });
    ctx.globalCompositeOperation = 'source-over';

    // poeira no ar: mais visível perto da luz, e passa na frente da parede ao rolar
    for (const p of dust) {
      p.x += p.vx + Math.sin(tick * 0.01 + p.ph) * 0.04; p.y += p.vy - dScroll * p.z;
      if (p.y < -2) p.y += H + 4; else if (p.y > H + 2) p.y -= H + 4;
      if (p.x < -2) p.x += W + 4; else if (p.x > W + 2) p.x -= W + 4;
      let near = 0;
      for (const l of lights) { const dx = p.x - l.x, dy = p.y - l.y; near = Math.max(near, l.i / (1 + (dx * dx + dy * dy) * l.k * 1.5)); }
      const a = clamp(near - 0.12) * (0.5 + 0.5 * Math.sin(tick * 0.05 + p.ph));
      if (a > 0.03) { ctx.fillStyle = `rgba(255,222,170,${a * 0.8})`; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
    }

    // olhos no escuro: só onde a luz não chega, e fogem do cursor
    if (eyes.length < 2 && Math.random() < 0.004 + depth * 0.004) {
      const ex = W * 0.3 + Math.random() * W * 0.4, ey = Math.random() * H;
      let lit = 0; for (const l of lights) { const dx = ex - l.x, dy = ey - l.y; lit += l.i / (1 + (dx * dx + dy * dy) * l.k); }
      if (lit < 0.12) eyes.push({ x: Math.round(ex), y: Math.round(ey), life: 0, max: 140 + Math.random() * 160, red: Math.random() < 0.5 });
    }
    for (let i = eyes.length - 1; i >= 0; i--) {
      const e = eyes[i]; e.life++; e.y -= dScroll * 0.6;
      const blink = (e.life > 50 && e.life < 56) || e.life < 4 || e.life > e.max - 4;
      if (Math.hypot(mouse.x - e.x, mouse.y - e.y) < 40) e.life = Math.max(e.life, e.max - 3);
      if (!blink) { ctx.fillStyle = e.red ? '#d0433a' : '#d8c04a'; ctx.fillRect(e.x, Math.round(e.y), 1, 1); ctx.fillRect(e.x + 3, Math.round(e.y), 1, 1); }
      if (e.life > e.max) eyes.splice(i, 1);
    }

    // primeiro plano: correntes penduradas nas bordas, que passam mais rápido que a parede
    const fo = (scrollY * 1.3) / U;
    ctx.fillStyle = '#030104';
    for (let k = Math.floor(fo / 260) - 1; k <= Math.floor((fo + H) / 260) + 1; k++) {
      const side = ((k % 2) + 2) % 2, len = 46 + ((((k * 37) % 5) + 5) % 5) * 11;
      const x = side ? W - 5 : 3, y = Math.round(k * 260 - fo);
      for (let j = 0; j < len; j += 6) { ctx.fillRect(x, y + j, 3, 5); ctx.fillRect(x + 1, y + j + 5, 1, 1); }
      ctx.fillRect(x - 1, y + len, 5, 3); ctx.fillRect(x + (side ? -2 : 3), y + len + 3, 2, 4);
    }

    lastScroll = scrollY;
    if (!reduce) requestAnimationFrame(frame);
  }

  resize();
  if (reduce) addEventListener('scroll', frame, { passive: true });
  frame();
})();
