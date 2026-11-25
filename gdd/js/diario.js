// O Diário do Thucker: cada item abaixo é uma página do diário.
// Para adicionar uma página, copie um bloco e preencha:
//   texto: lista de parágrafos (cada item entre aspas vira um parágrafo)
//   titulo: subtítulo da página (opcional)
//   antes: parágrafos que vêm antes da arte (opcional)
//   arte:  caminho de uma imagem em assets/ (opcional), ex.: 'assets/diario/pagina-1.png'
//   pixel: pinturas recortadas de uma foto e convertidas em pixel art (opcional)
const DIARIO = [
  {
    texto: [
      'Olá a você que encontrou esse pequeno diário, se o fez, eu já parti, então lhe desejo que o que consta aqui te proteja! — Thucker',
      'No primeiro instante em que adentrei a masmorra, um zumbido sempre pairava o ar e quando andávamos pelo chão a demasia de coisas que grudavam em meus calços incomodava mais que enfrentar os goblins.',
      'Quanto mais se entrava na masmorra, o ar umedecia, as paredes tendiam a ficar mais pegajosas e o que antes só caía do teto começou a avançar em minha direção.',
      'Eu o apelidei de gosma. Ainda vou rever isso mais para frente.',
      'Porém a luta com ele foi simples, precisava apenas retirar dentro dele o que o fazia andar! Dessa vez foi uma... bota?',
    ],
    arte: null,
  },
  {
    titulo: 'Gosma, Devorador de Cadáveres',
    texto: [
      `Em algum outro momento eu duvidaria.
Duvidaria de mim
Das minhas pernas
Dos meus olhos
Duvidaria que a morte há de continuar algo após.`,
      `Mas lá estava
Um coração
Um olho que me seguia
E algo dizia simplesmente
“Me mate!”`,
    ],
    // pinturas recortadas da foto da página e convertidas em pixel art: [x, y, largura, altura] na foto;
    // colunas = largura em pixels da arte final; escala = quantos pixels de tela cada pixel ocupa;
    // contorno: 'claro', 'escuro' ou sem a opção (nenhum); natural: true mantém as cores da foto, sem filtro;
    // inteira: true usa o recorte todo, sem remover o papel (para pinturas que ocupam a página);
    // vazar: tamanho mínimo (em pixels) para um vão de papel dentro da pintura ficar transparente
    pixel: [
      { src: 'assets/diario/pagina-2.jpg', recorte: [105, 345, 205, 155], colunas: 124, escala: 2 },
      { src: 'assets/diario/pagina-2.jpg', recorte: [305, 340, 250, 165], colunas: 150, escala: 2 },
      { src: 'assets/diario/pagina-2.jpg', recorte: [112, 495, 365, 400], colunas: 220, escala: 2, vazar: 120 },
    ],
  },
  {
    antes: [
      'Então quando o derrotei, arrancando-lhe o coração, seu poder corrosivo subiu por entre as minhas veias e se uniu a mim.',
    ],
    pixel: [
      { src: 'assets/diario/pagina-3.jpg', recorte: [116, 266, 408, 530], colunas: 264, escala: 2, natural: true, vazar: 40 },
    ],
    texto: [
      'Longe do esperado. Dessa vez não foi o meu fim. Ainda sinto que falta muito para convencê-las, mas aqui findo meu primeiro andar.',
      '“Não houve prazer algum em seguir em frente.”',
    ],
  },
  {
    antes: [
      'Dia 2 – Voltei para Ghurd, mas não dá para chamar de lar, no máximo um dormitório decrépito e mal cuidado. Contudo o céu de fora da masmorra consegue ser ainda mais sufocante.',
    ],
    pixel: [
      { src: 'assets/diario/pagina-4.jpg', recorte: [36, 328, 492, 625], colunas: 264, escala: 2, natural: true, inteira: true },
    ],
  },
  {
    antes: [
      'Não só retornei para Ghurd, pela exaustão, mas comigo haviam muitas dúvidas. Com isso borbulhando os pensamentos, queria questionar a Comandante de Guerra, Thalya, que também é a minha irmã.',
      'Trouxe comigo experiências e espólios. O mais intrigante seguia sendo o cristal, que fora o núcleo de uma Gosma.',
      'Consigo emanar uma força, energia ou algo do tipo, que me permite corroer certas coisas.',
    ],
    pixel: [
      { src: 'assets/diario/pagina-5.jpg', recorte: [60, 472, 400, 352], colunas: 250, escala: 2, natural: true },
    ],
    texto: [
      'A pedra tinha luz própria, tinha vontade, tinha... uma alma?',
      'Ao levar para minha irmã, com sua austeridade...',
    ],
  },
];

