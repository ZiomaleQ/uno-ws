<script>
  import { ID, Room, Spectate } from "../utils/stores.js";
  import { createEventDispatcher } from "svelte";

  let room = {};
  Room.subscribe((newRoom) => (room = newRoom));

  const dispatch = createEventDispatcher();

  function leaveRoom() {
    dispatch("evt", "leaveRoom");
  }

  function startGame() {
    dispatch("evt", "startGame");
  }
</script>

<p>You're in '{room.name}' now.</p>
<p>Secret join code: <span>{room.id}</span></p>
<br />

<p>Users ({(room.users || []).length}):</p>

{#each room.users as { id, name, spectator }}
  <p>
    {name ? name : "Guest"}
    {#if id === $ID} (You) {/if}
    {#if spectator || (id === $ID && $Spectate)} (Ghost) {/if}
  </p>
{/each}

<button on:click={leaveRoom}>LEAVE ROOM</button>
<button on:click={startGame}>"START GAME"</button>

<style>
  span {
    background-color: black;
    color: white;
    width: max-content;
    height: max-content;
    padding: 5px 10px;
  }
</style>
