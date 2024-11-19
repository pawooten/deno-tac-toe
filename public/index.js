const socket = io();

const cells = window.document.querySelectorAll('.game-board-cell');
console.log(cells);
for( const cell of cells) {
    cell.addEventListener('click', (ev) => {
        socket.emit('cell-selected', ev.target.id);
    });
}
