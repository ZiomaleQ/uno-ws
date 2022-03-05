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
            name,
            playerCards: {}
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

    socket.on("nameChange", newName => {
        users[socket.id] = newName
        if (newName === "Guest") delete users[socket.id]
        if (socket.rooms.size > 1) {
            io.in([...socket.rooms].find(elt => elt !== socket.id))
                .except(socket.id)
                .emit("nameChange", { id: socket.id, name: newName })
        }
    })

    socket.on("startGame", async (data = {}) => {
        const roomIndex = rooms.findIndex(elt => elt.users.includes(socket.id))

        if (roomIndex === -1) {
            return socket.emit("UnoError", "Not in room")
        }

        const topCard = randomNumber(120, 1)

        const { users } = rooms[roomIndex]

        rooms[roomIndex].game = {
            top: topCard,
            cards: [...new Array(120)].map((_, i) => i + 1).filter(elt => elt !== topCard),
            turn: users.length > 1 ? users[randomNumber(users.length - 1)] : users[0],
            playerTurn: users.sort(() => Math.random() - 0.5)
        }

        const { owner, id, game } = rooms[roomIndex]

        if (owner !== socket.id) {
            return socket.emit("UnoError", "Not owner")
        }

        let i = 9

        const sockets = io.in(id).fetchSockets()

        io.in(id).emit("gameStart", game)
        io.in(id).emit("topCard", topCard)
        if (!data.skip) {
            await new Promise(resolve, _ => {
                const counter = setInterval(() => {
                    if (i < 0) {
                        clearInterval(counter)
                        resolve()
                    } else {
                        io.in(id).emit("gameCountdown", i--)
                    }
                }, 1000)
            })
        } else {
            io.in(id).emit("gameCountdown", 0)
        }

        for (const localSocket of await sockets) {
            const userDeck = [...new Array(7)].map(_ => drawCard(id))
            localSocket.emit("getCards", userDeck)
            localSocket.emit("turn", game.turn)
            rooms[roomIndex].playerCards[localSocket.id] = userDeck
        }
    })

    socket.on("playCard", card => {
        const roomIndex = rooms.findIndex(elt => elt.users.includes(socket.id))

        if (roomIndex === -1) {
            return socket.emit("UnoError", "Not in room")
        }

        const { game, id, playerCards } = rooms[roomIndex]

        const index = game.playerTurn.findIndex(user => user === socket.id)
        const nextPlayer = game.playerTurn[index + 1] ?? game.playerTurn[0]

        if (game.turn === socket.id) {
            game.turn = nextPlayer
            game.top = card

            const cardIndex = playerCards[socket.id].findIndex(elt => elt === card)

            if (cardIndex === -1) {
                return socket.emit("UnoError", "You dont't have that hard")
            }

            io.in(id).emit("turn", nextPlayer)
            io.in(id).emit("cardPlayed", { who: socket.id, card })
            io.in(id).emit("topCard", card)

            playerCards[socket.id].splice(cardIndex, 1)

            if (playerCards[socket.id].length === 0) {
                io.in(id).emit("endGame", socket.id)
            }

            rooms[roomIndex].game = game
            rooms[roomIndex].playerCards = playerCards
        } else {
            return socket.emit("UnoError", "Not your turn")
        }

    })

    socket.on("drawCard", () => {
        const roomIndex = rooms.findIndex(elt => elt.users.includes(socket.id))

        if (roomIndex === -1) {
            return socket.emit("UnoError", "Not in room")
        }

        const { game, id, playerCards } = rooms[roomIndex]

        if (game.turn === socket.id) {
            const card = drawCard(id)

            playerCards[socket.id].push(card)
            rooms[roomIndex].playerCards = playerCards

            io.in(id).emit("drawCard", { who: socket.id, card })

        } else {
            return socket.emit("UnoError", "Not your turn")
        }
    })

    socket.onAny(console.log)
})

const random = (length = 8) => Math.random().toString(16).substring(2, length);
const randomNumber = (max = 10, min = 0) => Math.floor(Math.random() * (max - min)) + min;

function getRoomUsers(id) {
    const room = rooms.find(elt => elt.id === id)
    if (!room) return []

    const normalUsers = room.users.map(id => { return { id, name: users[id], spectator: false } })
    const spectators = room.spectators.map(id => { return { id, name: users[id], spectator: true } })

    return [normalUsers, spectators].flat(1)
}

function drawCard(id) {
    const room = rooms.find(elt => elt.id === id)
    const roomIndex = rooms.findIndex(elt => elt.id === id)

    if (roomIndex === -1) return -1

    if ((room.game.cards || []).length > 1) {
        const index = randomNumber(room.game.cards.length - 1)
        const value = room.game.cards.splice(index, 1)[0]
        rooms[roomIndex].game.cards = room.game.cards
        return value
    } else {
        room.game.cards = [...new Array(120)].fill((i) => i === room.game.top ? null : i).filter(elt => elt)
        rooms[roomIndex].game.cards = room.game.cards
        return drawCard(id)
    }
}