const express=require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app=express();

app.use(cors());
app.use(express.static(__dirname));

const server= http.createServer(app);
const io =socketIo(server);

const alerts = [];


io.on("connection",(socket) => {
    console.log("✅ User connected:", socket.id);

    if (alerts.length > 0) {
        socket.emit("existingAlerts", alerts);
    }

socket.on("sendAlert",(data)=> {
    const alert = {
        id: Date.now(),
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date().toISOString(),
        status: "new"
    };

    alerts.push(alert);
    console.log("📥 Alert received:", alert);
    io.emit("newAlert",alert);
    socket.emit("alertConfirmed", { id: alert.id });
    console.log("📤 Alert broadcast to all clients");
});

socket.on("acknowledgeAlert", ({ id }) => {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) {
        return;
    }
    alert.status = "acknowledged";
    io.emit("alertUpdated", alert);
});

socket.on("resolveAlert", ({ id }) => {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) {
        return;
    }
    alert.status = "resolved";
    io.emit("alertUpdated", alert);
});


socket.on("disconnect",()=> {
   console.log("❌ User disconnected:", socket.id);
    });

   
});


    const PORT = process.env.PORT|| 3000;
    server.listen(PORT, () => {
        console.log(`Server running on PORT${PORT}`);
    });

