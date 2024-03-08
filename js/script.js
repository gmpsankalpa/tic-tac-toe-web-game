const board = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');
let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function createGameBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (gameActive && !gameBoard[index] && currentPlayer === 'X') {
        gameBoard[index] = currentPlayer;
        updateCell(index);
        const winner = checkWinner();
        if (winner) {
            endGame(winner);
        } else {
            switchPlayer();
            // Computer's move
            setTimeout(() => {
                if (gameActive && currentPlayer === 'O') {
                    const computerMove = getBestMove();
                    gameBoard[computerMove] = currentPlayer;
                    updateCell(computerMove);
                    const computerWinner = checkWinner();
                    if (computerWinner) {
                        endGame(computerWinner);
                    } else {
                        switchPlayer();
                    }
                }
            }, 500); // Delay for a more natural feel
        }
    }
}

function updateCell(index) {
    const cell = board.children[index];
    cell.textContent = gameBoard[index];
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) {
        return 'tie';
    }

    return null;
}

function endGame(winner) {
    gameActive = false;
    restartBtn.style.display = 'block';
    gameOverMessage.textContent = winner === 'tie' ? "It's a tie!" : `Player ${winner} wins!`;
    gameOverScreen.style.display = 'flex';
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    // Clear the board
    for (let i = 0; i < 9; i++) {
        board.children[i].textContent = '';
    }

    restartBtn.style.display = 'none';
    gameOverScreen.style.display = 'none';
}

// Minimax algorithm
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0,
    };

    const winner = checkWinner(board);
    if (winner) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

createGameBoard();

