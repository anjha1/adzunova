$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$PidFile = Join-Path $RootDir ".local\mongod.pid"

if (-not (Test-Path $PidFile)) {
  Write-Host "[mongo-stop] No PID file found at $PidFile."
  exit 0
}

$pidVal = Get-Content $PidFile -ErrorAction SilentlyContinue
if ($pidVal) {
  $proc = Get-Process -Id $pidVal -ErrorAction SilentlyContinue
  if ($proc) {
    Write-Host "[mongo-stop] Stopping mongod (PID: $pidVal)..."
    Stop-Process -Id $pidVal -Force
    Write-Host "[mongo-stop] mongod stopped."
  } else {
    Write-Host "[mongo-stop] Process $pidVal not running."
  }
}
Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
