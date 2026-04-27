const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, "..")));

let alerts = [];

// Receive alert
app.post("/alert", (req, res) => {
  const alert = {
    ...req.body,
    time: new Date().toISOString()
  };
  alerts.push(alert);
  console.log("📥 Alert received:", alert);
  res.json({ status: "received" });
});

// Send alerts to dashboard
app.get("/alerts", (req, res) => {
  res.json(alerts);
});

// Clear alerts (for testing)
app.post("/clear-alerts", (req, res) => {
  alerts = [];
  res.json({ status: "cleared" });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
  console.log("📌 Guest: http://localhost:3000");
  console.log("📌 Staff: http://localhost:3000/staff.html");
});