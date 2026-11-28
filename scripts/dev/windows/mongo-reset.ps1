param(
  [switch]$Confirm
)

$ErrorActionPreference = "Stop"
if (-not $Confirm) {
  Write-Host "[mongo-reset] Refusing to delete .local/mongo-data without -Confirm flag." -ForegroundColor Yellow
  Write-Host "Usage: .\scripts\dev\windows\mongo-reset.ps1 -Confirm"
  exit 1
}

& (Join-Path $PSScriptRoot "mongo-stop.ps1")

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$DataDir = Join-Path $RootDir ".local\mongo-data"
$LogDir = Join-Path $RootDir ".local\mongo-logs"

if (Test-Path $DataDir) {
  Remove-Item -Recurse -Force $DataDir
  Write-Host "[mongo-reset] Deleted $DataDir"
}
if (Test-Path $LogDir) {
  Remove-Item -Recurse -Force $LogDir
  Write-Host "[mongo-reset] Deleted $LogDir"
}
Write-Host "[mongo-reset] Local MongoDB data reset complete."
