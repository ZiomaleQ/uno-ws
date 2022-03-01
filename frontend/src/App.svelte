<script>
  import { ID, Room, Spectate } from "./utils/stores.js";
  import Lobby from "./pages/Lobby.svelte";
  const socket = io();

  socket.on("userInfo", (info) => ID.update(() => info.id));

  let room = {};

  let username = "Guest";
  let roomID = "";

  socket.onAny(console.log);

  socket.on("joinRoom", (newRoom) => {
    room = newRoom;
    Room.set(room);
  });
  socket.on("usersUpdate", (newUsers) => {
    room.users = newUsers;
    Room.set(room);
  });
  socket.on("leaveRoom", () => {
    room = {};
    Room.set({});
    Spectate.set(false);
  });

  function createRoom() {
    socket.emit("createRoom", username + "'s room");
  }

  function joinRoom() {
    socket.emit("joinRoom", { id: roomID, spectate: false });
  }

  function spectateRoom() {
    socket.emit("joinRoom", { id: roomID, spectate: true });
    Spectate.set(false);
  }

  function handleEvt(eventData) {
    socket.emit(eventData.detail);
  }

  $: socket.emit("nameChange", username);
</script>

<main>
  <h1>Hello {username}!</h1>
  <input type="text" bind:value={username} />

  {#if Object.keys(room).length === 0}
    <button on:click={createRoom}>CREATE ROOM</button>

    <br />

    <input type="text" bind:value={roomID} />
    <button on:click={joinRoom}>JOIN ROOM</button>
    <button on:click={spectateRoom}>SPECTATE ROOM</button>
  {:else}
    <Lobby on:evt={handleEvt} />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
