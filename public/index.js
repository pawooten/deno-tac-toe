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
    $gameStatusElement.innerHTML = `Joined as guest of game ${gameId}`;
});
// DOM Elements
const $cellDivElements = new Map();
for( const cell of window.document.querySelectorAll('.game-board-cell')) {
    $cellDivElements.set(cell.id, cell);
    cell.addEventListener('click', (ev) => {
        socket.emit('cell-selected', ev.target.id);
    });
}
const $hostButtonElement = window.document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    socket.emit('host-game');
});
const $joinButtonElement = window.document.getElementById('join-button');
const $gameIdInputElement = window.document.getElementById('game-id-input');
const $gameStatusElement = window.document.getElementById('game-control-panel__gameStatus');
const $errorMessageElement = window.document.getElementById('error-message');
const $errorPopoverElement = window.document.getElementById('error-popover');

// Game logic
const hostGame = async (gameId, gameUrl) => {
    $gameStatusElement.innerHTML = `Hosting game ${gameId}`;
    try {
        $gameIdInputElement.disabled = true;
        $joinButtonElement.disabled = true;
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