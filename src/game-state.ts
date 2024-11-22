export interface GameState {
    id: string;
    host: string;
    guest: string;
    theme: string;
    cells: string[][]; // 3x3 grid
};