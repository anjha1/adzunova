$ErrorActionPreference = "Stop"

$Port = if ($env:LOCAL_MONGO_PORT) { $env:LOCAL_MONGO_PORT } else { "27018" }
$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$DataDir = Join-Path $RootDir ".local\mongo-data"
$LogDir = Join-Path $RootDir ".local\mongo-logs"
$PidFile = Join-Path $RootDir ".local\mongod.pid"

New-Item -ItemType Directory -Force -Path $DataDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# Locate mongod.exe on PATH or default install folder
$Mongod = (Get-Command mongod -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source)
if (-not $Mongod) {
  $found = Get-ChildItem -Path "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
  if ($found) { $Mongod = $found.FullName }
}

if (-not $Mongod) {
  Write-Host "ERROR: mongod.exe not found on PATH or in C:\Program Files\MongoDB\Server\*\bin\" -ForegroundColor Red
  Write-Host "Install via winget: winget install -e --id MongoDB.Server"
  Write-Host "Manual installer: https://www.mongodb.com/try/download/community"
  exit 1
}

if (Test-Path $PidFile) {
  $existingPid = Get-Content $PidFile -ErrorAction SilentlyContinue
  if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
    Write-Host "[mongo-start] mongod already running (PID: $existingPid) on 127.0.0.1:$Port"
    exit 0
  }
}

$LogPath = Join-Path $LogDir "mongod.log"
Write-Host "[mongo-start] Starting mongod ($Mongod) with --replSet rs0 on 127.0.0.1:$Port..."
$proc = Start-Process -FilePath $Mongod -ArgumentList `
  "--replSet", "rs0", `
  "--dbpath", "`"$DataDir`"", `
  "--bind_ip", "127.0.0.1", `
  "--port", $Port, `
  "--logpath", "`"$LogPath`"", `
  "--logappend" `
  -PassThru -WindowStyle Hidden

Set-Content -Path $PidFile -Value $proc.Id

Start-Sleep -Seconds 2
if ($proc.HasExited) {
  Write-Host "[mongo-start] ERROR: mongod exited immediately. Check $LogPath" -ForegroundColor Red
  exit 1
}

Write-Host "[mongo-start] mongod started (PID: $($proc.Id)) bound to 127.0.0.1:$Port"
