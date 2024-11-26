import { GameThemes } from "../../public/constants.js";
import { ErrorMessages } from "../constants/messages.ts";

export const validateTheme = (theme: string): string => {
    if (!theme) {
        throw new Error(ErrorMessages.NoThemeSpecified);
    }
    if (theme === GameThemes.random) {
        const themeCount = Object.values(GameThemes).length - 1;
        const randomIndex = Math.floor(Math.random() * themeCount);
        return Object.values(GameThemes)[randomIndex];
    }
    if (!Object.values(GameThemes).includes(theme)) {
        throw new Error(`${ErrorMessages.InvalidThemeSpecified} ${theme}`);
    }
    return theme;
}