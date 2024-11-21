export const SocketEvents = {
    // Events emitted from the client to the server
    Client: {
        // A new ws connection has been established
        Connection: 'connection',
        // The host or guest user has clicked a cell in an attempt to mark it
        CellSelected: 'cell-selected',
    },
    // Events emitted from the server to both clients
    ServerBroadcast: {
        // A cell has been marked by either player
        CellMarked: 'cell-marked',
        // A guest has joined the game
        GuestJoined: 'guest-joined',
    },
    // Emitted from server to the client which sent the request when an error occurs
    Error: 'error',
    // Emitted from client to server when the user hosts a new game
    HostGame: 'host-game',
    // Emitted from client to server when the user attempts to join an existing game as guest and
    // from server to guest client when a guest joins a game
    JoinGame: 'join-game', 
};