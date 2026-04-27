const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your Netlify frontend to talk to this server

const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace "*" with your Netlify URL
        methods: ["GET", "POST"]
    }
});

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.send('Crisis-Response Backend is Running...');
});

// Handle Socket Connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 1. Listen for SOS alerts from the User side
    socket.on('sendAlert', (data) => {
        console.log('New SOS received:', data);

        // 2. Broadcast the alert to ALL connected clients (Staff Dashboard)
        // We use io.emit so everyone (including the sender) sees the update
        io.emit('sendAlert', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Use the port provided by Render or default to 5000 for local testing
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});