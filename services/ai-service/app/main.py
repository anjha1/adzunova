from fastapi import FastAPI

app = FastAPI(title="Adzunova Intelligence Service", version="1.0.0", description="Advisory AI inference, matching, scoring and natural-language parsing")

@app.get("/health/live")
async def liveness() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}

@app.get("/health/ready")
async def readiness() -> dict[str, str]:
    # TODO: check required dependencies before reporting ready.
    return {"status": "ready", "service": "ai-service"}

@app.get("/api/v1")
async def service_info() -> dict[str, str]:
    return {"service": "ai-service", "domain": "Intelligence", "version": "v1"}
