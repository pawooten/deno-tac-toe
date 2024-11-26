import { GameThemes, SocketEvents } from "./constants.js";
// Websocket event binding
const socket = io();
socket.on(SocketEvents.ServerBroadcast.CellMarked, ({selectedCell, mark, isHostTurn, result }) => {
    $errorPopoverElement.hidePopover();
    showTurnMessage(isHostTurn);
    const cell = $cellDivElements.get(selectedCell);
    cell.innerHTML = mark;
    if (result) {
        gameState.guestJoined = false;
        showGameOver(result);
    }
});
socket.on(SocketEvents.ServerBroadcast.GuestJoined, (subtitle, host, guest) => {
    gameState.hostMark = host;
    gameState.guestMark = guest;
    showTurnMessage(true);
    gameState.guestJoined = true;
    $gameControlPanelSubtitleMessageElement.innerHTML = subtitle;
    $gameHostPopoverElement.hidePopover();
    $gameBoardWrapperElement.classList.remove('disabled');
    $errorPopoverElement.hidePopover();
    $gameOverPopoverElement.hidePopover();
    clearCells();
});
socket.on(SocketEvents.Server.Error, (message) => showError(message));
socket.on(SocketEvents.Server.GameAbandoned, () => {
    gameState.id = null;
    gameState.guestJoined = false;
    showError('The host has abandoned the game');
});
socket.on(SocketEvents.Server.HostGameAccepted, (gameId, gameUrl) => {
    hostGame(gameId, gameUrl);
});
socket.on(SocketEvents.Server.JoinGameAccepted, (gameId) => {
gameState.id = gameId;
    disableJoinGame();
    $gameBoardWrapperElement.classList.remove('disabled');
    $gameStatusMessageElement.innerHTML = `Joined as guest of game ${gameId}`;
});
// DOM Elements
const onCellClick = (ev) => {
    if (!gameState.id) {
        showError('No game in progress. Host or join a game as a guest');
        return;
    }
    if (!gameState.guestJoined) {
        showError('A game has been hosted but no guest has joined yet');
        return;
    }
    socket.emit(SocketEvents.Client.CellSelected, gameState.id, ev.target.id);
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
const $themeSelectElement = document.getElementById('theme-select');
$hostButtonElement.addEventListener('click', () => {
    $gameTurnIndicatorWrapperElement.classList.add('hidden')
    socket.emit(SocketEvents.Client.RequestHostGame, $themeSelectElement.value);
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
const $playAgainButtonElement = document.getElementById('play-again-button');
$playAgainButtonElement.addEventListener('click', () => {
    socket.emit(SocketEvents.Client.ReplayGame, gameState.id);
});
const $gameControlPanelSubtitleMessageElement = document.getElementById('game-control-panel__subtitle-message');
// Game logic
const gameState = {
    id: null,// The id of the current game, or null
    hostMark: '', guestMark: '', guestJoined: false, isHost: false
};
const hostGame = async (gameId, gameUrl, host, guest) => {
    gameState.hostMark = host;
    gameState.guestMark = guest;
    gameState.isHost = true;
    $gameStatusMessageElement.innerHTML = 'Hosting game';
    $gameStatusGameIdElement.innerHTML = gameId;
    $gameStatusGameIdElement.classList.remove('hidden');
    gameState.id = gameId;
    gameState.guestJoined = false;
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
        $gameTurnIndicatorMarkElement.innerHTML = gameState.hostMark;
    } else {
        $gameTurnIndicatorMarkElement.innerHTML = gameState.guestMark;
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
    if (gameState.isHost) {
        $playAgainButtonElement.removeAttribute('disabled');
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
const loadThemes = () => {
    for (const theme in GameThemes) {
        const option = document.createElement('option');
        option.value = GameThemes[theme];
        option.innerHTML = theme;
        $themeSelectElement.appendChild(option);
    }
};
loadThemes();