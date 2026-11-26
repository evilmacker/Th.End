extends Node2D
## Modo idle: uma faixa transparente na borda de baixo da tela, onde o Thucker
## enfrenta Gosmas sozinho. Os cliques atravessam a faixa, exceto no contador
## (clique com o botão direito nele para abrir o menu).

const THUCKER := preload("res://scripts/thucker.gd")
const GOSMA := preload("res://scripts/gosma.gd")
const PROJETIL := preload("res://scripts/projetil.gd")
const FONTE := preload("res://arte/fontes/PixelifySans-SemiBold.ttf")

## Tamanho de cada pixel do jogo na tela (1 = tamanho original dos sprites).
const ESCALA := 1
## Altura da faixa, em pixels do jogo.
const ALTURA := 130
const MARGEM_CHAO := 6
const MAX_GOSMAS := 3
const INTERVALO_SURGIR := Vector2(2.5, 6.0)
## A que distância do Thucker as Gosmas brotam do chão (mínimo, máximo).
const DISTANCIA_SURGIR := Vector2(330.0, 620.0)

const COR_ACIDO := Color("bee242")
const COR_TEXTO_ESCURO := Color(0.08, 0.04, 0.08)

const TIPOS := [
	{"textura": preload("res://arte/gerado/gosma_bota.png"), "vida": 3, "velocidade": 40.0, "essencia": 1, "peso": 45},
	{"textura": preload("res://arte/gerado/gosma_cranio.png"), "vida": 3, "velocidade": 46.0, "essencia": 1, "peso": 45},
	{"textura": preload("res://arte/gerado/gosma_coracao.png"), "vida": 8, "velocidade": 28.0, "essencia": 5, "peso": 10},
]

var mundo: Node2D
var thucker: Node2D
var largura := 1280.0
var chao_y := 0.0

var _espera_surgir := 1.0
var _hud: Label
var _menu: PopupMenu


func _ready() -> void:
	Engine.max_fps = 30
	randomize()
	_configurar_janela()

	mundo = Node2D.new()
	mundo.scale = Vector2(ESCALA, ESCALA)
	add_child(mundo)
	chao_y = ALTURA - MARGEM_CHAO

	thucker = THUCKER.new()
	thucker.position = Vector2(70, chao_y)
	thucker.atirou.connect(_ao_atirar)
	mundo.add_child(thucker)

	_criar_hud()
	_criar_menu()
	Progresso.mudou.connect(_atualizar_hud)

	var fora: int = Progresso.calcular_tempo_fora()
	_atualizar_hud()
	if fora > 0:
		mostrar_texto("Enquanto você estava fora: +%d Gosmas" % fora,
			thucker.position + Vector2(90, -110), Color("f6dca6"), 3.0)

	_iniciar_modo_teste()


func _process(delta: float) -> void:
	var vivas := _gosmas_vivas()
	_espera_surgir -= delta
	if _espera_surgir <= 0.0 and vivas.size() < MAX_GOSMAS:
		if _surgir_gosma(vivas):
			_espera_surgir = randf_range(INTERVALO_SURGIR.x, INTERVALO_SURGIR.y)

	# Fila: cada Gosma para atrás da que está à frente, sem se amontoar.
	# O alvo é sempre a primeira da fila, a mais próxima do Thucker.
	vivas.sort_custom(func(a, b): return a.position.x < b.position.x)
	var limite := thucker.position.x + 46.0
	for g in vivas:
		g.limite_x = limite
		limite = maxf(limite, g.position.x) + g.largura() * 0.8
	thucker.alvo = vivas[0] if not vivas.is_empty() else null


# --- Janela ---------------------------------------------------------------

func _configurar_janela() -> void:
	var janela := get_window()
	var area := DisplayServer.screen_get_usable_rect(DisplayServer.window_get_current_screen())
	if _em_teste():
		area = Rect2i(0, 0, 1280, 720)
	janela.size = Vector2i(area.size.x, ALTURA * ESCALA)
	janela.position = Vector2i(area.position.x, area.end.y - ALTURA * ESCALA)
	largura = float(area.size.x) / ESCALA


## Só a área do contador recebe o mouse; o resto da faixa deixa o clique passar
## para as janelas de baixo.
func _atualizar_passagem_do_mouse() -> void:
	var r := _hud.get_global_rect().grow(4)
	get_window().mouse_passthrough_polygon = PackedVector2Array([
		r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y),
	])


# --- Gosmas e combate -----------------------------------------------------

## A Gosma brota do chão a uma distância do Thucker, num lugar sem outra Gosma.
## Devolve false se não achou lugar livre desta vez.
func _surgir_gosma(vivas: Array) -> bool:
	var x := minf(thucker.position.x + randf_range(DISTANCIA_SURGIR.x, DISTANCIA_SURGIR.y), largura - 60.0)
	for g in vivas:
		if absf(g.position.x - x) < g.largura():
			return false
	var g := GOSMA.new()
	g.configurar(_sortear_tipo(), thucker.position.x + 46)
	g.position = Vector2(x, chao_y)
	g.derrotada.connect(_ao_derrotar)
	g.mordeu.connect(thucker.levar_golpe)
	mundo.add_child(g)
	return true


