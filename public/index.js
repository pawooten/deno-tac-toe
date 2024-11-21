import { SocketEvents } from "./socket-events.js";
// Websocket event binding
const socket = io();
socket.on(SocketEvents.ServerBroadcast.CellMarked, (cellId, mark) => {
    const cell = $cellDivElements.get(cellId);
    cell.innerHTML = mark;
});
socket.on(SocketEvents.Server.Error, (message) => showError(message));
socket.on(SocketEvents.Server.HostGameAccepted, (gameId, gameUrl) => {
    hostGame(gameId, gameUrl);
});
socket.on(SocketEvents.Server.JoinGameAccepted, (gameId) => {
    currentGame = gameId;
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameStatusElement.innerHTML = `Joined as guest of game ${gameId}`;
});
socket.on(SocketEvents.ServerBroadcast.GuestJoined, () => {
    console.log('Guest joined');
    guestJoined = true;
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
const $gameBoardWrapperElement = window.document.getElementById('game-board__wrapper');
const $gameIdInputElement = window.document.getElementById('game-id-input');
const $gameStatusElement = window.document.getElementById('game-control-panel__gameStatus');
const $hostButtonElement = window.document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    socket.emit(SocketEvents.Client.RequestHostGame);
});
const $joinButtonElement = window.document.getElementById('join-button');

// Game logic
let currentGame;
let guestJoined = false;
const hostGame = async (gameId, gameUrl) => {
    $gameStatusElement.innerHTML = `Hosting game ${gameId}`;
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