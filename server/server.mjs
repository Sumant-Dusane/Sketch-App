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

ioSocket.on('connection', (socket) => {
    socket.on('new-msg', (message) => {
        console.log(message);
        socket.emit('new-msg', message);
    })
});

server.listen(8080, () => {
    console.log("SERVER is on: 8080 ");
});