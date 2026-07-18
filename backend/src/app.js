require("dotenv").config();

const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume");
const evaluateRoutes = require("./routes/evaluate");

const app = express();
const PORT = process.env.PORT || 8000;

// ── CORS ──────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ── ROUTES ────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "AI Interview Simulator Running" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(resumeRoutes);
app.use(evaluateRoutes);

// ── START ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://127.0.0.1:${PORT}`);
});

module.exports = app;
