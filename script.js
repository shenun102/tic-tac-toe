// Gameboard Object

const Gameboard = (() => {
  // Create array to emulate 3x3 grid
  const board = ["", "", "", "", "", "", "", "", ""];

  //  Methods for the board

  // get current state of board
  const renderBoard = (cell, marker) => {
    // Display board for debugging purposes
    console.log(board, cell);
    // Select the grid cell that the player clicked on and add the marker
    const gridCell = document.querySelector(
      `.input[data-grid-id="${cell + 1}"]`
    );
    gridCell.style.color = "white";
    gridCell.style.fontWeight = "bold";
    gridCell.style.fontSize = "3rem";
    gridCell.textContent = marker;
  };

  // Get array of boards
  const getBoard = () => {
    return board;
  };

  // update a cell on the board
  const updateBoard = (index, marker) => {
    // If there is already a marker there
    if (board[index] === "") {
      board[index] = marker;
    } else {
      // return true for a marker existing already
      return true;
    }
  };

  // reset the board
  const resetBoard = () => {
    // loop through the board array and set every item to ""
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
    // Resets the display of the grid too
    const resetCells = document.querySelectorAll(".input");
    resetCells.forEach((cell) => {
      cell.textContent = "";
    });
  };
  return { renderBoard, getBoard, updateBoard, resetBoard };
})();

// Player creation object
// Empty array is for storing player's marked cells combination

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
    // Resets the board when game begins
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  };

  // Current player method
  const getCurrentPlayer = () => players[currentPlayerIndex];

  // Play turn method
  const playTurn = (cell) => {
    // Check if the game is over or not
    if (gameOver) return;
    // Get the current player Object
    let currentPlayer = getCurrentPlayer();
    // Update Board
    // true or false
    const cellTaken = Gameboard.updateBoard(cell, currentPlayer.marker);
    // If the cell is indeed already taken, stop the function
    if (cellTaken) return;
    // Add the cell to player's list of cells taken
    currentPlayer.playsIndex.push(cell);
    // Update the board's display with the player's marker in the selected cell
    Gameboard.renderBoard(cell, currentPlayer.marker);
    // Switch players, since current player's turn is over
    currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    currentPlayer = getCurrentPlayer();

    const checkWinner = winner();
    // Check for a winner and set gameOver to true if there is one
    if (checkWinner === "Player 1 Wins") gameOver = true;
    if (checkWinner === "Player 2 Wins") gameOver = true;
    // Checks for tie
    const checkTie = isTie();
    if (checkTie) {
      console.log("It's a tie");
    }
    // Stop the game since the game is over
    if (gameOver) return;

    // Update announcement for player turn
    document.querySelector(
      ".announcement"
    ).textContent = `${currentPlayer.name}'s turn`;
  };

  // Check for a win
  const winner = () => {
    // Convert the array of marked cells into sets for easier comparison
    let pOnePlays = new Set(players[0].playsIndex);
    let pTwoPlays = new Set(players[1].playsIndex);
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
        document.querySelector(".announcement").textContent =
          "Congrats Player 1, You Win!";
        return "Player 1 Wins";
      }
      if (combo.every((item) => pTwoPlays.has(item))) {
        document.querySelector(".announcement").textContent =
          "Congrats Player 2, You Win!";
        return "Player 2 Wins";
      }
    }
  };

  // check for a tie
  const isTie = () => {
    const board = Gameboard.getBoard();
    console.log(board);
    // Check if all cells are filled
    const boardFull = board.every((cell) => cell !== "");
    // If all cells are full 'boardFull = true' then its a tie
    return boardFull;
  };

  // Switch player function

  return { startGame, playTurn, getCurrentPlayer };
})();

// Display Controller Function

const displayController = () => {
  // Start the game
  const startBtn = document.querySelector(".start-game");
  startBtn.addEventListener("click", startGame);
  function startGame() {
    const playerOne = prompt("Player 1 Name:");
    const playerTwo = prompt("Player 2 Name:");
    // Start the game
    GameController.startGame(playerOne, playerTwo);
    // Display player names
    document.querySelector(".player-name-1").textContent = playerOne;
    document.querySelector(".player-name-2").textContent = playerTwo;
    // Change announcement
    document.querySelector(".announcement").textContent = `${playerOne}'s turn`;
    // Get the current player
    GameController.getCurrentPlayer();
  }

  // Play a round
  const gridInput = document.querySelector(".grid-container");
  gridInput.addEventListener("click", displayBoard);
  function displayBoard(e) {
    element = e.target;
    if (!element.classList.contains("input")) return;
    const gridId = element.dataset.gridId;
    GameController.playTurn(gridId - 1);
  }
};

displayController();
