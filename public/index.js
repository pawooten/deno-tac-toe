const socket = io();
socket.on('cell-marked', (cellId, mark) => {
    console.log(`Cell ${cellId} marked with ${mark}`);
    const cell = window.document.getElementById(cellId);
    cell.innerHTML = mark;
});
const cells = window.document.querySelectorAll('.game-board-cell');
for( const cell of cells) {
    cell.addEventListener('click', (ev) => {
        socket.emit('cell-selected', ev.target.id);
    });
}
