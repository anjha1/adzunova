import express from "express";

const app = express();
app.use(express.json());

app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "ok", service: "fraud-service" });
});

app.get("/health/ready", (_req, res) => {
  // TODO: check required dependencies before reporting ready.
  res.status(200).json({ status: "ready", service: "fraud-service" });
});

app.get("/api/v1", (_req, res) => {
  res.json({ service: "fraud-service", domain: "Fraud", version: "v1" });
});

const port = Number(process.env.PORT ?? 4115);
app.listen(port, "0.0.0.0", () => console.log("fraud-service listening on port " + port));
