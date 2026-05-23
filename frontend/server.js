// const express = require("express");
// const path = require("path");

// const app = express();

// /**
//  * ✅ Serve static files correctly
//  */
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/login.html"));
// });

// app.listen(3000, () => {
//   console.log("Frontend running on http://localhost:3000");
// });

const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

/**
 * 🌐 Serve static frontend files
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * ❤️ Health check endpoint (for Kubernetes probes)
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * 🔀 Proxy /auth/* → backend
 * Browsers hit the frontend on :8080, so we forward auth calls
 * to the backend service internally. Works both in Minikube
 * port-forward and in-cluster via the backend-service ClusterIP.
 */
const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.BACKEND_PORT || "3001";

app.use("/auth", (req, res) => {
  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: "/auth" + req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${BACKEND_HOST}:${BACKEND_PORT}`
    }
  };

  const proxy = http.request(options, (backendRes) => {
    res.status(backendRes.statusCode);
    Object.entries(backendRes.headers).forEach(([k, v]) => res.setHeader(k, v));
    backendRes.pipe(res);
  });

  proxy.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.status(502).json({ error: "Backend unreachable" });
  });

  req.pipe(proxy);
});

/**
 * 🏠 Default route → login page
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

/**
 * 🚀 PORT from env (Kubernetes sets this to 8080)
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
  console.log(`Proxying /auth → http://${BACKEND_HOST}:${BACKEND_PORT}`);
});