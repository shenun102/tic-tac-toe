// Gameboard Object

const Gameboard = (() => {
  // Create 3x3 grid
  const board = ["", "", "", "", "", "", "", "", ""];

  //  Methods for the board

  // get current state of board
  const getBoard = () => {
    console.log(board);
  };

  // update a cell on the board
  const updateBoard = (index, marker) => {
    // If there isn't already a marker on that index
    if (!board[index]) board[index] = marker;
  };

  // reset the board
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, updateBoard, resetBoard };
})();

// Player object

const Player = (name, marker) => {
  return { name, marker, playsIndex: [] };
};

// Game Controller

const GameController = (() => {
  let players = [];

  let currentPlayerIndex = 0;
  let gameOver = false;

  // initiate the game / reset game method
  const startGame = (p1, p2) => {
    players = [Player(p1, "X"), Player(p2, "O")];
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
  };

  // Current player method
  const getCurrentPlayer = () => players[currentPlayerIndex];

  // Play turn method
  const playTurn = (cell) => {
    const checkWinner = winner();
    // Check for win and stop if there is a winner
    if (checkWinner === "Player 1 Wins") return;
    if (checkWinner === "Player 2 Wins") return;
    console.log(currentPlayerIndex);
    // Get the current player Object
    let currentPlayer = getCurrentPlayer();
    console.log(currentPlayer, "The game!");

    // Add play index to player array
    currentPlayer.playsIndex.push(cell);
    // Update Board
    Gameboard.updateBoard(cell, currentPlayer.marker);
    // Get the board
    Gameboard.getBoard();
    // Switch players
    currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    console.log("after 1 round, the current player is now", currentPlayerIndex);
    currentPlayer = getCurrentPlayer();
    console.log(currentPlayer, "The game!");
  };

  // Check for a win
  const winner = () => {
    let pOnePlays = new Set(players[0].playsIndex);
    let pTwoPlays = new Set(players[1].playsIndex);
    console.log(pOnePlays, pTwoPlays);
    let winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    // for each combination in the combinations list
    for (let combo of winCombos) {
      if (combo.every((item) => pOnePlays.has(item))) {
        console.log("Player 1 wins");
        return "Player 1 Wins";
      }
      if (combo.every((item) => pTwoPlays.has(item))) {
        console.log("Player 2 wins");
        return "Player 2 Wins";
      }
    }
    // if the first, second and third element of the board matches
  };

  // check for a tie

  return { startGame, playTurn, getCurrentPlayer };
})();

const displayController = () => {
  // Start the game
  // Render the DOM

  const gridInput = document.querySelector(".grid-container");
  gridInput.addEventListener("click", displayBoard);
  function displayBoard(e) {
    element = e.target;
    if (!element.classList.contains("input")) return;
    console.log(element);
  }

  GameController.startGame("The Chosen One", "The Antagonist");
  // Get the current player
  GameController.getCurrentPlayer();
  // Play a round
  GameController.playTurn(0);
  // Play a round
  GameController.playTurn(7);
  // Player 1 wins
  GameController.playTurn(8);
  GameController.playTurn(3);
  GameController.playTurn(2);
  GameController.playTurn(6);
  GameController.startGame();
};

displayController();
