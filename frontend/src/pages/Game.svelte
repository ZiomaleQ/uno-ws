<script>
  export let socket = {};
  export let username = "";

  import Card from "./Card.svelte";
  import { GameData, ID, Room } from "../utils/stores.js";

  let cards = [];
  let othersCards = {};
  let topCard = -1;
  let turn = "";

  let countdownNumber = 10;
  let countdown = true;

  socket.on("gameCountdown", (i) => {
    countdownNumber = i;
    if (i === 0) countdown = false;
  });

  socket.on("getCards", (newDeck) => (cards = newDeck));
  socket.on("cardPlayed", (data) => {
    if (data.who !== $ID) {
      if (othersCards[data.who] === undefined) {
        othersCards[data.who] = 7;
      }
      othersCards[data.who]--;
      return;
    }
    const index = cards.findIndex((elt) => elt === data.card);
    if (index === -1) return;

    cards.splice(index, 1);
    cards = cards;
  });
  socket.on("topCard", (card) => (topCard = card));
  socket.on("turn", (currentPlayer) => (turn = currentPlayer));
  socket.on("drawCard", (data) => {
    if (data.who !== $ID) {
      if (othersCards[data.who] === undefined) {
        othersCards[data.who] = 7;
      }
      othersCards[data.who]++;
      return;
    }

    cards.push(data.card);
    cards = cards;
  });

  let pickColor = false;

  socket.on("cardEffect", (data) => {
    if (data.draw !== undefined) {
      if (data.cards !== undefined) {
        cards.push(...data.cards);
        cards = cards;
        return;
      } else {
        if (othersCards[data.who] === undefined) {
          othersCards[data.who] = 7;
        }
        othersCards[data.who] += data.draw;
        return;
      }
    }

    if (data.pickColor === true && data.who === $ID) pickColor = true;
  });

  function drawCard() {
    socket.emit("drawCard");
  }

  function pickRed() {
    socket.emit("pickColor", 1);
    pickColor = false
  }
  function pickBlue() {
    socket.emit("pickColor", 2);
    pickColor = false
  }
  function pickGreen() {
    socket.emit("pickColor", 3);
    pickColor = false
  }
  function pickYellow() {
    socket.emit("pickColor", 4);
    pickColor = false
  }
</script>

{#if countdown}<h1>{countdownNumber}</h1> {/if}
{#if !countdown}
  {#each $GameData.playerTurn as userID}
    {#if userID !== $ID}
      <div class="profile">
        <div class="userIcon">
          <span class="cardCounter">
            {othersCards[userID] === undefined ? 7 : othersCards[userID]}
          </span>
        </div>
        <div class="name {turn === userID ? 'active' : ''}">
          {$Room.users.find((elt) => elt.id == userID).name ?? "Guest"}
        </div>
      </div>
    {/if}
  {/each}

  <div class="topCard">
    <Card card={topCard} onClick={() => {}} />
  </div>

  <div class="pickColor" style="display: {pickColor ? 'flex' : 'none'};">
    <div class="color red" on:click={pickRed} />
    <div class="color blue" on:click={pickBlue} />
    <div class="color green" on:click={pickGreen} />
    <div class="color yellow" on:click={pickYellow} />
  </div>

  <div class="user">
    <div class="profile">
      <div class="userIcon">
        <span class="cardCounter">
          {cards.length}
        </span>
      </div>
      <div class="name {turn === $ID ? 'active' : ''}">{username}</div>
    </div>
    <div class="cards">
      {#each cards as card}
        <Card
          {card}
          onClick={() => {
            socket.emit("playCard", card);
          }}
        />
      {/each}
    </div>
  </div>

  <div class="utilityButtons">
    <button on:click={drawCard}>Draw card</button>
  </div>
{/if}

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .name {
    font-size: 1em;
    font-weight: 400;
  }

  .userIcon {
    width: 50px;
    height: 50px;
    border: black 1px solid;
  }

  .profile {
    width: 55px;
    height: max-content;
    display: flex;
    flex-direction: column;
  }

  .cardCounter {
    position: relative;
    border-left: 1px black solid;
    border-bottom: 1px black solid;
    padding: 2px;
    left: calc(50% - 7px);
    top: 0px;
  }

  .cards {
    width: 350px;
    height: 100px;
    display: flex;
  }

  .user {
    position: absolute;
    left: calc(50% - 200px);
    bottom: 100px;
    width: 455px;
    display: flex;
  }

  .topCard {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .active {
    text-decoration: underline;
  }

  .utilityButtons {
    position: absolute;
    left: calc(50% - 200px);
    bottom: 50px;
    width: 455px;
    display: flex;
  }

  .utilityButtons > button {
    width: 100px;
    height: 25px;
    padding: 0px;
    -webkit-padding: 0px;
  }

  .pickColor {
    width: 300px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    flex-wrap: wrap;
  }

  .red {
    background-color: #c42335;
    color: #c42335;
  }

  .green {
    background-color: #62a92d;
    color: #62a92d;
  }

  .yellow {
    background-color: #ebce2c;
    color: #ebce2c;
  }

  .blue {
    background-color: #0158a8;
    color: #0158a8;
  }

  .color {
    width: 150px;
    height: 150px;
  }
</style>
