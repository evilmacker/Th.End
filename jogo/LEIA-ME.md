# Th.End — projeto Godot

Por enquanto contém o **modo idle**: uma faixa transparente na borda de baixo da tela,
onde o Thucker enfrenta Gosmas sozinho enquanto você usa o computador.

## Como rodar no Avell

1. Instale o [Godot 4.4 ou mais novo](https://godotengine.org/download) (versão padrão, não a .NET). É gratuito e não precisa instalar: é só extrair e abrir.
2. No Godot, clique em **Importar** e escolha o arquivo `jogo/project.godot` deste repositório.
3. Aperte **F5** para rodar.

A faixa aparece em cima da barra de tarefas. Os cliques passam através dela; só o contador
no canto esquerdo recebe o mouse. **Botão direito no contador → Sair** fecha o jogo
(também há um ícone na bandeja do sistema, perto do relógio).

## Como funciona

| O quê | Onde |
|---|---|
| Janela, fila de Gosmas, contador e menu | `scripts/idle.gd` |
| Thucker: respiração, ataque, reação ao golpe | `scripts/thucker.gd` |
| Gosma: brotar do chão, rastejar, piscar, se desfazer | `scripts/gosma.gd` |
| Magia corrosiva (cor do elemento Ácido) | `scripts/projetil.gd` |
| Progresso salvo e ganho com o jogo fechado | `scripts/progresso.gd` |

- **Progresso:** Gosmas derrotadas e Essência ficam salvas no computador. Com o jogo fechado,
  conta uma Gosma a cada 30 segundos, até o limite de 8 horas.
- **Ajustes rápidos** (no topo de `scripts/idle.gd`): `ESCALA` (tamanho dos pixels na tela),
  `ALTURA` da faixa, `MAX_GOSMAS`, `DISTANCIA_SURGIR` e os tipos de Gosma (vida, velocidade, Essência).
- **Sprites:** `arte/gerado/` (veja o LEIA-ME de lá).

## Teste automático (sem abrir janela)

```bash
godot --path jogo -- --teste /caminho/captura
```

Roda o idle em velocidade 2×, salva 6 capturas (`captura_0.png` a `captura_5.png`) e fecha.
