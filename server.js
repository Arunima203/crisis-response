const express = require('express');
const http = require('http');
const{Server} =
require('socket.io');
const cors =require('cors');
const app =express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(server,{
    cors : {
        origin: "*",
        methods:["GET","POST"]
    }
});
 
io.on('CONNECTION',(socket) => {
    console.log('A user/staff connected:', socket.id);

})

socket.on('send-emergency', (data) => {
    console.log('EMERGENCY RECIEVED:', data);
   //Add a server-side timestamp for accuracy (Logic)
    const enrichedData ={
        ...data,
        receivedAt: new
        Date().toLocaleTimeString(),
        status: 'Critical'

    };
    io.emit('display-alert',enrichedData);
});

socket.on('disconnect',() => {
      console.log('User disconnected');
});

const PORT =3000;
server.listen(PORT,()  =>{
    console.log(` Backend logic is running on https://crisis-response.onrender.com`);
});