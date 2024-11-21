import { ErrorMessages } from "../constants/messages.ts";
import { GameState } from "../game-state.ts";

export const themes = {
    burgerVsPizza: 'burger-vs-pizza',
    classic: 'classic',
    clownVsVomit: 'clown-vs-vomit',
    dizzyVsMindBlown: 'dizzy-vs-mind-blown'
};
const defaultMarks = ['X', 'O'];
const themeMarks = new Map([
    [themes.burgerVsPizza, ['&#127828;', '&#127829;']],
    [themes.classic, defaultMarks],
    [themes.clownVsVomit, ['&#129313;', '&#129326;']],
    [themes.dizzyVsMindBlown, ['&#128565;', '&#129327;']]
]);
export const getUserMark = (game: GameState, user: string): string => {
    const marks = themeMarks.get(themes.burgerVsPizza) || defaultMarks;
    const [x, o] = marks;
    return game.host === user ? x: o;

};
export const getCellIndices = (cell: string): [number, number] => {
    switch (cell) {
        case 'cell-0': return [0, 0];
        case 'cell-1': return [0, 1];
        case 'cell-2': return [0, 2];
        case 'cell-3': return [1, 0];
        case 'cell-4': return [1, 1];
        case 'cell-5': return [1, 2];
        case 'cell-6': return [2, 0];
        case 'cell-7': return [2, 1];
        case 'cell-8': return [2, 2];
        default: throw new Error(`${ErrorMessages.InvalidCellSpecified} : ${cell}`);
    }
}