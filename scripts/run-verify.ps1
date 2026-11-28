$env:MONGODB_URI = "mongodb://127.0.0.1:27018/adzunova_storage?replicaSet=rs0"
Set-Location "d:\Adzunova"
pnpm verify 2>&1
