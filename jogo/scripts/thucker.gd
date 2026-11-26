extends Node2D
## O Thucker, parado na faixa. Ataca a Gosma mais próxima com a magia
## corrosiva que absorveu da primeira Gosma (diário, página 3).
## A origem do nó fica nos pés dele.

signal atirou(origem: Vector2, alvo: Node2D)

const TEXTURA := preload("res://arte/gerado/thucker.png")
const ALCANCE := 520.0
const RECARGA := 1.4
## De onde a magia sai, relativo aos pés (o livro, à frente do peito).
const SAIDA_DA_MAGIA := Vector2(20, -50)

var alvo: Node2D = null

var _sprite: Sprite2D
var _recarga := 0.6
var _tempo := 0.0
var _atacando := false


func _ready() -> void:
	_sprite = Sprite2D.new()
	_sprite.texture = TEXTURA
	_sprite.offset = Vector2(0, -TEXTURA.get_height() / 2.0)
	add_child(_sprite)


func _draw() -> void:
	# Sombra no chão, para ele não parecer flutuar sobre a área de trabalho.
	draw_set_transform(Vector2.ZERO, 0.0, Vector2(1.0, 0.22))
	draw_circle(Vector2.ZERO, 26.0, Color(0, 0, 0, 0.35))


func _process(delta: float) -> void:
	_tempo += delta
	if not _atacando:
		# Respiração: sobe e desce 1 pixel, sem distorcer a pixel art.
		_sprite.position.y = -1.0 if fmod(_tempo, 1.6) < 0.8 else 0.0

	_recarga -= delta
	if _recarga <= 0.0 and _alvo_ao_alcance():
		_atacar()


func _alvo_ao_alcance() -> bool:
	return alvo != null and is_instance_valid(alvo) and alvo.viva and alvo.pronta \
		and alvo.position.x - position.x <= ALCANCE


func _atacar() -> void:
	_recarga = RECARGA
	_atacando = true
	var t := create_tween()
	t.tween_property(_sprite, "position", Vector2(5, -2), 0.08)
	t.tween_callback(func():
		if _alvo_ao_alcance():
			atirou.emit(position + SAIDA_DA_MAGIA, alvo))
	t.tween_property(_sprite, "position", Vector2.ZERO, 0.25)
	t.tween_callback(func(): _atacando = false)


## Uma Gosma encostou nele: pisca em vermelho e recua um pouco.
func levar_golpe() -> void:
	var t := create_tween()
	t.tween_property(_sprite, "modulate", Color(1, 0.45, 0.45), 0.06)
	t.parallel().tween_property(_sprite, "position:x", -4.0, 0.06)
	t.tween_property(_sprite, "modulate", Color.WHITE, 0.25)
	t.parallel().tween_property(_sprite, "position:x", 0.0, 0.25)
