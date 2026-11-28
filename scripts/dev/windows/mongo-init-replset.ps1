$ErrorActionPreference = "Stop"

$Port = if ($env:LOCAL_MONGO_PORT) { $env:LOCAL_MONGO_PORT } else { "27018" }

$Mongosh = (Get-Command mongosh -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source)
if (-not $Mongosh) {
  $candidates = @(
    "C:\Users\$env:USERNAME\AppData\Local\Programs\mongosh\mongosh.exe",
    "C:\Program Files\mongosh\mongosh.exe"
  )
  foreach ($c in $candidates) {
    if (Test-Path $c) { $Mongosh = $c; break }
  }
}

if (-not $Mongosh) {
  Write-Host "ERROR: mongosh.exe not found. Install via: winget install -e --id MongoDB.Shell" -ForegroundColor Red
  exit 1
}

$Uri = "mongodb://127.0.0.1:$Port/admin?directConnection=true"
Write-Host "[mongo-init] Checking replica set status on 127.0.0.1:$Port..."

$initJs = @"
try {
  const st = rs.status();
  if (st.ok === 1) {
    print('ALREADY_INITIALIZED');
  }
} catch (e) {
  const res = rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:$Port' }] });
  printjson(res);
}
for (let i = 0; i < 30; i++) {
  const hello = db.hello();
  if (hello.isWritablePrimary) {
    print('PRIMARY_READY');
    quit(0);
  }
  sleep(500);
}
print('TIMEOUT_WAITING_FOR_PRIMARY');
quit(1);
"@

& $Mongosh $Uri --quiet --eval $initJs
if ($LASTEXITCODE -ne 0) {
  Write-Host "[mongo-init] Failed to initialize replica set." -ForegroundColor Red
  exit 1
}
Write-Host "[mongo-init] Single-node replica set rs0 is PRIMARY and ready for transactions."