func _sortear_tipo() -> Dictionary:
	var total := 0
	for t in TIPOS:
		total += t.peso
	var sorteio := randi_range(1, total)
	for t in TIPOS:
		sorteio -= t.peso
		if sorteio <= 0:
			return t
	return TIPOS[0]


func _gosmas_vivas() -> Array:
	return get_tree().get_nodes_in_group("gosmas").filter(func(g): return g.viva)


func _ao_atirar(origem: Vector2, alvo: Node2D) -> void:
	var p := PROJETIL.new()
	p.position = origem
	p.alvo = alvo
	p.cor = COR_ACIDO
	mundo.add_child(p)


func _ao_derrotar(essencia: int, posicao: Vector2) -> void:
	Progresso.registrar(essencia)
	mostrar_texto("+%d Essência" % essencia, posicao + Vector2(0, -44), COR_ACIDO)


# --- Textos ---------------------------------------------------------------

func mostrar_texto(texto: String, posicao: Vector2, cor: Color, duracao := 1.4) -> void:
	var l := _novo_rotulo(12, cor)
	l.text = texto
	mundo.add_child(l)
	l.position = posicao - Vector2(l.get_minimum_size().x / 2.0, 0)
	var t := create_tween()
	t.tween_property(l, "position:y", l.position.y - 22, duracao) \
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	t.parallel().tween_property(l, "modulate:a", 0.0, duracao * 0.6).set_delay(duracao * 0.4)
	t.tween_callback(l.queue_free)


func _novo_rotulo(tamanho: int, cor: Color) -> Label:
	var l := Label.new()
	l.add_theme_font_override("font", FONTE)
	l.add_theme_font_size_override("font_size", tamanho)
	l.add_theme_color_override("font_color", cor)
	l.add_theme_color_override("font_outline_color", COR_TEXTO_ESCURO)
	l.add_theme_constant_override("outline_size", 4)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l


func _criar_hud() -> void:
	var camada := CanvasLayer.new()
	add_child(camada)
	_hud = _novo_rotulo(12 * ESCALA, Color("f6dca6"))
	_hud.position = Vector2(8, 6) * ESCALA
	_hud.mouse_filter = Control.MOUSE_FILTER_STOP
	_hud.tooltip_text = "Botão direito: menu"
	_hud.gui_input.connect(_ao_clicar_hud)
	_hud.resized.connect(_atualizar_passagem_do_mouse)
	camada.add_child(_hud)


func _atualizar_hud() -> void:
	_hud.text = "Gosmas: %d   Essência: %d" % [Progresso.gosmas, Progresso.essencia]
	_hud.reset_size()
	_atualizar_passagem_do_mouse.call_deferred()


# --- Menu (botão direito no contador ou ícone da bandeja) -----------------

func _criar_menu() -> void:
	_menu = PopupMenu.new()
	_menu.add_item("Sair do Th.End", 0)
	_menu.id_pressed.connect(func(id): if id == 0: get_tree().quit())
	add_child(_menu)

	if DisplayServer.has_feature(DisplayServer.FEATURE_STATUS_INDICATOR):
		var bandeja := StatusIndicator.new()
		bandeja.icon = preload("res://arte/gerado/thucker.png")
		bandeja.tooltip = "Th.End"
		bandeja.pressed.connect(func(_botao, posicao): _abrir_menu(posicao))
		add_child(bandeja)


func _ao_clicar_hud(evento: InputEvent) -> void:
	if evento is InputEventMouseButton and evento.pressed and evento.button_index == MOUSE_BUTTON_RIGHT:
		_abrir_menu(DisplayServer.mouse_get_position())


func _abrir_menu(posicao: Vector2i) -> void:
	_menu.position = posicao - Vector2i(0, _menu.get_contents_minimum_size().y as int)
	_menu.popup()


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		Progresso.salvar()


# --- Modo de teste: godot --path jogo -- --teste caminho.png ---------------

func _em_teste() -> bool:
	return "--teste" in OS.get_cmdline_user_args()


func _iniciar_modo_teste() -> void:
	if not _em_teste():
		return
	var args := OS.get_cmdline_user_args()
	var i := args.find("--teste")
	var prefixo := args[i + 1] if i + 1 < args.size() else "user://teste"
	Engine.time_scale = 2.0
	_espera_surgir = 0.0
	for n in 6:
		await get_tree().create_timer(2.5, true, false, true).timeout
		await RenderingServer.frame_post_draw
		get_viewport().get_texture().get_image().save_png("%s_%d.png" % [prefixo, n])
	print("capturas salvas em ", prefixo, "_*.png  gosmas=", Progresso.gosmas)
	get_tree().quit()
