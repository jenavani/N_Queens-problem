let n = 8;
let board = [];
let hintMode = false;
let queenIcon = 'fas fa-chess-queen';
let boardTheme = 'default';

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('generateBoard').addEventListener('click', generateBoard);
document.getElementById('solve').addEventListener('click', solve);
document.getElementById('printAllSolutions').addEventListener('click', printAllSolutions);
document.getElementById('hint').addEventListener('click', toggleHintMode);
document.getElementById('clear').addEventListener('click', clearBoard);

function startGame() {
    n = parseInt(document.getElementById('boardSize').value);
    queenIcon = document.getElementById('queenIcon').value;
    boardTheme = document.getElementById('boardTheme').value;

    document.querySelector('.landing-page').style.display = 'none';
    document.querySelector('.container').style.display = 'block';

    generateBoard();
}

function generateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${n}, 50px)`;
    boardElement.style.width = `${n * 50}px`;

    board = Array.from({ length: n }, () => Array(n).fill(0));

    updateBoardTheme();

    for (let i = 0; i < n * n; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => toggleQueen(cell));
        cell.addEventListener('mouseover', () => showThreats(cell));
        cell.addEventListener('mouseout', hideThreats);
        boardElement.appendChild(cell);
    }
}

function updateBoardTheme() {
    const boardElement = document.getElementById('board');
    if (boardTheme === 'wood') {
        boardElement.style.backgroundColor = '#deb887';
    } else if (boardTheme === 'marble') {
        boardElement.style.backgroundColor = '#dcdcdc';
    } else if (boardTheme === 'space') {
        boardElement.style.backgroundColor = '#000';
        boardElement.style.backgroundImage = 'url(space.jpg)';
    } else {
        boardElement.style.backgroundColor = '#d18b47';
    }
}

function toggleQueen(cell) {
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / n);
    const col = index % n;

    if (board[row][col] === 1) {
        removeQueen(cell, row, col);
    } else if (canPlaceQueen(row, col)) {
        placeQueen(cell, row, col);
    } else {
        showPopupMessage('Cannot place queen here!');
    }
}

function placeQueen(cell, row, col) {
    cell.innerHTML = `<i class="${queenIcon}"></i>`;
    cell.classList.add('queen');
    board[row][col] = 1;
}

function removeQueen(cell, row, col) {
    cell.innerHTML = '';
    cell.classList.remove('queen');
    board[row][col] = 0;
}

function canPlaceQueen(row, col) {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === 1 || board[i][col] === 1) return false;
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 1 && (Math.abs(i - row) === Math.abs(j - col))) {
                return false;
            }
        }
    }

    return true;
}

function solve() {
    if (solveNQueens(0)) {
        displayBoard();
        showMessage('Solution found!', 'text-success');
    } else {
        showMessage('No solution found!', 'text-danger');
    }
}

function solveNQueens(row) {
    if (row === n) return true;

    for (let col = 0; col < n; col++) {
        if (canPlaceQueen(row, col)) {
            board[row][col] = 1;
            if (solveNQueens(row + 1)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function printAllSolutions() {
    const solutions = [];
    solveNQueensAll(0, solutions);
    displayAllSolutions(solutions);
}

function solveNQueensAll(row, solutions) {
    if (row === n) {
        solutions.push(board.map(row => row.slice()));
        return;
    }

    for (let col = 0; col < n; col++) {
        if (canPlaceQueen(row, col)) {
            board[row][col] = 1;
            solveNQueensAll(row + 1, solutions);
            board[row][col] = 0;
        }
    }
}

function displayBoard() {
    const boardElement = document.getElementById('board');
    const cells = boardElement.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        const row = Math.floor(i / n);
        const col = i % n;
        if (board[row][col] === 1) {
            cells[i].innerHTML = `<i class="${queenIcon}"></i>`;
            cells[i].classList.add('queen');
        } else {
            cells[i].innerHTML = '';
            cells[i].classList.remove('queen');
        }
    }
}

function displayAllSolutions(solutions) {
    const solutionsElement = document.getElementById('solutions');
    solutionsElement.innerHTML = '';
    solutions.forEach((solution, index) => {
        const boardDiv = document.createElement('div');
        boardDiv.classList.add('solution-board');
        boardDiv.style.gridTemplateColumns = `repeat(${n}, 20px)`;
        solution.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                if (cell === 1) {
                    cellDiv.innerHTML = `<i class="${queenIcon}"></i>`;
                    cellDiv.classList.add('queen');
                }
                boardDiv.appendChild(cellDiv);
            });
        });
        solutionsElement.appendChild(boardDiv);
    });
    showMessage(`Found ${solutions.length} solution(s)`, 'text-success');
}

function showThreats(cell) {
    if (!hintMode) return;
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / n);
    const col = index % n;

    const boardElement = document.getElementById('board');
    const cells = boardElement.getElementsByClassName('cell');

    for (let i = 0; i < cells.length; i++) {
        const r = Math.floor(i / n);
        const c = i % n;
        if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
            cells[i].classList.add('threatened');
        }
    }
}

function hideThreats() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('threatened'));
}

function toggleHintMode() {
    hintMode = !hintMode;
    const hintButton = document.getElementById('hint');
    if (hintMode) {
        hintButton.classList.add('btn-dark');
    } else {
        hintButton.classList.remove('btn-dark');
    }
}

function clearBoard() {
    board = Array.from({ length: n }, () => Array(n).fill(0));
    displayBoard();
    showMessage('', '');
}

function showPopupMessage(message) {
    const popup = document.getElementById('popupMessage');
    popup.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 1500);
}

function showMessage(message, className) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = className;
}
