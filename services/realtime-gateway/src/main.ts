import express from "express";

const app = express();
app.use(express.json());

app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "ok", service: "realtime-gateway" });
});

app.get("/health/ready", (_req, res) => {
  // TODO: check required dependencies before reporting ready.
  res.status(200).json({ status: "ready", service: "realtime-gateway" });
});

app.get("/api/v1", (_req, res) => {
  res.json({ service: "realtime-gateway", domain: "Realtime", version: "v1" });
});

const port = Number(process.env.PORT ?? 4117);
app.listen(port, "0.0.0.0", () => console.log("realtime-gateway listening on port " + port));
