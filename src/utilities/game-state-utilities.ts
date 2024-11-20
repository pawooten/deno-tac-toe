import { GameState } from "../game-state.ts";

export const getUserMark = (game: GameState, user: string): string => {
    return game.host === user ? 'X' : 'O';
};