param(
  [int]$Port = 9000,
  [int]$ConsolePort = 9001
)

$ErrorActionPreference = "Stop"

$minioCmd = Get-Command minio -ErrorAction SilentlyContinue
if (-not $minioCmd) {
  Write-Host "minio.exe not found on PATH."
  Write-Host "Install manually or via winget (optional): winget install MinIO.MinIO"
  Write-Host "Without MinIO or R2_DEV_* credentials, scripts/dev/storage-check.mjs will cleanly report SKIPPED."
  exit 0
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$dataDir = Join-Path $repoRoot ".local\minio-data"
if (-not (Test-Path $dataDir)) {
  New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$env:MINIO_ROOT_USER = if ($env:MINIO_ACCESS_KEY) { $env:MINIO_ACCESS_KEY } else { "adzunova_dev_minio" }
$env:MINIO_ROOT_PASSWORD = if ($env:MINIO_SECRET_KEY) { $env:MINIO_SECRET_KEY } else { "adzunova_dev_minio_secret_123" }

Write-Host "Starting local MinIO on 127.0.0.1:$Port (Console :$ConsolePort)..."
Start-Process -FilePath $minioCmd.Source -ArgumentList @("server", $dataDir, "--address", "127.0.0.1:$Port", "--console-address", "127.0.0.1:$ConsolePort") -WindowStyle Hidden
Write-Host "MinIO started."
