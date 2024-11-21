import { GameThemes } from "../../public/socket-events.js";
import { ErrorMessages } from "../constants/messages.ts";
import { GameState } from "../game-state.ts";

const defaultMarks = ['X', 'O'];
const themeMarks = new Map([
    [GameThemes.burgerVsPizza, ['&#127828;', '&#127829;']],
    [GameThemes.classic, defaultMarks],
    [GameThemes.clownVsVomit, ['&#129313;', '&#129326;']],
    [GameThemes.devilVsAngel, ['&#128520;', '&#128519;']],
    [GameThemes.dizzyVsMindBlown, ['&#128565;', '&#129327;']],
    [GameThemes.dogVsCat, ['&#128021;', '&#128008;']],
    [GameThemes.guitarVsMic, ['&#127928;', '&#127908;']],
    [GameThemes.meatVsSalad, ['&#129385;', '&#129367;']],
]);
export const getUserMark = (game: GameState, user: string): string => {
    const marks = themeMarks.get(GameThemes.meatVsSalad) || defaultMarks;
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