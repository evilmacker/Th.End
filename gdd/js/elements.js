// Elementos de Th.End: runas em pixel art e as combinações entre eles.
// Cada runa é um desenho de 9 x 9 ('o' = traço, '.' = vazio) gravado numa plaquinha de pedra.
// Qualquer item da página com data-el="chave" ganha a runa correspondente.
const ELEMENTOS = {
  fogo: { nome: 'Fogo', cor: [240, 106, 50], runa: [
    '....o....', '....o....', '...o.o...', '...o.o...', '..o...o..', '..o.o.o..', '.o..o..o.', '.o.....o.', 'ooooooooo'] },
  agua: { nome: 'Água', cor: [84, 160, 232], runa: [
    'ooooooooo', '.o.....o.', '.o.ooo.o.', '..o...o..', '..o...o..', '...o.o...', '...o.o...', '....o....', '....o....'] },
  eletrico: { nome: 'Elétrico', cor: [244, 204, 64], runa: [
    '..ooooo..', '.....o...', '....o....', '...o.....', '..ooooo..', '.....o...', '....o....', '...o.....', '..o......'] },
  natureza: { nome: 'Natureza', cor: [104, 190, 96], runa: [
    'o...o...o', '.o..o..o.', '..o.o.o..', '...ooo...', '....o....', '....o....', '....o....', '...ooo...', '..o...o..'] },
  sombra: { nome: 'Sombra', cor: [150, 96, 204], runa: [
    '..ooooo..', '.o.......', 'o........', 'o...o....', 'o...o....', 'o...o....', 'o........', '.o.......', '..ooooo..'] },
  luz: { nome: 'Luz', cor: [255, 236, 170], runa: [
    '....o....', 'o...o...o', '.o.....o.', '...ooo...', 'oo.o.o.oo', '...ooo...', '.o.....o.', 'o...o...o', '....o....'] },
  acido: { nome: 'Ácido', cor: [190, 226, 66], runa: [
    'o.......o', '.o.....o.', '..o...o..', '...o.o...', '....o....', '.........', '....o....', '...o.o...', '....o....'] },
  vampirismo: { nome: 'Vampirismo', cor: [214, 44, 74], runa: [
    'ooooooooo', 'o.o...o.o', 'o.o...o.o', 'o.o...o.o', '.oo...oo.', '.o.....o.', '.o..o..o.', '....o....', '....o....'] },
  loucura: { nome: 'Loucura', cor: [236, 116, 196], runa: [
    'ooooooooo', 'o.......o', 'o.ooooo.o', 'o.o...o.o', 'o.o.o.o.o', 'o.o.ooo.o', 'o.o.....o', 'o.ooooooo', 'o........'] },
  vazio: { nome: 'Vazio', cor: [176, 168, 200], runa: [
    '....o....', '...o.o...', '..o...o..', '.o.......', 'o........', '.o.....o.', '..o...o..', '...o.o...', '....o....'] },
};

// Combinações: uma para cada dupla de elementos (nome e ideia).
const COMBINACOES = [
  ['fogo', 'agua', 'Vapor', 'Calor que atravessa qualquer proteção'],
  ['fogo', 'eletrico', 'Plasma', 'Explosão que atinge tudo em volta'],
  ['fogo', 'natureza', 'Combustão', 'A queima se alastra e ganha força'],
  ['fogo', 'sombra', 'Brasa Negra', 'Fogo que não ilumina e não se apaga'],
  ['fogo', 'luz', 'Pira', 'Chama que purifica: consome os efeitos do alvo'],
  ['fogo', 'acido', 'Fuligem', 'Nuvem que cega e corrói aos poucos'],
  ['fogo', 'vampirismo', 'Febre', 'O alvo arde por dentro e não consegue se curar'],
  ['fogo', 'loucura', 'Miragem', 'O calor distorce a visão e os golpes erram'],
  ['fogo', 'vazio', 'Cinzas', 'Não sobra nada para queimar: o que é consumido não volta'],
  ['agua', 'eletrico', 'Condução', 'O choque salta de um inimigo para o outro'],
  ['agua', 'natureza', 'Pântano', 'Lama que prende e atrasa'],
  ['agua', 'sombra', 'Abismo', 'Afoga: tira o fôlego e a energia'],
  ['agua', 'luz', 'Prisma', 'A luz se divide e atinge vários alvos'],
  ['agua', 'acido', 'Dissolver', 'Derrete armadura'],
  ['agua', 'vampirismo', 'Maré Rubra', 'Dreno contínuo, turno após turno'],
  ['agua', 'loucura', 'Vertigem', 'O alvo perde o chão e a vez'],
  ['agua', 'vazio', 'Estiagem', 'Seca a cura e os recursos do alvo'],
  ['eletrico', 'natureza', 'Sinapse', 'Raízes conduzem o choque a todos os enraizados'],
  ['eletrico', 'sombra', 'Apagão', 'Ninguém vê a intenção de ninguém'],
  ['eletrico', 'luz', 'Clarão', 'Atordoa e cega'],
  ['eletrico', 'acido', 'Galvanismo', 'Acumula carga para estourar depois'],
  ['eletrico', 'vampirismo', 'Sifão', 'Rouba energia em vez de vida'],
  ['eletrico', 'loucura', 'Curto-Circuito', 'Embaralha as ações do alvo'],
  ['eletrico', 'vazio', 'Silêncio', 'Zera a energia'],
  ['natureza', 'sombra', 'Mofo', 'Esporos que se espalham no escuro'],
  ['natureza', 'luz', 'Florescer', 'Cura e crescimento'],
  ['natureza', 'acido', 'Peçonha', 'Veneno que se acumula'],
  ['natureza', 'vampirismo', 'Parasita', 'Uma planta que drena o hospedeiro'],
  ['natureza', 'loucura', 'Alucinação', 'O alvo enxerga o que não existe'],
  ['natureza', 'vazio', 'Ermo', 'Nada cresce: impede a recuperação'],
  ['sombra', 'luz', 'Aniquilação', 'Os opostos se anulam e levam tudo junto'],
  ['sombra', 'acido', 'Piche', 'Gruda, pesa e corrói'],
  ['sombra', 'vampirismo', 'Predador', 'Mais forte contra quem já está ferido'],
  ['sombra', 'loucura', 'Pesadelo', 'Medo que paralisa'],
  ['sombra', 'vazio', 'Breu', 'Escuridão total, sem alvo e sem intenção visíveis'],
  ['luz', 'acido', 'Alvejar', 'Apaga as proteções e melhorias do alvo'],
  ['luz', 'vampirismo', 'Estigma', 'Poder em troca da própria vida'],
  ['luz', 'loucura', 'Epifania', 'Uma visão que revela demais'],
  ['luz', 'vazio', 'Eclipse', 'A luz é engolida por um instante e tudo para'],
  ['acido', 'vampirismo', 'Sangria', 'O sangue drenado volta como dano'],
  ['acido', 'loucura', 'Amnésia', 'O alvo esquece o que ia fazer'],
  ['acido', 'vazio', 'Erosão', 'Desgasta de forma permanente'],
  ['vampirismo', 'loucura', 'Frenesi', 'Ataca mais e não se defende'],
  ['vampirismo', 'vazio', 'Fome', 'Um dreno que nunca sacia'],
  ['loucura', 'vazio', 'Oblívio', 'Cartas e memórias somem'],
];

