

const API_URL = "https://pokeapi.co/api/v2";

let pokemonNames = [];
let selectedPokemon = [null, null];
let fighters = [null, null];
let hp = [0, 0];
let maxHp = [0, 0];
let battleOver = false;


const searchInputs = [
  document.getElementById("search1"),
  document.getElementById("search2")
];


const suggestionBoxes = [
  document.getElementById("suggestions1"),
  document.getElementById("suggestions2")
];


const selectedBoxes = [
  document.getElementById("selected1"),
  document.getElementById("selected2")
];


const startButton = document.getElementById("startBattle");
const picker = document.getElementById("picker");
const battle = document.getElementById("battle");
const pickerMessage = document.getElementById("pickerMessage");
const battleMessage = document.getElementById("battleMessage");
const playAgainButton = document.getElementById("playAgain");


function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


function debounce(callback, wait) {

  let timer;

  return (...args) => {

    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, wait);

  };

}


async function getPokemonNames() {

  const response = await fetch(
    `${API_URL}/pokemon?limit=1000`
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo cargar la lista de Pokémon."
    );
  }

  const data = await response.json();

  return data.results.map(
    pokemon => pokemon.name
  );
}


async function getPokemon(name) {

  const response = await fetch(
    `${API_URL}/pokemon/${name.toLowerCase()}`
  );

  if (!response.ok) {
    throw new Error(
      `No se encontró el Pokémon ${name}.`
    );
  }

  return response.json();
}


function showSuggestions(index, text) {

  const box = suggestionBoxes[index];

  box.innerHTML = "";

  if (!text.trim()) {
    return;
  }


  const matches = pokemonNames
    .filter(name =>
      name.includes(text.toLowerCase())
    )
    .slice(0, 6);


  matches.forEach(name => {

    const button = document.createElement("button");

    button.className = "suggestion";

    button.textContent = capitalize(name);


    button.addEventListener("click", async () => {

      try {

        box.innerHTML = "";

        searchInputs[index].value = name;

        selectedBoxes[index].textContent =
          "Cargando...";


        const pokemon = await getPokemon(name);


        selectedPokemon[index] = pokemon;


        selectedBoxes[index].textContent =
          `${capitalize(pokemon.name)} seleccionado`;


        checkReady();

      } catch (error) {

        selectedBoxes[index].textContent =
          "No se pudo cargar.";

        console.error(error);

      }

    });


    box.appendChild(button);

  });

}


const debouncedSearch = [

  debounce(
    (event) =>
      showSuggestions(
        0,
        event.target.value
      ),
    350
  ),

  debounce(
    (event) =>
      showSuggestions(
        1,
        event.target.value
      ),
    350
  )

];


searchInputs[0].addEventListener(
  "input",
  debouncedSearch[0]
);


searchInputs[1].addEventListener(
  "input",
  debouncedSearch[1]
);


function checkReady() {

  if (
    selectedPokemon[0] &&
    selectedPokemon[1]
  ) {

    startButton.disabled = false;

    pickerMessage.textContent =
      "Los dos Pokémon están listos.";

  } else {

    startButton.disabled = true;

    pickerMessage.textContent = "";

  }

}


function renderFighter(index) {

  const pokemon = fighters[index];

  const container =
    document.getElementById(
      `fighter${index + 1}`
    );


  container.innerHTML = `

    <img
      src="${pokemon.sprites.front_default || ""}"
      alt="${pokemon.name}"
    >

    <h3>${pokemon.name}</h3>

    <div class="hp-label">

      <span>HP</span>

      <span id="hpText${index}">
        ${hp[index]} / ${maxHp[index]}
      </span>

    </div>

    <div class="hp-bar">

      <div
        id="hpFill${index}"
        class="hp-fill"
      ></div>

    </div>

  `;


  updateHp(index);

}


