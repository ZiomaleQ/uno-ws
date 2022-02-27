import express from 'express';
import { createServer } from 'http';
import path from "path"
import { Server } from "socket.io";

import { API } from "./backend/index.js"

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.static('frontend/public'));

app.use("/api", API)
app.get("/socket.js", (req, res, next) => {
    res.sendFile(path.resolve(path.dirname('')) + "/node_modules/socket.io/client-dist/socket.io.js")
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

const rooms = []
const users = {}

io.on("connection", (socket) => {
    socket.on("createRoom", name => {

        const room = {
            id: random(16),
            users: [socket],
            name
        }

        rooms.push(room)

        socket.emit("joinRoom", { id: room.id, name })
    })
    socket.on("joinRoom", (id) => {
        const index = rooms.findIndex(elt => elt.id === id)
        if (index === -1) {
            socket.emit("UnoError", "Invalid ID")
        }
    })

    socket.on("nameChange", newName => {
        users[socket.id] = newName

        console.log("SOMEBODY GOT A NEW NAME ", newName)
    })
})

const random = (length = 8) => Math.random().toString(16).substring(2, length);