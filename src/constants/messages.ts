export class ErrorMessages {
    static readonly CellAlreadySelected = 'This cell has been selected by your opponent';
    static readonly DuplicateCellSelected = 'You have already selected this cell in the current game';
    static readonly NoServerConfigSpecified = 'No server configuration specified';
    static readonly NoSocketServerSpecified = 'No socket server specified';
    static readonly NotYourTurn = 'It is not your turn';
    static readonly InvalidCellSpecified = 'Invalid cell specified';
    static readonly InvalidHostnameSpecified = 'Invalid hostname specified';
    static readonly InvalidPortSpecified = 'Invalid port specified';
    static readonly GameNotFound = 'Game not found';
    static readonly UnableToJoinGame = 'Another user has already joined this game';
    static readonly UnableToReplayGame = 'Only the host may replay a game';
}
export class LoggedMessages {
    static readonly ServerRunning = 'Server running on ';
    static readonly WebSocketServerInitialized = 'Web socket server initialized';
    static readonly WebSocketConnection = 'A new web socket connection has been established';
}