export const SocketEvents = {
    // Emitted when a client connects to the server with a new ws connection
    Connection: 'connection',
    // Emitted when the user clicks a cell to attempt to mark it
    CellSelected: 'cell-selected',
    // Emitted from server to both clients when a cell is marked by either player
    CellMarked: 'cell-marked',
    // Emitted from server to the client which sent the request when an error occurs
    Error: 'error',
    // Emitted from server to both clients when the guest joins the game
    GuestJoined: 'guest-joined',
    // Emitted from client to server when the user hosts a new game
    HostGame: 'host-game',
    // Emitted from client to server when the user attempts to join an existing game as guest and
    // from server to guest client when a guest joins a game
    JoinGame: 'join-game', 
};