import { GameThemes } from "../../public/constants.js";
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
export const getSubtitleMessage = (theme: string): string => {
    const marks = themeMarks.get(theme) || defaultMarks;
    return `&#128712; The host is ${marks[0]}, the guest is ${marks[1]})`;
};
export const getUserMark = (game: GameState, user: string): string => {
    const marks = themeMarks.get(game.theme) || defaultMarks;
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
export const isStalemate = (game: GameState): boolean => {
    return game.cells.flat().every(cell => cell !== '');
}
export const isWinningMove = (game: GameState, [row, column]: number[], ): boolean => {
    const mark = game.cells[row][column];
    if (game.cells[row].every(cell => cell === mark)) {
        return true;
    }
    if (game.cells.every(row => row[column] === mark)) {
        return true;
    }
    // const diagonalWin = (row === column && game.cells.every((row, index) => row[index] === mark)) ||
    //     (row + column === 2 && game.cells.every((row, index) => row[2 - index] === mark));
    // TODO diagonal wins
    return false;
};
export const getGameResult = (game: GameState, [row, column]: number[]): string => {
    const mark = game.cells[row][column];
    if (isWinningMove(game, [row, column])) {
        return `${mark} wins!`;
    }
    if (isStalemate(game)) {
        return 'Stalemate!';
    }
    return '';
}