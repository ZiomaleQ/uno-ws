<script>
  const socket = io();

  let room = {};

  let username = "Guest";

  socket.onAny(console.log);

  socket.on("joinRoom", (newRoom) => {
    room = newRoom;
  });

  function createRoom() {
    socket.emit("createRoom", username + "'s room");
  }

  $: socket.emit("nameChange", username);
</script>

<main>
  <h1>Hello {username}!</h1>
  <input type="text" bind:value={username} />

  {#if Object.keys(room).length === 0}
    <button on:click={createRoom}> CREATE ROOM </button>
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
