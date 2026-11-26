# Graph Report - Th.End  (2026-11-26)

## Corpus Check
- 12 files · ~21,924 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 292 nodes · 456 edges · 22 communities (21 shown, 1 thin omitted)
- Extraction: 87% EXTRACTED · 11% INFERRED · 2% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.84)
- Token cost: 1,068,827 input · 0 output

## Graph Freshness
- Built from commit: `d12560fa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Combinações de elementos
- Regras e visão geral do jogo
- Site, lore e segredo da família
- Abertura animada (intro.js)
- Diário: páginas e Gosma
- Diário pág. 2: Gosma
- Diário pág. 3: poder corrosivo
- Sprite do Thucker
- Cenário e tochas (scene.js)
- Diário pág. 5: cristal e Thalya
- Sprite do Goblin
- Diário pág. 4: volta a Ghurd
- Sprite do Slime Ácido
- Sprite da Zhara
- Logo do Th.End
- Sprite do BatSkull
- Sprite da Thalya
- Leitor do diário (diario.js)
- Capa do livro vermelho
- Folhas rasgadas (pages.js)
- Runas (elements.js)
- Regras do graphify

## God Nodes (most connected - your core abstractions)
1. `COMBINACOES` - 46 edges
2. `GDD visual (gdd/index.html)` - 13 edges
3. `Elemento Ácido` - 12 edges
4. `ELEMENTOS` - 11 edges
5. `Elemento Luz` - 11 edges
6. `Elemento Sombra` - 11 edges
7. `Elemento Água` - 10 edges
8. `Elemento Elétrico` - 10 edges
9. `Elemento Fogo` - 10 edges
10. `Elemento Loucura` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Resumo da sessão: site de apresentação` --conceptually_related_to--> `Regras de trabalho do Claude (Th.End)`  [INFERRED]
  docs/conversas/01-site-de-apresentacao.md → CLAUDE.md
- `Folha 'O Diário do Thucker' (#diario-indice)` --shares_data_with--> `gdd/js/diario.js (lista DIARIO)`  [INFERRED]
  gdd/index.html → README.md
- `Página publicada (artifact)` --references--> `GDD visual (gdd/index.html)`  [INFERRED]
  docs/conversas/01-site-de-apresentacao.md → gdd/index.html
- `Leitor de páginas (#leitor)` --shares_data_with--> `gdd/js/diario.js (lista DIARIO)`  [INFERRED]
  gdd/index.html → README.md
- `Folha 'Cem andares'` --conceptually_related_to--> `100 andares, 100 criaturas, 400 habilidades`  [INFERRED]
  gdd/index.html → docs/conversas/01-site-de-apresentacao.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Mecânicas centrais em aberto** — docs_pendencias_morte_e_recomeco, docs_pendencias_habilidade_x_carta, docs_pendencias_estrutura_do_andar, docs_pendencias_400_habilidades, docs_pendencias_bag_builder, docs_pendencias_elementos_reacoes [EXTRACTED 1.00]
