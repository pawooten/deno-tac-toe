const socket = io();
socket.on('cell-marked', (cellId, mark) => {
    const cell = $cellDivElements.get(cellId);
    cell.innerHTML = mark;
});
socket.on('host-game', (gameUrl) => {
    hostGame(gameUrl);
});
const hostGame = async (gameUrl) => {
    try {
        await navigator.clipboard.writeText(gameUrl);
        $hostButtonElement.innerHTML = '&#x2713;';
      } catch (error) {
        console.error(error.message);
      }
};
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