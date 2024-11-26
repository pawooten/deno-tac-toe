import { GameState } from "./game-state.ts";
import { ErrorMessages } from "./constants/messages.ts";
import { GameThemes } from "../public/constants.js";

export class GameManager {
    private games: Map<string, GameState> = new Map<string, GameState>();
    private gameIDsByPlayer: Map<string, string> = new Map<string, string>();

    public end(gameId: string): void {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`'${gameId}' ${ErrorMessages.GameNotFound}`);
        }
        this.games.delete(gameId);
        this.gameIDsByPlayer.delete(game.host);
        console.log(`Game ended with id: ${gameId}. Game count: ${this.games.size}, ${this.gameIDsByPlayer.size}`);
    }

    public get(id: string): GameState {
        const game = this.games.get(id);
        if (!game) {
            throw new Error(`${ErrorMessages.GameNotFound} ${id}`);
        }
        return game;
    }

    public host(host: string): HostResult {
        const abandonedGameId = this.gameIDsByPlayer.get(host);
        if (abandonedGameId) {
            this.end(abandonedGameId);
        }
        const newGameId =  crypto.randomUUID();
        const game: GameState = {
            host, 
            guest: '',
            id: newGameId,
            isHostTurn: true,
            theme: GameThemes.dinosaurVsSquid,
            cells: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ]
        };
        this.games.set(newGameId, game);
        this.gameIDsByPlayer.set(host, newGameId);
        console.log(`Game hosted with id: ${newGameId}. Game count: ${this.games.size}, ${this.gameIDsByPlayer.size}`);
        return {newGameId, abandonedGameId};
    }

    public join(gameId: string, guest: string): string {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`'${gameId}' ${ErrorMessages.GameNotFound}`);
        }
        if (game.guest) {
            // Another user has already joined the specified game
            throw new Error(ErrorMessages.UnableToJoinGame);
        }
        game.guest = guest;
        return gameId;
    }

    public replay(gameId: string, userId: string): void {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`'${gameId}' ${ErrorMessages.GameNotFound}`);
        }
        if (game.host !== userId) {
            throw new Error(ErrorMessages.UnableToReplayGame);
        }
        game.cells = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        game.isHostTurn = true;
    }
}

export interface HostResult {
    newGameId: string;
    abandonedGameId: string | undefined;
}