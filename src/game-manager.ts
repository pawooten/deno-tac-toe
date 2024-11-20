import { GameState } from "./game-state.ts";
import { ErrorMessages } from "./constants/messages.ts";

export class GameManager {
    private games: Map<string, GameState> = new Map<string, GameState>();
    private gameIDsByPlayer: Map<string, string> = new Map<string, string>();

    public host(host: string): string {
        const id =  crypto.randomUUID();
        const game: GameState = {
            host, 
            guest: '',
            id,
            cells: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ]
        };
        this.games.set(id, game);
        this.gameIDsByPlayer.set(host, id);
        console.log(`Game hosted with id: ${id}. Game count: ${this.games.size}`);
        return id;
    }

    public join(gameId: string, guest: string): string {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`${ErrorMessages.GameNotFound} ${gameId}`);
        }
        game.guest = guest;
        return gameId;
    }
}