# Th.End: regras para o Claude

Roguelike de cartas em pixel art dark fantasy (Steam e Android, PT-BR). Leia `README.md`, `docs/pendencias.md` e `docs/conversas/` antes de começar.

## Regras de trabalho
- **Pergunte antes de supor** qualquer conteúdo, nome, estilo ou escopo. Escreva em português do Brasil.
- **Segredo de enredo:** Zhara é a mãe de Thucker e Thalya (o "h" de "Th" vem de Z**h**ara). Nunca revele isso em material público (site, textos do jogo, bestiário); só insinue.
- **Material do Google Drive:** use só o aprovado: sprites pixel art (Idle, Attack, Speaking), `Logo.png`, a capa frontal do livro e as fotos do diário. O resto (muito feito por IA) não deve ser usado.
- **Direção visual rejeitada:** `ThEnd_ApresentacaoGrafica.html` do Drive. A lore e as mecânicas dele valem, corrigidas para 100 andares e drops de habilidade.
- **Arte do diário:** sem contorno e sem filtro de cor; só enquadrar e recortar o branco do papel.
- **Ferramentas:** prefira soluções gratuitas.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
