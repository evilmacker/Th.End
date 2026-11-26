# Th.End: site de apresentação (resumo da sessão)

> Resumo trazido da conversa "Site de apresentação do jogo" (projeto Th.End Oficial), em 26/11/2026.
>
> **Aviso da própria sessão:** depois das últimas edições dela, `index.html`, `js/diario.js` e `css/style.css` foram alterados fora daquela conversa, provavelmente pela sessão derivada ("fork"). O resumo reflete o que foi feito lá; o estado atual desses três arquivos precisa ser conferido.
>
> **Nota:** a pasta `gdd/` deste repositório é a cópia da **página publicada** (artifact). A versão de trabalho está no PC, em `C:\Users\gusta\Desktop\Th.End\site`, e pode estar mais nova.

## Contexto do jogo
- **Th.End**: roguelike, card battle, monster skill catcher e bag builder, em pixel art dark fantasy. Sai para **Steam e Android**, com textos e dublagem em português do Brasil.
- **Estrutura:** 100 andares lineares, 100 criaturas e 400 habilidades. Cada criatura derrotada derruba habilidade. Há um limite de habilidades equipadas, e os itens organizados no inventário potencializam habilidades ou dão cartas.
- **Lore usada no site:** o reino de **Ghurd**. **Thucker** é um summoner sem companion de nascença. **Thalya** é a irmã dele, comandante de guerra.
- **Segredo de enredo (nunca revelar no site, só insinuar):** **Zhara é a mãe de Thucker e Thalya**. O nome da família junta a letra do pai com a 2ª letra da mãe: T + h (de Z**h**ara) = "Th". No bestiário ela é "Zhara, a Sem Volta".

## Regras de trabalho combinadas
- **Perguntar antes de supor** qualquer conteúdo, nome, estilo ou escopo.
- **Material do Drive:** só usar o que foi aprovado. Muita coisa lá é feita por IA e não deve ser usada. Aprovados: os sprites pixel art (Idle, Attack, Speaking), a `Logo.png`, a capa frontal do livro enviada na conversa e as fotos do diário.
- **Visual:** o `ThEnd_ApresentacaoGrafica.html` do Drive é a direção que **não** se quer. A lore e as mecânicas dele valem, corrigidas para 100 andares e drops de habilidade.
- **Preferências de arte:** ilustrações do diário **sem contorno** e **sem filtro de cor** (só enquadrar e recortar o branco).
- **Ferramentas:** preferência por soluções gratuitas.

## Onde está tudo
- **Projeto:** `C:\Users\gusta\Desktop\Th.End\site` (HTML, CSS e JS puros).
  - `index.html`, `css/style.css`
  - `js/scene.js`: cenário (parede, tochas, luz, poeira, gotas, olhos, correntes)
  - `js/intro.js`: abertura animada do livro que vira a logo
  - `js/pages.js`: folhas rasgadas pintadas em pixel art
  - `js/diario.js`: páginas do diário e conversor de pinturas para pixel art
  - `js/elements.js`: runas, os 10 elementos e as 45 combinações
  - `assets/`: logo, capa (`book-front.webp`), sprites, fotos do diário (`assets/diario/pagina-2..5.jpg`)
- **Pré-visualização local:** `node dev-server.js` na pasta `Th.End` abre em `http://localhost:5173` e recarrega sozinho. Existe também `.claude/launch.json` com o nome "thend-site".
- **Revisar um instante da abertura:** acrescente `?t=2.5` à URL (vai de 0 a 5.4).
- **Página publicada (artifact):** https://claude.ai/artifact/MWpj8Wuq4jmTrgpZSCyXiR
  - Está compartilhada como **"qualquer pessoa com o link"**, e quem estiver com ela aberta recebe as atualizações na hora.
  - Está na versão 2 (tochas mais calmas).
  - Para republicar: gerar um HTML a partir do `<body>` do `index.html` (com `<title>`, as fontes e `css/style.css` no topo) e publicar no mesmo link com os arquivos de `site/` em `files`. As duas animações de fala não são enviadas, porque o site não usa.
- **Cópia da abertura antes da grande melhoria gráfica:** `%TEMP%\intro.before-upgrade.js`.

## Como o site ficou

**Abertura**
- O livro vermelho (com a capa frontal do usuário) abre, as folhas viram, e as páginas se corrompem com veias roxas, manchas, espinhos e gotas.
- Uma frente de queima com brasas transforma tudo na logo.
- Quando a logo trava: clarão e tremor. Depois, o olho segue o mouse, pisca e dilata a pupila quando o cursor chega perto.
- Partículas de fumaça das trevas desviam do cursor.
- Ao rolar a página, a sequência volta, o livro fecha e começa a leitura.

