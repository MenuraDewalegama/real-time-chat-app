const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const initWS = require("./ws/socket");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  next();
});

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  path: "/ws"
});

initWS(wss);

connectDB(process.env.MONGO_URL);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// Graceful shutdown for Kubernetes SIGTERM
const shutdown = () => {
  console.log("Shutting down server...");

  wss.clients.forEach(ws => {
    try { ws.close(); } catch (e) {}
  });

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
