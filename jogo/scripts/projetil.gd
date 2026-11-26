extends Node2D
## A magia corrosiva do Thucker: uma bola ácida que persegue a Gosma
## e estoura em respingos ao acertar.

const DANO := 1
const VELOCIDADE := 240.0

var alvo: Node2D
var cor := Color("bee242")

var _restante := 3.0


func _ready() -> void:
	var rastro := CPUParticles2D.new()
	rastro.amount = 16
	rastro.lifetime = 0.35
	rastro.local_coords = false
	rastro.direction = Vector2.LEFT
	rastro.spread = 25.0
	rastro.initial_velocity_min = 10.0
	rastro.initial_velocity_max = 30.0
	rastro.gravity = Vector2.ZERO
	rastro.scale_amount_min = 1.0
	rastro.scale_amount_max = 2.0
	var degrade := Gradient.new()
	degrade.set_color(0, cor)
	degrade.set_color(1, Color(cor, 0.0))
	rastro.color_ramp = degrade
	add_child(rastro)


func _draw() -> void:
	draw_circle(Vector2.ZERO, 5.0, Color(cor, 0.35))
	draw_circle(Vector2.ZERO, 3.0, cor)
	draw_circle(Vector2(-1, -1), 1.0, Color(1, 1, 0.85))


func _process(delta: float) -> void:
	_restante -= delta
	if _restante <= 0.0:
		queue_free()
		return

	var tem_alvo: bool = alvo != null and is_instance_valid(alvo) and alvo.viva
	var destino := position + Vector2.RIGHT * 100.0
	if tem_alvo:
		destino = alvo.position + Vector2(0, -16)
	var falta := destino - position
	if tem_alvo and falta.length() < 10.0:
		alvo.levar_dano(DANO)
		_estourar()
		return
	position += falta.normalized() * VELOCIDADE * delta


func _estourar() -> void:
	var respingos := CPUParticles2D.new()
	respingos.one_shot = true
	respingos.emitting = true
	respingos.amount = 10
	respingos.lifetime = 0.45
	respingos.explosiveness = 1.0
	respingos.spread = 180.0
	respingos.initial_velocity_min = 40.0
	respingos.initial_velocity_max = 90.0
	respingos.gravity = Vector2(0, 220)
	respingos.scale_amount_min = 1.0
	respingos.scale_amount_max = 2.0
	respingos.color = cor
	respingos.position = position
	get_parent().add_child(respingos)
	get_tree().create_timer(0.6).timeout.connect(respingos.queue_free)
	queue_free()