**Cenário**
- Parede de pedra que muda ao descer: seca no topo, úmida no meio, corrompida no fundo.
- Tochas desenhadas do zero, com chama que reage ao mouse. A velocidade foi reduzida para 30% (constante `FLAME_SPEED = 0.3` em `scene.js`).
- Luz pontilhada, poeira, gotas, olhos no escuro, grade de cela e correntes em primeiro plano.

**Textos:** ficam em folhas rasgadas em pixel art, com fonte Jacquard 24 nos títulos e Pixelify Sans no corpo.

## Textos finais do site

**O que restou**
> Ghurd, o reino que diz que qualquer potencial é uma arma. *(destaque)*
>
> Em Th.End, você controla Thucker, um filho perdido do caos, que teve o azar de ser eficiente demais para ser reconhecido pela autocracia e ainda impotente demais para se rebelar.
>
> Não o consideraram valioso o suficiente para o exército, assim como sua irmã. Mas viram potencial em suas habilidades para servir de controle contra a geração de monstros que surgia das masmorras.
>
> Etiquetas: Roguelike · Card battle · Monster skill catcher · Bag builder

**Cem andares**
- Destaques: **100** Andares · **100** Criaturas · **400** Habilidades · **Diversos** Itens
- Frases numeradas:
  1. A descida é linear: cem andares, cem criaturas.
  2. As criaturas derrotadas derrubam habilidades. São 400 ao todo.
  3. Há um limite de habilidades que Thucker pode usar, então escolher o que levar faz parte da descida.
  4. Pela masmorra surgem itens. Organizados no inventário, eles potencializam habilidades ou concedem novas cartas.

**O Diário do Thucker**
- Abertura: "Aqui ele vai contar sempre um pouco como é sua vida no dia a dia da masmorra e catalogar cada evento enigmático que passou dentro dela..."
- Botões "Página 1" a "Página 5" abrem cada página em um leitor por cima do site.

| Página | Conteúdo |
|---|---|
| **1** | "Olá a você que encontrou esse pequeno diário, se o fez, eu já parti, então lhe desejo que o que consta aqui te proteja! — Thucker" · "No primeiro instante em que adentrei a masmorra, um zumbido sempre pairava o ar e quando andávamos pelo chão a demasia de coisas que grudavam em meus calços incomodava mais que enfrentar os goblins." · "Quanto mais se entrava na masmorra, o ar umedecia, as paredes tendiam a ficar mais pegajosas e o que antes só caía do teto começou a avançar em minha direção." · "Eu o apelidei de gosma. Ainda vou rever isso mais para frente." · "Porém a luta com ele foi simples, precisava apenas retirar dentro dele o que o fazia andar! Dessa vez foi uma... bota?" |
| **2: Gosma, Devorador de Cadáveres** | Três pinturas das gosmas em pixel art, em resolução dobrada, sem contorno e com o vão da gosma grande vazado. Versos: "Em algum outro momento eu duvidaria. / Duvidaria de mim / Das minhas pernas / Dos meus olhos / Duvidaria que a morte há de continuar algo após." · "Mas lá estava / Um coração / Um olho que me seguia / E algo dizia simplesmente / “Me mate!”" |
| **3** (primeira habilidade e sua splash art) | "Então quando o derrotei, arrancando-lhe o coração, seu poder corrosivo subiu por entre as minhas veias e se uniu a mim." · pintura do coração (cores originais, branco recortado) · "Longe do esperado. Dessa vez não foi o meu fim. Ainda sinto que falta muito para convencê-las, mas aqui findo meu primeiro andar." · "“Não houve prazer algum em seguir em frente.”" |
| **4** | "Dia 2 – Voltei para Ghurd, mas não dá para chamar de lar, no máximo um dormitório decrépito e mal cuidado. Contudo o céu de fora da masmorra consegue ser ainda mais sufocante." · paisagem pintada inteira, sem filtro |
| **5** | "Não só retornei para Ghurd, pela exaustão, mas comigo haviam muitas dúvidas. Com isso borbulhando os pensamentos, queria questionar a Comandante de Guerra, Thalya, que também é a minha irmã." · "Trouxe comigo experiências e espólios. O mais intrigante seguia sendo o cristal, que fora o núcleo de uma Gosma." · "Consigo emanar uma força, energia ou algo do tipo, que me permite corroer certas coisas." · cristal (sem filtro) · "A pedra tinha luz própria, tinha vontade, tinha... uma alma?" · "Ao levar para minha irmã, com sua austeridade..." *(a frase "Assim, o que me ocorreu no processo." foi removida a pedido)* |

