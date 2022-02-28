<script>
  const socket = io();
  let userID = "";

  socket.on("userInfo", (user) => {
    userID = user.id;
  });

  let room = {};

  let username = "Guest";
  let roomID = "";
  let spectate = false;

  socket.onAny(console.log);

  socket.on("joinRoom", (newRoom) => {
    room = newRoom;
  });

  socket.on("leaveRoom", () => {
    room = {};
    spectate = false;
  });

  socket.on("usersUpdate", (newUsers) => {
    room.users = newUsers;
  });

  function createRoom() {
    socket.emit("createRoom", username + "'s room");
  }

  function leaveRoom() {
    socket.emit("leaveRoom");
  }

  function joinRoom() {
    socket.emit("joinRoom", roomID);
  }

  function spectateRoom() {
    socket.emit("spectateRoom", roomID);
    spectate = true;
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
    <p>You're in '{room.name}' now.</p>
    <p>Secret join code: <span>{room.id}</span></p>
    <br />

    <p>Users ({(room.users || []).length}):</p>

    {#each room.users as { id, name, spectator }}
      <p>
        {name ? name : "Guest"}
        {#if id === userID} (You) {/if}
        {#if spectator || (id === userID && spectate)} (Ghost) {/if}
      </p>
    {:else}
      {""}
    {/each}

    <button on:click={leaveRoom}>LEAVE ROOM</button>
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

  span {
    background-color: black;
    color: white;
    width: max-content;
    height: max-content;
    padding: 5px 10px;
  }
</style>
