extends Node
## Guarda o progresso do modo idle e calcula o que rendeu enquanto o jogo estava fechado.

signal mudou

const ARQUIVO := "user://progresso.json"
## A cada quantos segundos fora do jogo conta uma Gosma derrotada.
const SEGUNDOS_POR_GOSMA_FORA := 30.0
## Limite do ganho com o jogo fechado: 8 horas.
const MAXIMO_FORA := 8 * 3600

var gosmas := 0
var essencia := 0
var ultima_vez := 0

var _relogio := 0.0


func _ready() -> void:
	carregar()


func _process(delta: float) -> void:
	# Salva de tempos em tempos, para o ganho offline funcionar mesmo se o PC desligar.
	_relogio += delta
	if _relogio >= 60.0:
		_relogio = 0.0
		salvar()


func registrar(valor_essencia: int) -> void:
	gosmas += 1
	essencia += valor_essencia
	salvar()
	mudou.emit()


## Soma ao progresso o que rendeu com o jogo fechado e devolve quantas Gosmas foram.
func calcular_tempo_fora() -> int:
	if ultima_vez <= 0:
		salvar()
		return 0
	var fora := clampi(_agora() - ultima_vez, 0, MAXIMO_FORA)
	var derrotadas := int(fora / SEGUNDOS_POR_GOSMA_FORA)
	gosmas += derrotadas
	essencia += derrotadas
	salvar()
	if derrotadas > 0:
		mudou.emit()
	return derrotadas


func carregar() -> void:
	if not FileAccess.file_exists(ARQUIVO):
		return
	var dados = JSON.parse_string(FileAccess.get_file_as_string(ARQUIVO))
	if typeof(dados) != TYPE_DICTIONARY:
		return
	gosmas = int(dados.get("gosmas", 0))
	essencia = int(dados.get("essencia", 0))
	ultima_vez = int(dados.get("ultima_vez", 0))


func salvar() -> void:
	ultima_vez = _agora()
	var arquivo := FileAccess.open(ARQUIVO, FileAccess.WRITE)
	if arquivo == null:
		return
	arquivo.store_string(JSON.stringify({
		"gosmas": gosmas,
		"essencia": essencia,
		"ultima_vez": ultima_vez,
	}, "\t"))


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST or what == NOTIFICATION_PREDELETE:
		salvar()


func _agora() -> int:
	return int(Time.get_unix_time_from_system())