**Elementos**
- Abertura: "Quando dois efeitos incompatíveis se encontram no mesmo alvo, eles se consomem em uma reação." e "Toque em uma runa para ver as combinações."
- **10 elementos**, cada um com uma runa clicável em plaquinha de pedra: Fogo, Água, Elétrico, Natureza, Sombra, Luz, Ácido, Vampirismo, Loucura, **Vazio**. "Grama" virou "Natureza", e o décimo se chama só "Vazio" (não "Doom").
- Clicar em uma runa mostra as 9 combinações daquele elemento. As 45 combinações (nomes ainda são **proposta**):
  - **Fogo:** Água = Vapor · Elétrico = Plasma · Natureza = Combustão · Sombra = Brasa Negra · Luz = Pira · Ácido = Fuligem · Vampirismo = Febre · Loucura = Miragem · Vazio = Cinzas
  - **Água:** Elétrico = Condução · Natureza = Pântano · Sombra = Abismo · Luz = Prisma · Ácido = Dissolver · Vampirismo = Maré Rubra · Loucura = Vertigem · Vazio = Estiagem
  - **Elétrico:** Natureza = Sinapse · Sombra = Apagão · Luz = Clarão · Ácido = Galvanismo · Vampirismo = Sifão · Loucura = Curto-Circuito · Vazio = Silêncio
  - **Natureza:** Sombra = Mofo · Luz = Florescer · Ácido = Peçonha · Vampirismo = Parasita · Loucura = Alucinação · Vazio = Ermo
  - **Sombra:** Luz = Aniquilação · Ácido = Piche · Vampirismo = Predador · Loucura = Pesadelo · Vazio = Breu
  - **Luz:** Ácido = Alvejar · Vampirismo = Estigma · Loucura = Epifania · Vazio = Eclipse
  - **Ácido:** Vampirismo = Sangria · Loucura = Amnésia · Vazio = Erosão
  - **Vampirismo:** Loucura = Frenesi · Vazio = Fome
  - **Loucura:** Vazio = Oblívio
- A ideia de cada combinação (uma frase) está em `js/elements.js`.

**Th. Family**
> Neste reino a composição familiar surge da junção da letra do pai, seguido pela segunda letra da mãe.
>
> **T.H.** *(destaque)*
- **Thucker:** "O summoner que não teve o privilégio de vir com um companion de nascença, como acontece com todos os magos do reino."
- **Thalya:** "Comandante de guerra, líder da brigada e a número 1 para fazer os trabalhos mais cruéis." (sprite animado ampliado em 1,35×)

**Bestiário** ("Páginas recuperadas: 7 de 100")
- BatSkull (Sombra), Goblin da Masmorra (Fogo), Slime Ácido (Água), **Zhara, a Sem Volta** (Sombra), Sparkbit (Elétrico), Skulmurai (Sombra), TreeWitch (Natureza).
- Os três últimos não têm sprite e aparecem com "?".
- As descrições ainda são as do documento antigo do Drive.

**Onde jogar:** Steam · Android · "Textos e dublagem em português do Brasil." · "Em desenvolvimento". Rodapé: "Th.End".

## Pendências (desta sessão)
1. **Página 3 do diário:** confirmar a palavra "convencê-las" (é palpite de leitura) e o **nome da primeira habilidade**, se for para destacá-la.
2. **Página 5:** mandar a foto da folha seguinte; o texto termina em "com sua austeridade...".
3. **Elementos:** revisar os nomes e as ideias das 45 combinações, decidir se **Aniquilação** continua sendo Sombra + Luz e aprovar o desenho das runas.
4. **Zhara:** a descrição dela no bestiário ainda é a antiga ("guerreira sombria corrompida pelo confinamento imperial…"); falta o texto novo, sem revelar que ela é a mãe.
5. **Bestiário:** os textos das outras criaturas ainda vêm do documento antigo; Sparkbit, Skulmurai e TreeWitch estão sem arte.
6. **Endereço público definitivo (GitHub Pages, gratuito):**
   - O Git está instalado, mas sem nome e e-mail; o `gh` não está instalado.
   - Faltam: o usuário do GitHub, o nome do repositório (sugestão `th-end`) e o nome e e-mail de autor (pode ser o noreply do GitHub).
   - Decisões em aberto: publicar as fotos do diário inteiras (aparecem a mesa e a mão) ou só recortes, e tirar ou não as duas animações de fala, que o site não usa.
7. **Abertura:** a logo travada (olho piscando, pupila, fiapos) e o clarão não foram conferidos em captura. Também falta avaliar ao vivo o novo ritmo das tochas.
8. **Ideias citadas e não feitas:**
   - uma versão em pixel art da capa do livro, para não destoar da logo;
   - tiles da parede e quadros da tocha desenhados pelo próprio autor;
   - as gosmas da Página 2 sem filtro de cor, para combinar com as páginas 3 a 5 (o usuário disse que a Página 3 "já funciona", então isso ficou em aberto).
