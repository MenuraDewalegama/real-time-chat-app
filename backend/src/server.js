// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");

// const connectDB = require("./db");
// const authRoutes = require("./routes/auth");
// const initWS = require("./ws/socket");

// const app = express();

// /**
//  * ✅ FIX 1: Proper CORS (important for frontend)
//  */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST"]
// }));

// app.use(express.json());

// /**
//  * ❌ IMPORTANT FIX:
//  * REMOVE any CSP headers like:
//  * "default-src 'none'"
//  *
//  * If you previously added Helmet CSP, DO NOT use strict CSP in dev
//  */

// /**
//  * (Optional safe dev headers instead of CSP)
//  */
// app.use((req, res, next) => {
//   res.removeHeader("Content-Security-Policy"); // 🔥 prevents your error
//   next();
// });

// app.use("/auth", authRoutes);

// const server = http.createServer(app);
// const wss = new WebSocket.Server({
//   server,
//   path: "/ws" // ✅ better practice
// });

// initWS(wss);

// connectDB(process.env.MONGO_URL);

// server.listen(3001, () => {
//   console.log("Backend running on http://localhost:3001");
// });




// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");

// const connectDB = require("./db");
// const authRoutes = require("./routes/auth");
// const initWS = require("./ws/socket");

// const app = express();

// /**
//  * ✅ CORS (Kubernetes-safe)
//  */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST"]
// }));

// app.use(express.json());

// /**
//  * 🧼 Remove CSP if any middleware adds it
//  */
// app.use((req, res, next) => {
//   res.removeHeader("Content-Security-Policy");
//   next();
// });

// app.use("/auth", authRoutes);

// const server = http.createServer(app);

// /**
//  * ⚡ WebSocket server
//  */
// const wss = new WebSocket.Server({
//   server,
//   path: "/ws"
// });

// initWS(wss);

// /**
//  * 🗄️ DB CONNECT (K8s ENV READY)
//  */
// connectDB(process.env.MONGO_URL);

// /**
//  * 🚀 PORT FROM ENV (IMPORTANT FOR K8S)
//  */
// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => {
//   console.log(`Backend running on port ${PORT}`);
// });

// /**
//  * 🧠 GRACEFUL SHUTDOWN (VERY IMPORTANT FOR K8S)
//  */
// const shutdown = () => {
//   console.log("🛑 Shutting down server...");

//   wss.clients.forEach(ws => {
//     try {
//       ws.close();
//     } catch (e) {}
//   });

//   server.close(() => {
//     console.log("HTTP server closed");
//     process.exit(0);
//   });
// };

// process.on("SIGTERM", shutdown);
// process.on("SIGINT", shutdown);




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

// ✅ FIX 4: Health endpoint for Kubernetes liveness/readiness probes
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
