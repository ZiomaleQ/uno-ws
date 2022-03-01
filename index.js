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
    socket.emit("userInfo", { id: socket.id })
    socket.on("createRoom", name => {

        const room = {
            id: random(16),
            users: [socket.id],
            owner: socket.id,
            spectators: [],
            name
        }

        rooms.push(room)
        io.in(socket.id).socketsJoin(room.id)
        socket.emit("joinRoom", { id: room.id, name, owner: room.owner, users: getRoomUsers(room.id) })
    })

    socket.on("joinRoom", ({ id, spectate }) => {
        const index = rooms.findIndex(elt => elt.id === id)
        if (index === -1) {
            return socket.emit("UnoError", "Invalid ID")
        }

        const alreadyInRoom = rooms.some(elt => elt.users.includes(socket.id) || elt.spectators.includes(socket.id))

        if (alreadyInRoom) {
            return socket.emit("UnoError", "Already in room")
        }

        (spectate ? rooms[index].spectators : rooms[index].users).push(socket.id)
        const { name, owner } = rooms[index]
        io.in(socket.id).socketsJoin(id)
        socket.emit("joinRoom", { id, name, owner, users: [] })
        io.in(id).emit("usersUpdate", getRoomUsers(id))
    })

    socket.on("leaveRoom", () => {
        const roomIndex = rooms.findIndex(elt => elt.users.includes(socket.id))

        if (roomIndex === -1) {
            return socket.emit("UnoError", "Not in room")
        }
        rooms[roomIndex].users.splice(rooms[roomIndex].users.findIndex(elt => elt === socket.id), 1)
        io.in(socket.id).socketsLeave(rooms[roomIndex].id)
        io.in(rooms[roomIndex].id).emit("usersUpdate", getRoomUsers(rooms[roomIndex].id))
        socket.emit("leaveRoom")
    })

    socket.on("spectateRoom", id => {
        rooms[index].spectators.push(socket.id)
        const { name, owner } = rooms[index]
        io.in(id).emit("usersUpdate", getRoomUsers(id))
        io.in(socket.id).socketsJoin(id)
        socket.emit("joinRoom", { id, name, owner, users: getRoomUsers(id) })
    })

    socket.on("nameChange", newName => {
        users[socket.id] = newName
        if (newName === "Guest") delete users[socket.id]
        if (socket.rooms.size > 1) {
            io.in([...socket.rooms].find(elt => elt !== socket.id))
                .except(socket.id)
                .emit("nameChange", { id: socket.id, name: newName })
        }
    })

    socket.on("startGame", () => { })

    socket.onAny(console.log)
})

const random = (length = 8) => Math.random().toString(16).substring(2, length);
function getRoomUsers(id) {
    const room = rooms.find(elt => elt.id === id)
    if (!room) return []

    const normalUsers = room.users.map(id => { return { id, name: users[id], spectator: false } })
    const spectators = room.spectators.map(id => { return { id, name: users[id], spectator: true } })

    return [normalUsers, spectators].flat(1)
}