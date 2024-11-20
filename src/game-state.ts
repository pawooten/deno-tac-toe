export interface GameState {
    id: string;
    host: string;
    guest: string;
    cells: string[][]; // 3x3 grid
};