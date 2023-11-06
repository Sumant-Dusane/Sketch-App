import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const ioSocket = new Server(server, {
    cors: {
        origin: '*'
    }
});

ioSocket.on('connection', async (socket) => {
    console.log('new user', socket.id);

    socket.on('bind-canvas', async (data) => {
        socket.broadcast.emit('bind-canvas', data)
    })

    socket.on('clear-canvas', () => {
        socket.broadcast.emit('clear-canvas')
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id);
        console.log('user disconnect', socket.id);
    })
});

server.listen(8080, () => {
    console.log("SERVER is on: 8080 ");
});