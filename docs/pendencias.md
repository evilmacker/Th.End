# Pendências de design

Decisões em aberto no GDD. Marque a resposta embaixo de cada item quando decidir.

## Decisões em aberto

1. **Morte e recomeço.** O roguelike pede que a run recomece, mas uma descida linear de 100 andares não combina com recomeçar sempre do andar 1. Haverá pontos de retorno (por exemplo, a cada 10 andares)? O que fica entre uma run e outra: bestiário, diário, cristais?
   - Resposta: _a definir_

2. **Habilidade × carta.** As criaturas derrubam "habilidades" e os itens "concedem novas cartas". Qual é a relação entre habilidade, carta e deck?
   - Resposta: _a definir_

3. **Estrutura do andar.** Um andar é uma luta só, ou tem vários eventos e termina na criatura daquele andar?
   - Resposta: _a definir_

4. **400 habilidades.** São 4 por criatura? O drop é fixo ou aleatório?
   - Resposta: _a definir_

5. **Bag builder.** A bolsa é uma grade espacial, em que o formato e a posição dos itens importam?
   - Resposta: _a definir_

6. **Elementos.** O texto fala em efeitos "incompatíveis", mas todos os 45 pares têm combinação. Toda dupla reage? Dois efeitos do mesmo elemento acumulam?
   - Resposta: _a definir_

## Proposta: modo companheiro (notebook)

Inspirado na ideia de um RPG que roda como papel de parede. No notebook, ele vira uma faixa transparente na borda da tela, sempre visível e sem bloquear os cliques.

- **Quando acontece:** no intervalo entre descidas. Thucker está no dormitório em Ghurd (diário, página 4).
- **O que se vê:** Thucker escrevendo o diário e estudando os cristais dos monstros. Ao lado dele aparecem as essências das criaturas que ele venceu: o companion que o reino negou a ele. A tela vai ficando mais povoada conforme o progresso.
- **O que rende com o tempo real:** estudo dos cristais (melhora habilidades), organização da bolsa, páginas novas do diário. O ganho é calculado pelo tempo que passou desde a última vez, com um limite máximo de ganho offline.
- **Tom:** as descidas são sombrias; o modo companheiro é a parte cozy.

## Tecnologia (proposta, a confirmar)

- **Engine:** Godot 4. Faz a janela transparente, sem borda, sempre por cima e com cliques passando através. Exporta para Windows, Linux, Mac e Android.
- **Ordem de desenvolvimento:**
  1. Batalha de cartas e uma descida curta, jogável no notebook.
  2. Modo companheiro.
  3. Ciclo completo: progresso entre runs e o primeiro trecho da história.
  4. Android.
