const cells = document.querySelectorAll(".cell");
const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");
const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const playerInfo = document.getElementById("player-info");
const rankingList = document.getElementById("ranking-list");

let currentPlayer = "O";
let board = Array(9).fill("");
let player1 = "";
let player2 = "";
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

function initGame() {
  player1 = player1Input.value || "Jogador 1";
  player2 = player2Input.value || "Jogador 2";
  currentPlayer = "O";
  board.fill("");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.backgroundColor = "white";
    cell.addEventListener("click", handleCellClick, { once: true });
  });
  gameStatus.textContent = `${player1} (O) começa!`;
  gameStatus.classList.remove("hidden");
  gameBoard.classList.remove("hidden");
  playerInfo.classList.add("hidden");
  startButton.classList.add("hidden");
  saveGameState(); // Salva o estado inicial
  updateRanking();
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (!board[index]) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.backgroundColor = currentPlayer === "O" ? "green" : "red";

    saveGameState(); // Salva o estado do jogo após cada jogada

    if (checkWinner()) {
      endGame(`${currentPlayer === "O" ? player1 : player2} venceu!`);
    } else if (board.every((cell) => cell !== "")) {
      endGame("Empate!");
    } else {
      switchPlayer();
    }
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === "O" ? "X" : "O";
  gameStatus.textContent = `${currentPlayer === "O" ? player1 : player2} (${currentPlayer}) é a vez!`;
  saveGameState(); // Salva o estado ao alternar de jogador
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Linhas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Colunas
    [0, 4, 8],
    [2, 4, 6], // Diagonais
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === currentPlayer);
  });
}

function endGame(message) {
  gameStatus.textContent = message;
  cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
  updateRankingAfterGame();
  restartButton.classList.remove("hidden");
  localStorage.removeItem("board"); // Limpa o estado salvo do jogo
  localStorage.removeItem("currentPlayer");
  localStorage.removeItem("player1");
  localStorage.removeItem("player2");
}

function updateRankingAfterGame() {
  const winner = currentPlayer === "O" ? player1 : player2;

  if (gameStatus.textContent.includes("Empate")) {
    updatePlayerScore(player1);
    updatePlayerScore(player2);
  } else {
    updatePlayerScore(winner);
  }

  localStorage.setItem("ranking", JSON.stringify(ranking));
  displayRanking();
}

function updatePlayerScore(player) {
  let playerEntry = ranking.find((entry) => entry.name === player);
  if (!playerEntry) {
    playerEntry = { name: player, wins: 0 };
    ranking.push(playerEntry);
  }
  playerEntry.wins++;
}

function displayRanking() {
  rankingList.innerHTML = "";
  ranking.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.wins} vitória(s)`;
    rankingList.appendChild(listItem);
  });
}

function saveGameState() {
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("currentPlayer", currentPlayer);
  localStorage.setItem("player1", player1);
  localStorage.setItem("player2", player2);
}

function loadGameState() {
  const savedBoard = JSON.parse(localStorage.getItem("board"));
  if (savedBoard) {
    board = savedBoard;
    currentPlayer = localStorage.getItem("currentPlayer");
    player1 = localStorage.getItem("player1");
    player2 = localStorage.getItem("player2");
    gameBoard.classList.remove("hidden");
    playerInfo.classList.add("hidden");
    startButton.classList.add("hidden");
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.style.backgroundColor = board[index] === "O" && "green";
      cell.style.backgroundColor = board[index] === "X" && "red";
      if (!board[index]) {
        cell.addEventListener("click", handleCellClick, { once: true });
      }
    });
    gameStatus.textContent = `${currentPlayer === "O" ? player1 : player2} (${currentPlayer}) é a vez!`;
    gameStatus.classList.remove("hidden");
  }
}

function restartGame() {
  restartButton.classList.add("hidden");
  gameBoard.classList.add("hidden");
  playerInfo.classList.remove("hidden");
  startButton.classList.remove("hidden");
}

startButton.addEventListener("click", initGame);
restartButton.addEventListener("click", restartGame);

window.addEventListener("load", () => {
  loadGameState(); // Carrega o estado do jogo se houver
  updateRanking();
});
