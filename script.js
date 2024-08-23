// Gameboard Object

const Gameboard = (() => {
  // Create array to emulate 3x3 grid
  const board = ["", "", "", "", "", "", "", "", ""];

  //  Methods for the board

  // get current state of board
  const getBoard = (cell, marker) => {
    console.log(board, cell);
    const gridCell = document.querySelector(
      `.input[data-grid-id="${cell + 1}"]`
    );
    gridCell.style.color = "white";
    gridCell.style.fontWeight = "bold";
    gridCell.style.fontSize = "3rem";
    gridCell.textContent = marker;
    console.log("Hello", gridCell);
  };

  // update a cell on the board
  const updateBoard = (index, marker) => {
    // If there is already a marker there
    if (board[index] === "") {
      board[index] = marker;
    } else {
      console.log("ughhhh");
      return true;
    }
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
  // Create empty array to store the player objects
  let players = [];
  // current player id
  let currentPlayerIndex = 0;
  let gameOver = false;

  // initiate the game / reset game method
  const startGame = (p1, p2) => {
    players = [Player(p1, "X"), Player(p2, "O")];
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  };

  // Current player method
  const getCurrentPlayer = () => players[currentPlayerIndex];

  // Play turn method
  const playTurn = (cell) => {
    const checkWinner = winner();
    // Check for a winner and set gameOver to true if there is one
    if (checkWinner === "Player 1 Wins") gameOver = true;
    if (checkWinner === "Player 2 Wins") gameOver = true;
    // Stop the game since the game is over
    if (gameOver) return;
    console.log(currentPlayerIndex);
    // Get the current player Object
    let currentPlayer = getCurrentPlayer();
    console.log(currentPlayer, "The game!");

    // Update Board
    const cellTaken = Gameboard.updateBoard(cell, currentPlayer.marker);
    // If the cell is indeed already taken, stop the function
    if (cellTaken) return;
    // Add play index to player array
    currentPlayer.playsIndex.push(cell);
    // Get the board
    Gameboard.getBoard(cell, currentPlayer.marker);
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
  };

  // check for a tie

  return { startGame, playTurn, getCurrentPlayer };
})();

const displayController = () => {
  // Start the game
  GameController.startGame("The Chosen One", "The Antagonist");
  // Get the current player
  GameController.getCurrentPlayer();

  // Play a round
  const gridInput = document.querySelector(".grid-container");
  gridInput.addEventListener("click", displayBoard);
  function displayBoard(e) {
    element = e.target;
    if (!element.classList.contains("input")) return;
    const gridId = element.dataset.gridId;
    GameController.playTurn(gridId - 1);
  }

  // Render the display

  // // Play a round
  // GameController.playTurn(0);
  // // Play a round
  // GameController.playTurn(7);
  // // Player 1 wins
  // GameController.playTurn(1);
  // GameController.playTurn(3);
  // GameController.playTurn(2);
  // GameController.playTurn(6);
  // GameController.playTurn();
  // GameController.startGame();
};

displayController();
