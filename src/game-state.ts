export interface GameState {
    id: string;
    host: string;
    isHostTurn: boolean;
    guest: string;
    theme: string;
    cells: string[][]; // 3x3 grid
};