# Th.End

Roguelike de cartas em pixel art. Thucker, um summoner nascido sem companion, desce os cem andares da masmorra de Ghurd, capturando as habilidades das criaturas que derrota.

**Gêneros:** roguelike · card battle · monster skill catcher · bag builder
**Plataformas:** notebook (Steam) primeiro, Android depois
**Idioma:** português do Brasil (textos e dublagem)

## Estrutura

```
Th.End/
├── gdd/                 GDD visual (página web)
│   ├── index.html       abre o GDD
│   ├── css/style.css
│   ├── js/
│   │   ├── diario.js    páginas do Diário do Thucker  ← edite aqui
│   │   ├── elements.js  10 elementos e 45 combinações ← edite aqui
│   │   ├── intro.js     animação de abertura (livro → logo)
│   │   ├── pages.js     folhas rasgadas em pixel art
│   │   └── scene.js     cenário de fundo
│   └── assets/          logo, sprites e fotos das páginas do diário
├── CLAUDE.md            regras de trabalho (lidas automaticamente pelo Claude)
└── docs/
    ├── pendencias.md    decisões de design em aberto e proposta do modo companheiro
    └── conversas/       resumos de conversas anteriores sobre o Th.End
```

O texto de **O que restou**, **Cem andares**, **Th. Family** e do **Bestiário** fica direto no `gdd/index.html`.

## Como usar no Avell (Windows)

### 1. Instalar (uma vez)
- [Git para Windows](https://git-scm.com/download/win)
- [VS Code](https://code.visualstudio.com/) com a extensão **Live Server** (de Ritwick Dey)
- Opcional: [GitHub Desktop](https://desktop.github.com/), se preferir clicar em vez de usar comandos

### 2. Baixar o projeto (uma vez)
No terminal (PowerShell ou Git Bash):

```bash
cd ~/Documents
git clone https://github.com/evilmacker/Th.End.git
cd Th.End
```

No GitHub Desktop: **File → Clone repository → evilmacker/Th.End**.

### 3. Ver o GDD
Abra a pasta `Th.End` no VS Code, clique com o botão direito em `gdd/index.html` e escolha **Open with Live Server**. O navegador abre o GDD e recarrega sozinho sempre que você salvar um arquivo.

> Use o Live Server (ou outro servidor local) em vez de abrir o `index.html` com dois cliques. Aberto direto do disco, o navegador bloqueia a leitura dos pixels das fotos, e as pinturas do diário podem não aparecer.

### 4. Salvar na nuvem depois de editar

```bash
git add -A
git commit -m "Descreva o que mudou"
git push
```

### 5. Pegar as mudanças feitas em outro lugar
Antes de começar a editar:

```bash
git pull
```

## Como editar

- **Nova página do diário:** em `gdd/js/diario.js`, copie um bloco `{ ... }` da lista `DIARIO` e preencha `texto`, `titulo`, `antes` ou `pixel`. As fotos vão em `gdd/assets/diario/`.
- **Elementos e combinações:** `gdd/js/elements.js` (`ELEMENTOS` e `COMBINACOES`).
- **Nova criatura no bestiário:** copie um bloco `<article class="sheet small">` em `gdd/index.html`. O sprite vai em `gdd/assets/sprites/`.
