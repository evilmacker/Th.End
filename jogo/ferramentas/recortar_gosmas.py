"""Recorta as Gosmas da foto da página 2 do diário para usar como sprites.

Regra do projeto: sem contorno e sem filtro de cor. Só enquadra o recorte,
remove o papel em volta (e os vãos de papel grandes dentro da pintura) e
reduz o tamanho. As cores são as da foto.

Uso: python jogo/ferramentas/recortar_gosmas.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
FOTO = RAIZ / "gdd/assets/diario/pagina-2.jpg"
SAIDA = RAIZ / "jogo/arte/gosma"

# Mesmos recortes usados no site (gdd/js/diario.js): [x, y, largura, altura]
GOSMAS = {
    "gosma_verde": dict(recorte=(105, 345, 205, 155), altura=56, vazar=None),
    "gosma_vermelha": dict(recorte=(305, 340, 250, 165), altura=56, vazar=None),
    "gosma_grande": dict(recorte=(112, 495, 365, 400), altura=110, vazar=120),
}
PAPEL = np.array([238, 226, 200], dtype=float)


def vizinhos(i, w, n):
    x = i % w
    if x > 0: yield i - 1
    if x < w - 1: yield i + 1
    if i >= w: yield i - w
    if i + w < n: yield i + w


def recortar(nome, recorte, altura, vazar):
    x, y, w, h = recorte
    foto = np.array(Image.open(FOTO).convert("RGB"), dtype=float)[y:y + h, x:x + w]
    n = w * h
    flat = foto.reshape(-1, 3)
    # tom do papel: metade mais clara da moldura, usado só para reconhecer o papel
    moldura = np.concatenate([np.arange(w), (h - 1) * w + np.arange(w), np.arange(h) * w, np.arange(h) * w + w - 1])
    lum = flat[moldura] @ [0.3, 0.59, 0.11]
    claros = moldura[lum >= np.median(lum)]
    ganho = np.minimum(1.7, PAPEL / np.maximum(1, flat[claros].mean(0)))
    corrigido = np.minimum(255, flat * ganho)
    dist = ((corrigido - PAPEL) ** 2).sum(1)
    e_papel = dist < 58 ** 2
    fundo = np.zeros(n, bool)
    pilha = [i for i in moldura if e_papel[i]]
    for i in pilha: fundo[i] = True
    while pilha:
        i = pilha.pop()
        for j in vizinhos(i, w, n):
            if not fundo[j] and e_papel[j]:
                fundo[j] = True; pilha.append(j)
    if vazar:  # vãos de papel grandes dentro da pintura também ficam transparentes
        justo = dist < 46 ** 2
        visto = np.zeros(n, bool)
        for s in range(n):
            if fundo[s] or visto[s] or not justo[s]: continue
            reg, st = [s], [s]; visto[s] = True
            while st:
                i = st.pop()
                for j in vizinhos(i, w, n):
                    if not fundo[j] and not visto[j] and justo[j]:
                        visto[j] = True; reg.append(j); st.append(j)
            if len(reg) >= vazar: fundo[reg] = True
    # mantém só as massas grandes de tinta (some letra a lápis e respingo)
    rotulo = np.zeros(n, int); tamanhos = [0]
    for s in range(n):
        if fundo[s] or rotulo[s]: continue
        tamanhos.append(0); k = len(tamanhos) - 1; rotulo[s] = k; st = [s]
        while st:
            i = st.pop(); tamanhos[k] += 1
            for j in vizinhos(i, w, n):
                if not fundo[j] and not rotulo[j]:
                    rotulo[j] = k; st.append(j)
    maior = max(tamanhos)
    manter = np.array([not fundo[i] and tamanhos[rotulo[i]] >= maior * 0.25 for i in range(n)])
    rgba = np.zeros((n, 4), np.uint8)
    rgba[:, :3] = flat.astype(np.uint8)  # cores originais da foto, sem filtro
    rgba[:, 3] = np.where(manter, 255, 0)
    img = Image.fromarray(rgba.reshape(h, w, 4), "RGBA")
    img = img.crop(img.getbbox())
    escala = altura / img.height
    img = img.resize((max(1, round(img.width * escala)), altura), Image.LANCZOS)
    # alfa binário, para o sprite não ficar com borda translúcida
    a = np.array(img); a[..., 3] = np.where(a[..., 3] > 127, 255, 0)
    SAIDA.mkdir(parents=True, exist_ok=True)
    Image.fromarray(a).save(SAIDA / f"{nome}.png")
    print(nome, img.size)


if __name__ == "__main__":
    for nome, cfg in GOSMAS.items():
        recortar(nome, **cfg)