- **Thucker leva o cristal da Gosma para questionar Thalya** — gdd_assets_diario_pagina_5_thucker, gdd_assets_diario_pagina_5_cristal_gosma, gdd_assets_diario_pagina_5_thalya [EXTRACTED 1.00]
- **Logo composition: book, lettering, crest and frame** — gdd_assets_logo_open_book, gdd_assets_logo_th_end_lettering, gdd_assets_logo_glowing_orbs, gdd_assets_logo_horned_frame, gdd_assets_logo_drips [EXTRACTED 1.00]
- **BatSkull anatomy: skull, wings, eye, fangs** — gdd_assets_sprites_batskull_idle_batskull, gdd_assets_sprites_batskull_idle_floating_skull, gdd_assets_sprites_batskull_idle_bat_wings, gdd_assets_sprites_batskull_idle_bloodshot_eye, gdd_assets_sprites_batskull_idle_fangs [EXTRACTED 1.00]
- **Design visual do Slime Ácido (idle)** — gdd_assets_sprites_slime_idle_gelatinous_body, gdd_assets_sprites_slime_idle_inner_skull, gdd_assets_sprites_slime_idle_blue_horn, gdd_assets_sprites_slime_idle_happy_face, gdd_assets_sprites_slime_idle_bubbles [EXTRACTED 1.00]
- **Thalya idle depiction: character, armor, sword** — gdd_assets_sprites_thallya_idle_thalya, gdd_assets_sprites_thallya_idle_armor, gdd_assets_sprites_thallya_idle_sword [EXTRACTED 1.00]
- **Thucker holding red book in idle stance** — gdd_assets_sprites_thucker_idle_thucker, gdd_assets_sprites_thucker_idle_red_book, gdd_assets_sprites_thucker_idle_idle_stance [EXTRACTED 1.00]
- **Arco da Gosma: derrota, núcleo e poder absorvido** — gdd_js_diario_gosma_devorador_de_cadaveres, gdd_js_diario_cristal_nucleo_da_gosma, gdd_js_diario_poder_corrosivo, gdd_js_diario_thucker, gdd_js_diario_primeiro_andar [EXTRACTED 1.00]
- **Scripts que montam o GDD visual** — gdd_index_gdd_page, readme_scene_js, readme_intro_js, readme_pages_js, readme_diario_js, readme_elements_js [EXTRACTED 1.00]
- **Retorno a Ghurd no Dia 2** — gdd_assets_diario_pagina_4_dia_2, gdd_assets_diario_pagina_4_ghurd, gdd_assets_diario_pagina_4_dormitorio_decrepito, gdd_assets_diario_pagina_4_thucker [INFERRED 0.75]
- **Três representações da Gosma na página** — gdd_assets_diario_pagina_2_gosma, gdd_assets_diario_pagina_2_gosma_verde, gdd_assets_diario_pagina_2_gosma_vermelha, gdd_assets_diario_pagina_2_gosma_grande [INFERRED 0.85]
- **Derrota da Gosma e absorção do poder corrosivo** — gdd_assets_diario_pagina_3_thucker, gdd_assets_diario_pagina_3_coracao_da_gosma, gdd_assets_diario_pagina_3_poder_corrosivo, gdd_assets_diario_pagina_3_absorcao_de_poder [INFERRED 0.85]
- **Combinações que impedem cura/recuperação** — gdd_js_elements_combo_febre, gdd_js_elements_combo_estiagem, gdd_js_elements_combo_ermo [INFERRED 0.85]
- **Combinações de dreno de vida/energia (Vampirismo)** — gdd_js_elements_combo_mare_rubra, gdd_js_elements_combo_sifao, gdd_js_elements_combo_parasita, gdd_js_elements_combo_sangria, gdd_js_elements_combo_fome [INFERRED 0.85]
- **Segredo de família Th (Zhara, Thucker, Thalya)** — claude_segredo_de_enredo_zhara, docs_conversas_01_site_de_apresentacao_zhara_a_sem_volta, docs_conversas_01_site_de_apresentacao_regra_nome_familia, docs_conversas_01_site_de_apresentacao_thalya, readme_thucker, gdd_index_th_family [INFERRED 0.85]

## Communities (22 total, 1 thin omitted)

### Community 0 - "Combinações de elementos"
Cohesion: 0.09
Nodes (59): COMBINACOES, Combinação Abismo (Água + Sombra), Combinação Alucinação (Natureza + Loucura), Combinação Alvejar (Luz + Ácido), Combinação Amnésia (Ácido + Loucura), Combinação Aniquilação (Sombra + Luz), Combinação Apagão (Elétrico + Sombra), Combinação Brasa Negra (Fogo + Sombra) (+51 more)

### Community 1 - "Regras e visão geral do jogo"
Cohesion: 0.08
Nodes (28): Regras de trabalho do Claude (Th.End), 45 combinações de elementos (proposta), Cristal (núcleo de uma Gosma), 10 elementos (Fogo, Água, Elétrico, Natureza, Sombra, Luz, Ácido, Vampirismo, Loucura, Vazio), O Diário do Thucker (páginas 1 a 5), 100 andares, 100 criaturas, 400 habilidades, Reino de Ghurd, GitHub Pages (endereço público gratuito) (+20 more)

### Community 2 - "Site, lore e segredo da família"
Cohesion: 0.10
Nodes (25): Abertura animada (livro vermelho vira logo), Bestiário (7 de 100), Cenário (parede, tochas, FLAME_SPEED=0.3), Fontes Jacquard 24 e Pixelify Sans, Página publicada (artifact), Regra do nome de família (letra do pai + 2ª letra da mãe), Zhara, a Sem Volta, Bestiário (7 criaturas) (+17 more)

### Community 3 - "Abertura animada (intro.js)"
Cohesion: 0.24
Nodes (16): corruption(), ditherRect(), drawBook(), drawEye(), drawFliers(), flierPos(), frame(), inkLine() (+8 more)

### Community 4 - "Diário: páginas e Gosma"
Cohesion: 0.25
Nodes (15): "Convencê-las" (entidades não nomeadas), Cristal (núcleo da Gosma), DIARIO, Ghurd (cidade/dormitório decrépito), Goblins, Gosma, Devorador de Cadáveres, Masmorra, Página 1: carta de abertura e entrada na masmorra (+7 more)

