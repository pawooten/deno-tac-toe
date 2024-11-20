// Websocket event binding
const socket = io();
socket.on('cell-marked', (cellId, mark) => {
    const cell = $cellDivElements.get(cellId);
    cell.innerHTML = mark;
});
socket.on('error', (message) => {
    console.error(message);
    $errorMessageElement.innerHTML = message;
    $errorPopoverElement.showPopover();
});
socket.on('host-game', (gameId, gameUrl) => {
    hostGame(gameId, gameUrl);
});
socket.on('join-game', (gameId) => {
    currentGame = gameId;
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameStatusElement.innerHTML = `Joined as guest of game ${gameId}`;
});
// DOM Elements
const $cellDivElements = new Map();
for( const cell of window.document.querySelectorAll('.game-board-cell')) {
    $cellDivElements.set(cell.id, cell);
    cell.addEventListener('click', (ev) => {
        if (currentGame) {
            socket.emit('cell-selected', currentGame, ev.target.id);
        }
    });
}
const $errorMessageElement = window.document.getElementById('error-message');
const $errorPopoverElement = window.document.getElementById('error-popover');
const $gameBoardWrapperElement = window.document.getElementById('game-board__wrapper');
const $gameIdInputElement = window.document.getElementById('game-id-input');
const $gameStatusElement = window.document.getElementById('game-control-panel__gameStatus');
const $hostButtonElement = window.document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    socket.emit('host-game');
});
const $joinButtonElement = window.document.getElementById('join-button');

// Game logic
let currentGame;

const hostGame = async (gameId, gameUrl) => {
    $gameStatusElement.innerHTML = `Hosting game ${gameId}`;
    currentGame = gameId;
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameIdInputElement.disabled = true;
    $joinButtonElement.disabled = true;
    for (const cell of $cellDivElements.values()) {
        cell.innerHTML = '';
    }
    try {
        await navigator.clipboard.writeText(gameUrl);
      } catch (error) {
        console.error(error.message);
      }
};
const joinGame = (gameId) => {
    console.log('Joining game', gameId);
    socket.emit('join-game', gameId);
};
const parseGameId = () => {
    for (const keyValuePair of location.search.slice(1).split('&')) {
        const [key, value] = keyValuePair.split('=');
        if (key === 'g') {
            return value;
        }
    }
    return null;
};
const queryStringGameId = parseGameId();
if (queryStringGameId) {
    joinGame(queryStringGameId);
}