(() => {
  'use strict';
  const STONE = [44, 34, 52], HI = [78, 64, 90], LO = [22, 16, 28];
  const css = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // Plaquinha de pedra de 13 x 13 com a runa acesa na cor do elemento.
  function runa(chave, escala) {
    const e = ELEMENTOS[chave];
    if (!e) return null;
    const N = 13, cv = document.createElement('canvas');
    cv.width = N; cv.height = N; cv.className = 'el-icon'; cv.setAttribute('aria-hidden', 'true');
    cv.style.width = cv.style.height = N * escala + 'px';
    const g = cv.getContext('2d');
    g.fillStyle = css(STONE); g.fillRect(0, 0, N, N);
    g.fillStyle = css(HI); g.fillRect(0, 0, N, 1); g.fillRect(0, 0, 1, N);
    g.fillStyle = css(LO); g.fillRect(0, N - 1, N, 1); g.fillRect(N - 1, 0, 1, N);
    g.clearRect(0, 0, 1, 1); g.clearRect(N - 1, 0, 1, 1); g.clearRect(0, N - 1, 1, 1); g.clearRect(N - 1, N - 1, 1, 1);
    const on = (x, y) => y >= 0 && y < 9 && x >= 0 && x < 9 && e.runa[y][x] === 'o';
    // brilho em volta do traço, depois o traço
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
      if (on(x, y)) continue;
      if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) { g.fillStyle = css(mixc(STONE, e.cor, 0.3)); g.fillRect(x + 2, y + 2, 1, 1); }
    }
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if (on(x, y)) { g.fillStyle = css(e.cor); g.fillRect(x + 2, y + 2, 1, 1); }
    return cv;
  }
  window.thendRuna = runa;

  // Etiquetas de elemento espalhadas pela página (bestiário etc.)
  document.querySelectorAll('[data-el]').forEach((el) => {
    const cv = runa(el.dataset.el, 2);
    if (cv) { el.classList.add('has-icon'); el.prepend(cv); }
  });

  // Página "Elementos": cada runa é um botão que mostra as combinações daquele elemento.
  const lista = document.getElementById('elementos'), painel = document.getElementById('combinacoes');
  if (!lista || !painel) return;
  const botoes = {};
  Object.keys(ELEMENTOS).forEach((k) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.className = 'rune-btn'; b.setAttribute('aria-pressed', 'false');
    b.appendChild(runa(k, 4));
    const nome = document.createElement('span'); nome.textContent = ELEMENTOS[k].nome; b.appendChild(nome);
    b.addEventListener('click', () => mostrar(botoes[k].getAttribute('aria-pressed') === 'true' ? null : k));
    botoes[k] = b; li.appendChild(b); lista.appendChild(li);
  });

  function mostrar(k) {
    Object.keys(botoes).forEach((j) => botoes[j].setAttribute('aria-pressed', j === k ? 'true' : 'false'));
    painel.textContent = '';
    if (!k) { painel.hidden = true; return; }
    painel.hidden = false;
    const h = document.createElement('h3'); h.textContent = 'Combinações de ' + ELEMENTOS[k].nome; painel.appendChild(h);
    const ul = document.createElement('ul'); ul.className = 'combo-list';
    COMBINACOES.filter((c) => c[0] === k || c[1] === k).forEach((c) => {
      const outro = c[0] === k ? c[1] : c[0];
      const li = document.createElement('li');
      const par = document.createElement('span'); par.className = 'combo-pair';
      par.appendChild(runa(k, 2)); par.appendChild(document.createTextNode('+')); par.appendChild(runa(outro, 2));
      const txt = document.createElement('span'); txt.className = 'combo-text';
      const nome = document.createElement('strong'); nome.textContent = c[2];
      const com = document.createElement('small'); com.textContent = ELEMENTOS[k].nome + ' + ' + ELEMENTOS[outro].nome;
      const ideia = document.createElement('span'); ideia.textContent = c[3];
      txt.appendChild(nome); txt.appendChild(com); txt.appendChild(ideia);
      li.appendChild(par); li.appendChild(txt); ul.appendChild(li);
    });
    painel.appendChild(ul);
  }
})();
