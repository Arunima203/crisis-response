const express=require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app =express();

app.use(cors());
app.use(express.static("public"));

const server= http.createServer(app);
const io =socketIo(server);



io.on("connection",(socket) => {
    console.log("user connected");

socket.on("sendAlert",(data)=> {
    console.log("Alert:",data);
    io.emit("receiveAlert",data);
});


socket.on("disconnect",()=> {
   console.log("user disconnected");
    });

   
});


    const PORT = process.env.PORT|| 3000;
    server.listen(PORT, () => {
        console.log(`Server running on PORT${PORT}`);
    });