### Community 5 - "Diário pág. 2: Gosma"
Cohesion: 0.27
Nodes (11): Cadáveres / morte (tema), Coração (dentro da Gosma), Diário de Thucker, Gosma - Devorador de Cadáveres, Gosma grande com coração e olho (ilustração principal), Gosma verde com ossos (esboço), Gosma vermelha com crânio (esboço), Diário de Thucker - Página 2 (foto) (+3 more)

### Community 6 - "Diário pág. 3: poder corrosivo"
Cohesion: 0.29
Nodes (10): Absorção de poder ao derrotar inimigo (arrancar o coração), Citação: 'Não houve prazer algum em seguir em frente.', Coração da Gosma (núcleo amarelado em vórtice esverdeado), Ilustração: massa gelatinosa roxa com olhos vermelhos (Gosma), Diário de Thucker - Página 3 (foto), Poder corrosivo (primeira habilidade absorvida), Primeiro andar (concluído), Texto: 'Longe do esperado. Dessa vez não foi o meu fim. Ainda sinto que falta muito para conhecê-las, mas aqui findo meu primeiro andar.' (+2 more)

### Community 7 - "Sprite do Thucker"
Cohesion: 0.22
Nodes (10): Auburn/Red-Orange Hair, Red Belt with Pouch, Blue Sleeveless Tunic and Shorts, Grey Socks and Red-Brown Boots, Dark Gloves, White Fur Collar, Idle Combat Stance (wide-legged, book held at chest), Thucker Idle Sprite (GIF) (+2 more)

### Community 8 - "Cenário e tochas (scene.js)"
Cohesion: 0.38
Nodes (9): buildWall(), computeLight(), drawFlame(), drawTorch(), frame(), resize(), rng(), stepFlame() (+1 more)

### Community 9 - "Diário pág. 5: cristal e Thalya"
Cohesion: 0.33
Nodes (9): A pedra tinha luz propria, vontade, uma alma?, Cristal (nucleo de uma Gosma), Ghurd (local de retorno, leitura incerta), Gosma, Ilustracao em aquarela do cristal verde rachado com brilho amarelo, Diario de Thucker - Pagina 5, Poder de corroer (forca/energia emanada), Thalya, Comandante da Guerra e irma de Thucker (+1 more)

### Community 10 - "Sprite do Goblin"
Cohesion: 0.22
Nodes (9): Capuz/manto escuro de penas ou trapos, Duas cimitarras curvas, Goblin da Masmorra, Orelhas longas e pontudas, Paleta quente vermelho/laranja (Fogo), Pele verde-amarelada, Postura agachada de combate, Goblin da Masmorra - Sprite Idle (+1 more)

### Community 11 - "Diário pág. 4: volta a Ghurd"
Cohesion: 0.29
Nodes (8): Céu sufocante fora da masmorra, Dia 2 (entrada do diário), Dormitório decrépito e mal cuidado, Ghurd, Diário de Thucker - Página 4 (Dia 2), Masmorra, Paisagem pintada: céu tempestuoso sobre rochedos, Thucker (autor do diário)

### Community 12 - "Sprite do Slime Ácido"
Cohesion: 0.25
Nodes (8): Chifre azul pontudo no topo, Bolhas flutuando acima do corpo, Elemento Água, Corpo gelatinoso translúcido vermelho-alaranjado, Rosto sorridente de olhos fechados, Caveira/criatura azul dentro do slime, Slime Ácido, Slime Ácido - Sprite Idle (slime-idle.gif)

### Community 13 - "Sprite da Zhara"
Cohesion: 0.25
Nodes (8): Crimson staff with blue crystal, Floating idle pose, Dark gothic dress with high collar and tattered crimson-lined skirt, Pale long gloves and armored boots, Red-orange hair, Zhara Idle Sprite (pixel art), Wide-brimmed hat with crimson ornament, Zhara, a Sem Volta

### Community 14 - "Logo do Th.End"
Cohesion: 0.48
Nodes (7): Dithered Dark Fantasy Style (amber and deep purple palette), Dripping Stalactite / Ooze Edges, Glowing Orbs / Eye-like Crest with Flame Spire, Horned Thorny Wing Frame, Th.End Logo (logo.png), Open Ancient Book Emblem, "Th.End" Gothic Dripping Lettering

### Community 15 - "Sprite do BatSkull"
Cohesion: 0.29
Nodes (7): Purple Membranous Bat Wings, BatSkull, Single Bloodshot Eye in Socket, Long Dripping Fangs, Floating Orange Skull (cracked cranium), Idle Animation (pixel art), BatSkull Idle Sprite (GIF)

