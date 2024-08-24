// Gameboard Object

const Gameboard = (() => {
  // Create array to emulate 3x3 grid
  const board = ["", "", "", "", "", "", "", "", ""];

  //  Methods for the board

  // get current state of board
  const renderBoard = (cell, marker) => {
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
    // Display board for debugging purposes
    console.log(board);
    return board;
  };

  // update a cell on the board
  const updateBoard = (index, marker) => {
    // If there is already a marker there
    if (board[index] === "") {
      board[index] = marker;
    } else return;
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
    resetBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  };

  // Current player method
  const getCurrentPlayer = () => players[currentPlayerIndex];

  // Play turn method
  const playTurn = (cell) => {
    // Check if the game start button has been clcicked
    // if the game is over
    // or if the cell is already taken
    if (players.length === 0 || gameOver || Gameboard.getBoard()[cell] !== "")
      return;

    // If both are false:
    let currentPlayer = getCurrentPlayer(); // Get the current player Object
    Gameboard.updateBoard(cell, currentPlayer.marker); // Update Board
    currentPlayer.playsIndex.push(cell); // Add the cell to player's list of cells taken
    Gameboard.renderBoard(cell, currentPlayer.marker); // Render marker into cell on page

    // Check for a winner
    if (winner(currentPlayer)) {
      gameOver = true;
      updateAnnouncement(`Congrats ${currentPlayer.name}, You Win!`);
    } else if (isTie()) {
      gameOver = true;
      updateAnnouncement("It's a tie!");
    } else {
      // Switch players, since current player's turn is over
      currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
      currentPlayer = getCurrentPlayer();
      updateAnnouncement(`${currentPlayer.name}'s turn`);
    }
  };

  // Check for a win
  const winner = (player) => {
    // Convert the array of marked cells into sets for easier comparison
    let playerCombos = new Set(player.playsIndex);

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
      if (combo.every((item) => playerCombos.has(item))) return true;
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

  // Change announcement function
  const updateAnnouncement = (text) => {
    const announcement = document.querySelector(".announcement");
    announcement.textContent = text;
  };

  const resetBoard = () => {
    Gameboard.resetBoard();
  };

  return { startGame, playTurn, getCurrentPlayer, resetBoard };
})();

// Display Controller Function

const displayController = (() => {
  // Select DOM elements
  const startBtn = document.querySelector(".start-game");
  const gridInput = document.querySelector(".grid-container");
  const announcement = document.querySelector(".announcement");
  const playerName1 = document.querySelector(".player-name-1");
  const playerName2 = document.querySelector(".player-name-2");

  // Start game function
  const handleStartGame = () => {
    if (startBtn.textContent === "Restart") {
      restartGame();
      GameController.resetBoard();
      updateAnnouncement("Please enter names and start the game!");
      return;
    }

    const playerOneInput = document.querySelector("#player-1");
    const playerTwoInput = document.querySelector("#player-2");
    const playerOne = playerOneInput.value;
    const playerTwo = playerTwoInput.value;
    if (!playerOne || !playerTwo) {
      updateAnnouncement("Please enter valid names for both players!");
      return;
    }
    // Start the game
    GameController.startGame(playerOne, playerTwo);
    // Display player names
    updatePlayerNames(playerOne, playerTwo);
    // Change announcement
    updateAnnouncement(`${playerOne}'s turn`);

    startBtn.textContent = `Restart`;
  };

  // Handle grid click input
  const handleGridClick = (e) => {
    const element = e.target;
    if (!element.classList.contains("input")) return;
    const gridId = element.dataset.gridId;
    GameController.playTurn(gridId - 1);
  };

  // Update announcement function
  const updateAnnouncement = (text) => {
    announcement.textContent = text;
  };

  // Enter Player Name function
  const enterPlayerNames = () => {
    const htmlOne = `<input type="text" name="player_name" id="player-1" />`;
    const htmlTwo = `<input type="text" name="player_name" id="player-2" />`;
    playerName1.innerHTML = htmlOne;
    playerName2.innerHTML = htmlTwo;
  };

  // Update player names in UI function
  const updatePlayerNames = (playerOne, playerTwo) => {
    playerName1.textContent = playerOne;
    playerName2.textContent = playerTwo;
  };

  // Restart Game
  const restartGame = () => {
    enterPlayerNames();
    startBtn.textContent = `Start Game`;
  };

  // Initialise the display controller (i.e. set up event listeners)
  const init = () => {
    enterPlayerNames();
    // Start the game
    startBtn.addEventListener("click", handleStartGame);
    // Play a round
    gridInput.addEventListener("click", handleGridClick);
  };

  return { init };
})();

displayController.init();
