extends Node2D
## Uma Gosma que rasteja da direita para a esquerda até o Thucker.
## Todas as animações são feitas em código: rastejar (estica e achata),
## piscar ao levar dano e se desfazer em gotas ao morrer.
## A origem do nó fica na base da Gosma.

signal derrotada(essencia: int, posicao: Vector2)
signal mordeu

const SHADER_CLARAO := preload("res://shaders/clarao.gdshader")
const INTERVALO_MORDIDA := 1.6

var viva := true
## Fica true quando termina de brotar do chão; só então pode ser alvo.
var pronta := false
var vida := 3
var velocidade := 25.0
var essencia := 1
## Posição x onde ela para, encostada no Thucker.
var limite_x := 0.0

var _textura: Texture2D
var _sprite: Sprite2D
var _material: ShaderMaterial
var _fase := 0.0
var _mordida := 0.0
var _limite_do_thucker := 0.0
var _cor := Color(0.6, 0.7, 0.3)


func configurar(tipo: Dictionary, limite: float) -> void:
	_textura = tipo.textura
	vida = tipo.vida
	velocidade = tipo.velocidade
	essencia = tipo.essencia
	limite_x = limite
	_limite_do_thucker = limite


func _ready() -> void:
	add_to_group("gosmas")
	_sprite = Sprite2D.new()
	_sprite.texture = _textura
	_sprite.offset = Vector2(0, -_textura.get_height() / 2.0)
	_material = ShaderMaterial.new()
	_material.shader = SHADER_CLARAO
	_sprite.material = _material
	add_child(_sprite)
	_fase = randf() * TAU
	_cor = _cor_media()
	_brotar()


## Brota do chão: começa achatada e cresce, soltando gotas.
func _brotar() -> void:
	_sprite.scale = Vector2(1.4, 0.0)
	_soltar_gotas(8, 0.5, 40.0)
	var t := create_tween()
	t.tween_property(_sprite, "scale", Vector2(0.9, 1.15), 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	t.tween_property(_sprite, "scale", Vector2.ONE, 0.15)
	t.tween_callback(func(): pronta = true)


func _draw() -> void:
	if not viva:
		return
	draw_set_transform(Vector2.ZERO, 0.0, Vector2(1.0, 0.2))
	draw_circle(Vector2.ZERO, _textura.get_width() * 0.45, Color(0, 0, 0, 0.3))


func _process(delta: float) -> void:
	if not viva or not pronta:
		return
	_fase += delta * 3.0
	var pulso := sin(_fase)
	# Estica quando avança e achata quando junta o corpo, sempre apoiada no chão.
	_sprite.scale = Vector2(1.0 + 0.06 * pulso, 1.0 - 0.06 * pulso)

	if position.x > limite_x:
		position.x = maxf(limite_x, position.x - velocidade * (0.3 + 0.9 * maxf(0.0, pulso)) * delta)
	elif limite_x <= _limite_do_thucker + 1.0:
		# Só a primeira da fila, encostada no Thucker, morde.
		_mordida -= delta
		if _mordida <= 0.0:
			_mordida = INTERVALO_MORDIDA
			_morder()


func largura() -> float:
	return float(_textura.get_width())


func _morder() -> void:
	var t := create_tween()
	t.tween_property(_sprite, "position:x", -8.0, 0.1)
	t.tween_callback(mordeu.emit)
	t.tween_property(_sprite, "position:x", 0.0, 0.2)


func levar_dano(quantidade: int) -> void:
	if not viva:
		return
	vida -= quantidade
	var t := create_tween()
	t.tween_method(func(v: float): _material.set_shader_parameter("clarao", v), 1.0, 0.0, 0.2)
	position.x += 6.0
	if vida <= 0:
		_morrer()


func _morrer() -> void:
	viva = false
	remove_from_group("gosmas")
	queue_redraw()
	derrotada.emit(essencia, position)
	_soltar_gotas(18, 0.4, 110.0)

	# Se desfaz: achata, alarga e some.
	var t := create_tween()
	t.tween_property(_sprite, "scale", Vector2(1.5, 0.15), 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	t.parallel().tween_property(_sprite, "modulate:a", 0.0, 0.35)
	t.tween_interval(0.8)
	t.tween_callback(queue_free)


func _soltar_gotas(quantidade: int, altura_relativa: float, forca: float) -> void:
	var gotas := CPUParticles2D.new()
	gotas.one_shot = true
	gotas.emitting = true
	gotas.amount = quantidade
	gotas.lifetime = 0.9
	gotas.explosiveness = 1.0
	gotas.position = Vector2(0, -_textura.get_height() * altura_relativa)
	gotas.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	gotas.emission_rect_extents = Vector2(_textura.get_width() * 0.3, _textura.get_height() * 0.2)
	gotas.direction = Vector2.UP
	gotas.spread = 75.0
	gotas.initial_velocity_min = forca * 0.45
	gotas.initial_velocity_max = forca
	gotas.gravity = Vector2(0, 300)
	gotas.scale_amount_min = 2.0
	gotas.scale_amount_max = 3.0
	gotas.color = _cor
	add_child(gotas)


func _cor_media() -> Color:
	var imagem := _textura.get_image()
	if imagem == null:
		return _cor
	var soma := Vector3.ZERO
	var n := 0
	for y in range(0, imagem.get_height(), 3):
		for x in range(0, imagem.get_width(), 3):
			var c := imagem.get_pixel(x, y)
			if c.a > 0.5:
				soma += Vector3(c.r, c.g, c.b)
				n += 1
	if n == 0:
		return _cor
	soma /= n
	return Color(soma.x, soma.y, soma.z)
