import { SocketEvents } from "./constants.js";
// Websocket event binding
const socket = io();
socket.on(SocketEvents.ServerBroadcast.CellMarked, ({selectedCell, mark, result }) => {
    const cell = $cellDivElements.get(selectedCell);
    cell.innerHTML = mark;
    if (result) {
        showGameOver(result);
    }
});
socket.on(SocketEvents.Server.Error, (message) => showError(message));
socket.on(SocketEvents.Server.HostGameAccepted, (gameId, gameUrl) => {
    hostGame(gameId, gameUrl);
});
socket.on(SocketEvents.Server.JoinGameAccepted, (gameId) => {
    currentGame = gameId;
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameStatusMessageElement.innerHTML = `Joined as guest of game ${gameId}`;
});
socket.on(SocketEvents.ServerBroadcast.GuestJoined, (subtitle) => {
    console.log('Guest joined');
    guestJoined = true;
    $gameControlPanelSubtitleMessageElement.innerHTML = subtitle;
    $gameBoardWrapperElement.classList.remove('disabled');
    $errorPopoverElement.hidePopover();
});
// DOM Elements
const onCellClick = (ev) => {
    if (!currentGame) {
        showError('No game in progress. Host or join a game as a guest');
        return;
    }
    if (!guestJoined) {
        showError('A game has been hosted but no guest has joined yet');
        return;
    }
    socket.emit(SocketEvents.Client.CellSelected, currentGame, ev.target.id);
};
const $cellDivElements = new Map();
for( const cell of window.document.querySelectorAll('.game-board-cell')) {
    $cellDivElements.set(cell.id, cell);
    cell.addEventListener('click', onCellClick);
}
const $errorMessageElement = window.document.getElementById('error-message');
const $errorPopoverElement = window.document.getElementById('error-popover');
const $gameOverPopoverElement = window.document.getElementById('game-over-popover');
const $gameOverMessageElement = window.document.getElementById('game-over-message');
const $gameBoardWrapperElement = window.document.getElementById('game-board__wrapper');
const $gameIdInputElement = window.document.getElementById('game-id-input');
const $gameStatusMessageElement = window.document.getElementById('game-control-panel__gameStatus-message');
const $gameStatusGameIdElement = window.document.getElementById('game-control-panel__gameStatus-gameId');
const $hostButtonElement = window.document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    socket.emit(SocketEvents.Client.RequestHostGame);
});
const $joinButtonElement = window.document.getElementById('join-button');
$joinButtonElement.addEventListener('click', () => {
    joinGame($gameIdInputElement.value);
});
const $gameControlPanelSubtitleMessageElement = window.document.getElementById('game-control-panel__subtitle-message');
// Game logic
let currentGame;
let guestJoined = false;
const hostGame = async (gameId, gameUrl) => {
    $gameStatusMessageElement.innerHTML = 'Hosting game';
    $gameStatusGameIdElement.innerHTML = gameId;
    $gameStatusGameIdElement.classList.remove('hidden');
    currentGame = gameId;
    guestJoined = false;
    $gameBoardWrapperElement.classList.add('disabled');
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
    socket.emit(SocketEvents.Client.RequestJoinGame, gameId);
};
const showError = (message) => {
    console.error(message);
    $errorMessageElement.innerHTML = message;
    $errorPopoverElement.showPopover();
};
const showGameOver = (message) => {
    $gameOverMessageElement.innerHTML = message;
    $gameOverPopoverElement.showPopover();
}
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