<script>
  export let card;
  export let onClick = () => {};

  let color = "";
  let value = "";

  function getColor() {
    switch (Math.floor((card > 60 ? card - 60 : card) / 15)) {
      //Times 4 \/
      //10x (0 - 9) numbers, 1x +2, 1x Block, 1x Reverse, 1x wild, 1x +4
      case 0:
        color = "red";
        break;
      case 1:
        color = "blue";
        break;
      case 2:
        color = "green";
        break;
      case 3:
      case 4:
        color = "yellow";
        break;
    }

    switch ((card > 60 ? card - 60 : card) % 15) {
      case 10:
        value = "+2";
        break;
      case 11:
        value = "block";
        break;
      case 12:
        value = "reverse";
        break;
      default:
        value = card % 15;
    }

    if (card % 15 === 13 || card % 15 === 14) {
      color = "wild";
      value = card % 15 === 13 ? "card" : "draft";
    }
  }

  $: getColor(card);
</script>

<div class="flip-card" on:click={onClick}>
  <div class="flip-card-inner">
    <div class="flip-card-back">
      <div
        class="container {color} container-{value === '+2' ? 'plus2' : value}"
      >
        <div class="oval" />
        {#if value === "reverse"}
          <img src="reverse.png" alt="reverse" />
        {:else if value === "block"}
          <img src="block.png" alt="block" />
        {:else}
          <div class="number">{value}</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .flip-card {
    min-width: 50px;
    width: 50px;
    max-width: 50px;
    min-height: 100px;
    height: 100px;
    max-height: 100px;
    background-color: transparent;
    perspective: 1000px;
    border-radius: 10px;
  }

  .container {
    border-radius: 10px;
    height: 100px;
    width: 50px;
  }

  .back-container {
    border-radius: 10px;
    height: 100px;
    width: 50px;
    border: 20px solid white;
    background-color: #121212;
  }

  .back-oval {
    position: relative;
    left: 20px;
    top: 20px;
    height: 100px;
    width: 50px;
    background: #c42335;
    transform: rotate(30deg);
    border-radius: 50px / 100px;
  }

  .container-0::before {
    content: "0";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-0::after {
    content: "0";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-1::before {
    content: "1";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-1::after {
    content: "1";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-2::before {
    content: "2";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-2::after {
    content: "2";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-3::before {
    content: "3";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-3::after {
    content: "3";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-4::before {
    content: "4";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-4::after {
    content: "4";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-5::before {
    content: "5";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-5::after {
    content: "5";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-6::before {
    content: "6";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-6::after {
    content: "6";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-7::before {
    content: "7";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-7::after {
    content: "7";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-8::before {
    content: "8";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-8::after {
    content: "8";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-9::before {
    content: "9";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-9::after {
    content: "9";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-plus2::before {
    content: "+2";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-plus2::after {
    content: "+2";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-draft::before {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-draft::after {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-card::before {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-card::after {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    left: 30%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-block::before {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-block::after {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-reverse::before {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    left: -40%;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
  }

  .container-reverse::after {
    content: "-";
    position: absolute;
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    top: -55px;
    color: #fefefe;
    text-shadow: 1px 1px #232323;
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

  .wild {
    background-color: black;
    color: black;
  }

  .oval {
    position: relative;
    left: 5px;
    top: -15px;
    height: 90px;
    width: 40px;
    background: #ffffff;
    transform: rotate(15deg);
    border-radius: 40px / 90px;
  }

  .number {
    font-family: helvetica;
    position: relative;
    font-size: 1em;
    text-shadow: 1px 1px #232323;
    top: -75%;
  }

  .text {
    font-family: helvetica;
    position: relative;
    -webkit-text-stroke: 5px #232323;
    transform: rotate(-20deg);
    font-size: 2em;
    font-weight: 800;
    background: -webkit-linear-gradient(#ebce2c, #fff);
    background-clip: content-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    top: -60%;
    left: 5%;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  img {
    width: 30px;
    height: 30px;
    top: -75%;
    position: relative;
    left: 5px;
  }
</style>
