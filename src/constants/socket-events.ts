export const SocketEvents = {
    // Events emitted from the client to the server
    Client: {
        // A new ws connection has been established
        Connection: 'connection',
        // The host or guest user has clicked a cell in an attempt to mark it
        CellSelected: 'cell-selected',
        // A user has requested to host a new game
        RequestHostGame: 'request-host-game'
    },
    // Events emitted from the server to the client which sent the request
    Server: {
        // An error has occurred
        Error: 'error',
        // The request to host a new game has been accepted
        HostGameAccepted: 'host-game-accepted',
    },
    // Events emitted from the server to both clients
    ServerBroadcast: {
        // A cell has been marked by either player
        CellMarked: 'cell-marked',
        // A guest has joined the game
        GuestJoined: 'guest-joined',
    },
    // Emitted from client to server when the user attempts to join an existing game as guest and
    // from server to guest client when a guest joins a game
    JoinGame: 'join-game', 
};