### Community 16 - "Sprite da Thalya"
Cohesion: 0.33
Nodes (6): Thalya Visual Design: steel pauldrons, crimson/plum skirt-armor with gold slits, dark boots, Idle Animation (6x6 frame grid, 36 frames), Thalya Idle Spritesheet (thallya-idle.png), Dark Fantasy Pixel Art Style (transparent background), Greatsword Held Over Shoulder, Thalya

### Community 17 - "Leitor do diário (diario.js)"
Cohesion: 0.60
Nodes (4): open(), pixelArt(), retear(), show()

### Community 18 - "Capa do livro vermelho"
Cohesion: 0.67
Nodes (4): Slash/Claw Scratch Emblem, Book Front Cover (book-front.webp), Thucker's Red Book, Thucker (handwritten cover title)

### Community 19 - "Folhas rasgadas (pages.js)"
Cohesion: 0.83
Nodes (3): edge(), paint(), rng()

### Community 20 - "Runas (elements.js)"
Cohesion: 0.10
Nodes (19): runs-on, steps, concurrency, cancel-in-progress, group, jobs, atualizar, name (+11 more)

## Ambiguous Edges - Review These
- `Capuz/manto escuro de penas ou trapos` → `Goblin da Masmorra`  [AMBIGUOUS]
  gdd/assets/sprites/goblin-idle.gif · relation: conceptually_related_to
- `Céu sufocante fora da masmorra` → `Dia 2 (entrada do diário)`  [AMBIGUOUS]
  gdd/assets/diario/pagina-4.jpg · relation: references
- `Dia 2 (entrada do diário)` → `Masmorra`  [AMBIGUOUS]
  gdd/assets/diario/pagina-4.jpg · relation: references
- `Dormitório decrépito e mal cuidado` → `Ghurd`  [AMBIGUOUS]
  gdd/assets/diario/pagina-4.jpg · relation: conceptually_related_to
- `Elemento Água` → `Slime Ácido`  [AMBIGUOUS]
  gdd/assets/sprites/slime-idle.gif · relation: conceptually_related_to
- `Dithered Dark Fantasy Style (amber and deep purple palette)` → `Glowing Orbs / Eye-like Crest with Flame Spire`  [AMBIGUOUS]
  gdd/assets/logo.png · relation: conceptually_related_to
- `Slash/Claw Scratch Emblem` → `Thucker (handwritten cover title)`  [AMBIGUOUS]
  gdd/assets/book-front.webp · relation: conceptually_related_to
- `Cadáveres / morte (tema)` → `Texto: 'Em algum outro momento eu duvidaria. Duvidaria de mim, das minhas pernas, dos meus olhos. Duvidaria que a morte há de continuar algo após' (leitura incerta)`  [AMBIGUOUS]
  gdd/assets/diario/pagina-2.jpg · relation: references
- `Citação: 'Não houve prazer algum em seguir em frente.'` → `Texto: 'Longe do esperado. Dessa vez não foi o meu fim. Ainda sinto que falta muito para conhecê-las, mas aqui findo meu primeiro andar.'`  [AMBIGUOUS]
  gdd/assets/diario/pagina-3.jpg · relation: conceptually_related_to
- `Ghurd (local de retorno, leitura incerta)` → `Thucker (narrador do diario)`  [AMBIGUOUS]
  gdd/assets/diario/pagina-5.jpg · relation: references

## Knowledge Gaps
- **64 isolated node(s):** `10 elementos (Fogo, Água, Elétrico, Natureza, Sombra, Luz, Ácido, Vampirismo, Loucura, Vazio)`, `Reino de Ghurd`, `Thalya, comandante de guerra`, `Estrutura do andar`, `Habilidade × carta × deck` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 80 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Elemento Ácido` connect `Combinações de elementos` to `Diário: páginas e Gosma`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Elemento Ácido` (e.g. with `Cristal (núcleo da Gosma)` and `Poder corrosivo absorvido`) actually correct?**
  _`Elemento Ácido` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `10 elementos (Fogo, Água, Elétrico, Natureza, Sombra, Luz, Ácido, Vampirismo, Loucura, Vazio)`, `Reino de Ghurd`, `Thalya, comandante de guerra` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Combinações de elementos` be split into smaller, more focused modules?**
  _Cohesion score 0.08531073446327683 - nodes in this community are weakly interconnected._
- **Why does `Poder corrosivo absorvido` connect `Diário: páginas e Gosma` to `Combinações de elementos`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Capuz/manto escuro de penas ou trapos` and `Goblin da Masmorra`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Céu sufocante fora da masmorra` and `Dia 2 (entrada do diário)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._