function updateHp(index) {

  const text =
    document.getElementById(
      `hpText${index}`
    );

  const fill =
    document.getElementById(
      `hpFill${index}`
    );


  if (!text || !fill) {
    return;
  }


  text.textContent =
    `${hp[index]} / ${maxHp[index]}`;


  fill.style.width =
    `${Math.max(
      0,
      (hp[index] / maxHp[index]) * 100
    )}%`;

}


function renderMoves(index) {

  const container =
    document.getElementById(
      `moves${index + 1}`
    );


  container.innerHTML = "";


  const moves =
    fighters[index].moves.slice(0, 4);


  moves.forEach(moveData => {

    const button =
      document.createElement("button");


    button.className =
      "move-button";


    button.textContent =
      moveData.move.name;


    button.addEventListener(
      "click",
      () => attack(index)
    );


    container.appendChild(button);

  });

}


function setMoveButtonsDisabled(disabled) {

  document
    .querySelectorAll(".move-button")
    .forEach(button => {

      button.disabled = disabled;

    });

}


function attack(attackerIndex) {

  if (battleOver) {
    return;
  }


  const defenderIndex =
    attackerIndex === 0 ? 1 : 0;


  const damage =
    Math.floor(Math.random() * 21) + 10;


  hp[defenderIndex] =
    Math.max(
      0,
      hp[defenderIndex] - damage
    );


  updateHp(defenderIndex);


  const attacker =
    capitalize(
      fighters[attackerIndex].name
    );


  const defender =
    capitalize(
      fighters[defenderIndex].name
    );


  battleMessage.textContent =
    `${attacker} hizo ${damage} de daño a ${defender}.`;


  if (hp[defenderIndex] === 0) {

    battleOver = true;

    setMoveButtonsDisabled(true);


    battleMessage.textContent =
      `${attacker} ganó la batalla.`;


    playAgainButton.classList.remove(
      "hidden"
    );

  }

}


async function startBattle() {

  pickerMessage.textContent =
    "Cargando Pokémon...";


  startButton.disabled = true;


  try {

    fighters = [

      await getPokemon(
        selectedPokemon[0].name
      ),

      await getPokemon(
        selectedPokemon[1].name
      )

    ];


    maxHp = [

      fighters[0].stats.find(
        stat => stat.stat.name === "hp"
      ).base_stat,

      fighters[1].stats.find(
        stat => stat.stat.name === "hp"
      ).base_stat

    ];


    hp = [...maxHp];

    battleOver = false;


    renderFighter(0);
    renderFighter(1);

    renderMoves(0);
    renderMoves(1);


    picker.classList.add("hidden");

    battle.classList.remove("hidden");


    playAgainButton.classList.add(
      "hidden"
    );


    battleMessage.textContent =
      "Elige un movimiento para atacar.";


  } catch (error) {

    pickerMessage.textContent =
      "No se pudo iniciar la batalla.";

    console.error(error);

    startButton.disabled = false;

  }

}


function resetBattle() {

  selectedPokemon = [null, null];

  fighters = [null, null];

  hp = [0, 0];

  maxHp = [0, 0];

  battleOver = false;


  searchInputs.forEach(input => {
    input.value = "";
  });


  selectedBoxes.forEach(box => {
    box.textContent = "";
  });


  suggestionBoxes.forEach(box => {
    box.innerHTML = "";
  });


  pickerMessage.textContent = "";

  startButton.disabled = true;


  battle.classList.add("hidden");

  picker.classList.remove("hidden");

}


startButton.addEventListener(
  "click",
  startBattle
);


playAgainButton.addEventListener(
  "click",
  resetBattle
);


async function init() {

  try {

    pickerMessage.textContent =
      "Cargando lista de Pokémon...";


    pokemonNames =
      await getPokemonNames();


    pickerMessage.textContent =
      "Escribe el nombre de un Pokémon para buscarlo.";


  } catch (error) {

    pickerMessage.textContent =
      "No se pudo cargar la lista de Pokémon.";

    console.error(error);

  }

}


init();