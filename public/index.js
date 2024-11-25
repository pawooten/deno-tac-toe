import { SocketEvents } from "./constants.js";
// Websocket event binding
const socket = io();
socket.on(SocketEvents.ServerBroadcast.CellMarked, ({selectedCell, mark, isHostTurn, result }) => {
    $errorPopoverElement.hidePopover();
    showTurnMessage(isHostTurn);
    const cell = $cellDivElements.get(selectedCell);
    cell.innerHTML = mark;
    if (result) {
        currentGame = null;
        guestJoined = false;
        showGameOver(result);
    }
});
socket.on(SocketEvents.ServerBroadcast.GuestJoined, (subtitle, host, guest) => {
    hostMark = host;
    guestMark = guest;
    showTurnMessage(true);
    guestJoined = true;
    $gameControlPanelSubtitleMessageElement.innerHTML = subtitle;
    $gameHostPopoverElement.hidePopover();
    $gameBoardWrapperElement.classList.remove('disabled');
    $errorPopoverElement.hidePopover();
});
socket.on(SocketEvents.Server.Error, (message) => showError(message));
socket.on(SocketEvents.Server.GameAbandoned, () => {
    currentGame = null;
    guestJoined = false;
    showError('The host has abandoned the game');
});
socket.on(SocketEvents.Server.HostGameAccepted, (gameId, gameUrl) => {
    hostGame(gameId, gameUrl);
});
socket.on(SocketEvents.Server.JoinGameAccepted, (gameId) => {
    currentGame = gameId;
    disableJoinGame();
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameStatusMessageElement.innerHTML = `Joined as guest of game ${gameId}`;
    clearCells();
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
for( const cell of document.querySelectorAll('#game-board .game-board-cell')) {
    $cellDivElements.set(cell.id, cell);
    cell.addEventListener('click', onCellClick);
}
const $errorMessageElement = document.getElementById('error-message');
const $errorPopoverElement = document.getElementById('error-popover');
const $gameOverPopoverElement = document.getElementById('game-over-popover');
const $gameOverMessageElement = document.getElementById('game-over-message');
const $gameBoardWrapperElement = document.getElementById('game-board__wrapper');
const $gameHostPopoverElement = document.getElementById('game-host-popover');
const $gameIdInputElement = document.getElementById('game-id-input');
const $gameStatusMessageElement = document.getElementById('game-control-panel__gameStatus-message');
const $gameStatusGameIdElement = document.getElementById('game-control-panel__gameStatus-gameId');
const $gameTurnIndicatorWrapperElement = document.getElementById('game-control-panel__turnIndicator-wrapper');
const $gameTurnIndicatorMarkElement = document.getElementById('game-control-panel__turnIndicator-mark');
const $hostButtonElement = document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    $gameTurnIndicatorWrapperElement.classList.add('hidden')
    socket.emit(SocketEvents.Client.RequestHostGame);
});
const $joinButtonElement = document.getElementById('join-button');
$joinButtonElement.addEventListener('click', () => {
    const gameId = $gameIdInputElement.value;
    if (!gameId) {
        showError('Please enter a game ID');
        return;
    }
    joinGame($gameIdInputElement.value);
});
const $gameControlPanelSubtitleMessageElement = document.getElementById('game-control-panel__subtitle-message');
// Game logic
let currentGame, hostMark, guestMark;
let guestJoined = false;
const hostGame = async (gameId, gameUrl, host, guest) => {
    hostMark = host;
    guestMark = guest;
    $gameStatusMessageElement.innerHTML = 'Hosting game';
    $gameStatusGameIdElement.innerHTML = gameId;
    $gameStatusGameIdElement.classList.remove('hidden');
    currentGame = gameId;
    guestJoined = false;
    clearCells();
    disableJoinGame();
    try {
        await navigator.clipboard.writeText(gameUrl);
      } catch (error) {
        console.error(error.message);
      }
};
const clearCells = () => {
    for (const cell of $cellDivElements.values()) {
        cell.innerHTML = '';
        cell.classList.remove('winning-game-board-cell');
    }
}
const disableJoinGame = () => {
    $gameBoardWrapperElement.classList.add('disabled');
    $gameIdInputElement.value = '';
    $gameIdInputElement.disabled = true;
    $joinButtonElement.disabled = true;
};
const joinGame = (gameId) => {
    console.log('Joining game', gameId);
    socket.emit(SocketEvents.Client.RequestJoinGame, gameId);
};
const showTurnMessage = (isHostTurn) => {
    $gameTurnIndicatorWrapperElement.classList.remove('hidden');
    if (isHostTurn) {
        $gameTurnIndicatorMarkElement.innerHTML = hostMark;
    } else {
        $gameTurnIndicatorMarkElement.innerHTML = guestMark;
    }
};
const showError = (message) => {
    console.error(message);
    $errorMessageElement.innerHTML = message;
    $errorPopoverElement.showPopover();
};
const showGameOver = (result) => {
    
    for (const cell of result.cellIds) {
        $cellDivElements.get(cell).classList.add('winning-game-board-cell');
    }
    $gameOverMessageElement.innerHTML = result.message;
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