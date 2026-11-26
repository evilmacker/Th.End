# Instala o Godot 4.4.1 (versao padrao, 64 bits) no Windows e abre o projeto Th.End.
# Nao precisa de administrador: instala na pasta do usuario.
# Uso: de dois cliques em instalar_godot.bat (na mesma pasta).

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # deixa o download bem mais rapido

$versao  = '4.4.1-stable'
$destino = Join-Path $env:LOCALAPPDATA 'Programs\Godot'
$exe     = Join-Path $destino "Godot_v${versao}_win64.exe"
$url     = "https://github.com/godotengine/godot/releases/download/$versao/Godot_v${versao}_win64.exe.zip"
$zip     = Join-Path $env:TEMP "Godot_v${versao}_win64.exe.zip"

if (Test-Path $exe) {
    Write-Host "O Godot $versao ja esta instalado em $destino"
} else {
    Write-Host "Baixando o Godot $versao (cerca de 60 MB)..."
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
    Write-Host "Extraindo em $destino ..."
    New-Item -ItemType Directory -Force -Path $destino | Out-Null
    Expand-Archive -Path $zip -DestinationPath $destino -Force
    Remove-Item $zip
}

# Atalho na area de trabalho
$atalho = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Godot.lnk'
$shell  = New-Object -ComObject WScript.Shell
$link   = $shell.CreateShortcut($atalho)
$link.TargetPath = $exe
$link.WorkingDirectory = $destino
$link.Save()
Write-Host "Atalho criado na area de trabalho: Godot"

# Abre o projeto Th.End direto no editor, se o instalador estiver dentro do repositório
$projeto = Join-Path $PSScriptRoot '..\project.godot'
if (Test-Path $projeto) {
    $projeto = (Resolve-Path $projeto).Path
    Write-Host "Abrindo o projeto $projeto ..."
    Start-Process -FilePath $exe -ArgumentList @('--editor', "`"$projeto`"")
    Write-Host "Pronto. No editor, aperte F5 para rodar o modo idle."
} else {
    Write-Host "Projeto Th.End nao encontrado ao lado do instalador. Abrindo o Godot..."
    Start-Process -FilePath $exe
    Write-Host "No Godot, clique em Importar e escolha jogo\project.godot do repositorio Th.End."
}
