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



io.on("connection",(socket) => {
    console.log("✅ User connected:", socket.id);

socket.on("sendAlert",(data)=> {
    console.log("📥 Alert received:", data);
    io.emit("receiveAlert",data);
    console.log("📤 Alert broadcast to all clients");
});


socket.on("disconnect",()=> {
   console.log("❌ User disconnected:", socket.id);
    });

   
});


    const PORT = process.env.PORT|| 3000;
    server.listen(PORT, () => {
        console.log(`Server running on PORT${PORT}`);
    });

