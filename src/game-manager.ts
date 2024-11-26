import { GameState } from "./game-state.ts";
import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { GameThemes } from "../public/constants.js";
import { validateTheme } from "./utilities/theme-validator.ts";

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

    public host(host: string, theme: string): HostResult {
        this.cleanUp();

        const defaultTheme = GameThemes.classic;
        const abandonedGameId = this.gameIDsByPlayer.get(host);
        if (abandonedGameId) {
            this.end(abandonedGameId);
        }
        let validatedTheme = null;
        try {
            validatedTheme = validateTheme(theme);
        } catch (error) {
            console.error(error);
            validatedTheme = defaultTheme;
        }
        const newGameId =  crypto.randomUUID();
        const game: GameState = {
            heartbeat: new Date(),
            host, 
            guest: '',
            id: newGameId,
            isHostTurn: true,
            theme: validatedTheme,
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
        game.heartbeat = new Date();
        game.cells = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        game.isHostTurn = true;
    }

    private cleanUp(): void {
        console.log(`${LoggedMessages.CleanupStarted} ${this.games.size}, ${this.gameIDsByPlayer.size}`);
        for (const game of this.games.values()) {
            const timeSinceLastHeartbeat = new Date().getTime() - game.heartbeat.getTime();
            const twoMinutes = 1000 * 60 * 2;
            if (timeSinceLastHeartbeat > twoMinutes) {
                this.end(game.id);
            }
        }
        console.log(`${LoggedMessages.CleanupEnded} ${this.games.size}, ${this.gameIDsByPlayer.size}`);
    }
}

export interface HostResult {
    newGameId: string;
    abandonedGameId: string | undefined;
}