(() => {
  'use strict';
  const index = document.getElementById('diario-indice');
  const reader = document.getElementById('leitor');
  if (!index || !reader) return;
  const title = document.getElementById('leitor-titulo');
  const body = document.getElementById('leitor-corpo');
  const prev = document.getElementById('leitor-ant');
  const next = document.getElementById('leitor-prox');
  const page = reader.querySelector('.page');
  let current = 0, opener = null;

  DIARIO.forEach((_, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span class="leaf-icon" aria-hidden="true"></span>Página ' + (i + 1);
    b.addEventListener('click', () => open(i, b));
    li.appendChild(b); index.appendChild(li);
  });

  // Converte um recorte de foto de pintura em pixel art: corrige a luz amarelada pelo tom do papel,
  // remove o papel em volta, descarta rabiscos soltos, reduz os tons e, se pedido, fecha com um contorno.
  function pixelArt(a) {
    const cv = document.createElement('canvas');
    cv.className = 'pixel-art';
    const [cx, cy, cw, ch] = a.recorte, W = a.colunas, H = Math.round(W * ch / cw);
    cv.width = W; cv.height = H; cv.style.width = W * (a.escala || 4) + 'px';
    const img = new Image();
    img.onload = () => {
      const g = cv.getContext('2d', { willReadFrequently: true });
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(img, cx, cy, cw, ch, 0, 0, W, H);
      const im = g.getImageData(0, 0, W, H), d = im.data, N = W * H;
      // tom do papel: média dos pixels claros da moldura do recorte
      const rim = [];
      for (let x = 0; x < W; x++) rim.push(x, (H - 1) * W + x);
      for (let y = 0; y < H; y++) rim.push(y * W, y * W + W - 1);
      const lum = (i) => d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11;
      const sorted = rim.slice().sort((p, q) => lum(p) - lum(q)), bright = sorted.slice(Math.floor(sorted.length * 0.5));
      const paper = [0, 0, 0]; bright.forEach((i) => { paper[0] += d[i * 4]; paper[1] += d[i * 4 + 1]; paper[2] += d[i * 4 + 2]; });
      const T = [238, 226, 200], gain = paper.map((v, k) => Math.min(1.7, T[k] / Math.max(1, v / bright.length)));
      const orig = new Uint8ClampedArray(d);   // cores da foto, sem correção
      for (let i = 0; i < N; i++) for (let k = 0; k < 3; k++) d[i * 4 + k] = Math.min(255, d[i * 4 + k] * gain[k]);
      const isPaper = (i) => { const r = d[i * 4] - T[0], gg = d[i * 4 + 1] - T[1], b = d[i * 4 + 2] - T[2]; return r * r + gg * gg + b * b < 58 * 58; };
      // fundo: papel alcançável a partir da moldura
      const bg = new Uint8Array(N), stack = [];
      if (!a.inteira) rim.forEach((i) => { if (!bg[i] && isPaper(i)) { bg[i] = 1; stack.push(i); } });
      while (stack.length) {
        const i = stack.pop(), x = i % W;
        for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) if (n >= 0 && n < N && !bg[n] && isPaper(n)) { bg[n] = 1; stack.push(n); }
      }
      // vãos: áreas de papel cercadas pela pintura, a partir de um tamanho mínimo, também ficam transparentes
      if (a.vazar) {
        const tight = (i) => { const r = d[i * 4] - T[0], gg = d[i * 4 + 1] - T[1], b = d[i * 4 + 2] - T[2]; return r * r + gg * gg + b * b < 46 * 46; };
        const seen = new Uint8Array(N);
        for (let s0 = 0; s0 < N; s0++) {
          if (bg[s0] || seen[s0] || !tight(s0)) continue;
          const reg = [s0], st = [s0]; seen[s0] = 1;
          while (st.length) {
            const i = st.pop(), x = i % W;
            for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) if (n >= 0 && n < N && !bg[n] && !seen[n] && tight(n)) { seen[n] = 1; reg.push(n); st.push(n); }
          }
          if (reg.length >= a.vazar) reg.forEach((i) => { bg[i] = 1; });
        }
      }
      // mantém só as massas grandes de tinta (letras a lápis e respingos somem)
      const lab = new Int32Array(N); let next = 0; const sizes = [0];
      for (let s = 0; s < N; s++) {
        if (bg[s] || lab[s]) continue;
        lab[s] = ++next; sizes.push(0); const st = [s];
        while (st.length) {
          const i = st.pop(), x = i % W; sizes[next]++;
          for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) if (n >= 0 && n < N && !bg[n] && !lab[n]) { lab[n] = next; st.push(n); }
        }
      }
      const big = Math.max(...sizes), keep = (i) => !bg[i] && sizes[lab[i]] >= big * 0.25;
      const out = new Uint8ClampedArray(N * 4);
      for (let i = 0; i < N; i++) {
        if (!keep(i)) continue;
        // mais contraste e saturação, menos tons
        if (a.natural) { out[i * 4] = orig[i * 4]; out[i * 4 + 1] = orig[i * 4 + 1]; out[i * 4 + 2] = orig[i * 4 + 2]; out[i * 4 + 3] = 255; continue; }
        let r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2];
        const l = r * 0.3 + gg * 0.59 + b * 0.11;
        r = l + (r - l) * 1.25; gg = l + (gg - l) * 1.25; b = l + (b - l) * 1.25;
        const q = (v) => Math.round(Math.max(0, Math.min(255, (v - 128) * 1.15 + 128)) / 36) * 36;
        out[i * 4] = q(r); out[i * 4 + 1] = q(gg); out[i * 4 + 2] = q(b); out[i * 4 + 3] = 255;
      }
      // contorno opcional em volta da silhueta: contorno: 'claro' (2 pixels), 'escuro' (1 pixel) ou ausente (sem contorno)
      let solid = new Uint8Array(N);
      for (let i = 0; i < N; i++) solid[i] = out[i * 4 + 3] ? 1 : 0;
      const oc = a.contorno === 'escuro' ? [42, 22, 34] : [250, 244, 226];
      for (let pass = 0; pass < (a.contorno === 'claro' ? 2 : a.contorno === 'escuro' ? 1 : 0); pass++) {
        const grow = solid.slice();
        for (let i = 0; i < N; i++) {
          if (solid[i]) continue;
          const x = i % W;
          if ((x > 0 && solid[i - 1]) || (x < W - 1 && solid[i + 1]) || (i >= W && solid[i - W]) || (i + W < N && solid[i + W])) {
            grow[i] = 1; out[i * 4] = oc[0]; out[i * 4 + 1] = oc[1]; out[i * 4 + 2] = oc[2]; out[i * 4 + 3] = 255;
          }
        }
        solid = grow;
      }
      g.putImageData(new ImageData(out, W, H), 0, 0);
      retear();
    };
    img.src = a.src;
    return cv;
  }

  function show(i) {
    current = i;
    const e = DIARIO[i];
    title.textContent = 'Página ' + (i + 1);
    body.textContent = '';
    if (e.titulo) { const h = document.createElement('h3'); h.textContent = e.titulo; body.appendChild(h); }
    if (e.antes) e.antes.forEach((t) => { const p = document.createElement('p'); p.textContent = t; body.appendChild(p); });
    if (e.pixel) { const box = document.createElement('div'); box.className = 'reader-pixel'; e.pixel.forEach((a) => box.appendChild(pixelArt(a))); body.appendChild(box); }
    if (e.arte) { const img = document.createElement('img'); img.src = e.arte; img.alt = ''; img.className = 'reader-art'; img.addEventListener('load', retear); body.appendChild(img); }
    if (e.texto && e.texto.length) e.texto.forEach((t) => { const p = document.createElement('p'); p.textContent = t; body.appendChild(p); });
    else if (!e.arte && !e.pixel) { const p = document.createElement('p'); p.className = 'reader-empty'; p.textContent = 'Esta página ainda não foi transcrita.'; body.appendChild(p); }
    prev.disabled = i === 0; next.disabled = i === DIARIO.length - 1;
    reader.scrollTop = 0;
    retear();
  }
  function retear() { if (window.thendTear) requestAnimationFrame(() => window.thendTear(page, 500 + current)); }
  function open(i, from) {
    opener = from || null;
    reader.hidden = false; document.body.classList.add('reading');
    show(i);
    reader.querySelector('.reader-close').focus();
  }
  function close() {
    reader.hidden = true; document.body.classList.remove('reading');
    if (opener) opener.focus();
  }

  prev.addEventListener('click', () => { if (current > 0) show(current - 1); });
  next.addEventListener('click', () => { if (current < DIARIO.length - 1) show(current + 1); });
  reader.querySelector('.reader-close').addEventListener('click', close);
  reader.addEventListener('click', (e) => { if (e.target === reader) close(); });
  addEventListener('keydown', (e) => {
    if (reader.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && current > 0) show(current - 1);
    else if (e.key === 'ArrowRight' && current < DIARIO.length - 1) show(current + 1);
  });
  addEventListener('resize', () => { if (!reader.hidden) retear(); });
})();
