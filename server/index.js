const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, "..")));

let alerts = [];

// Receive alert - new alerts start as 'critical'
app.post("/alert", (req, res) => {
  console.log("📥 /alert POST received with body:", req.body);
  res.status(200).json({ status: "received" });
  const alert = {
    ...req.body,
    status: 'critical',
    time: new Date().toISOString()
  };
  alerts.push(alert);
  console.log("📥 Alert received:", alert);
  res.json({ status: "received" });
});

// Get all alerts
app.get("/alerts", (req, res) => {
  res.json(alerts);
});

// Update alert status
app.put("/alerts/:time", (req, res) => {
  const alertTime = req.params.time;
  const alert = alerts.find(a => a.time === alertTime);
  if (alert) {
    alert.status = req.body.status;
    res.json({ status: "updated", alert });
  } else {
    res.json({ status: "not found" });
  }
});

// Clear alerts
app.post("/clear-alerts", (req, res) => {
  alerts = [];
  res.json({ status: "cleared" });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
  console.log("📌 Guest: http://localhost:3000");
  console.log("📌 Staff: http://localhost:3000/staff.html");
});