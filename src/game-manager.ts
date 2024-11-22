import { GameState } from "./game-state.ts";
import { ErrorMessages } from "./constants/messages.ts";
import { GameThemes } from "../public/constants.js";

export class GameManager {
    private games: Map<string, GameState> = new Map<string, GameState>();
    private gameIDsByPlayer: Map<string, string> = new Map<string, string>();

    public get(id: string): GameState {
        const game = this.games.get(id);
        if (!game) {
            throw new Error(`${ErrorMessages.GameNotFound} ${id}`);
        }
        return game;
    }

    public host(host: string): string {
        const id =  crypto.randomUUID();
        const game: GameState = {
            host, 
            guest: '',
            id,
            theme: GameThemes.tacoVsRamen,
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
        if (game.guest) {
            // Another user has already joined the specified game
            throw new Error(ErrorMessages.UnableToJoinGame);
        }
        game.guest = guest;
        return gameId;
    }
}