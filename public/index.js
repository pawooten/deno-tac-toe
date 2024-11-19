const socket = io();
socket.on('cell-marked', (cellId, mark) => {
    console.log(`Cell ${cellId} marked with ${mark}`);
    const cell = $cellDivElements.get(cellId);
    cell.innerHTML = mark;
});
socket.on('host-game', (gameId) => console.log(`Game hosted with id ${gameId}`));
const $cellDivElements = new Map();
for( const cell of window.document.querySelectorAll('.game-board-cell')) {
    $cellDivElements.set(cell.id, cell);
    cell.addEventListener('click', (ev) => {
        socket.emit('cell-selected', ev.target.id);
    });
}
const $hostButtonElement = window.document.getElementById('host-button');
$hostButtonElement.addEventListener('click', () => {
    console.log('Host button clicked');
    socket.emit('host-game');
});