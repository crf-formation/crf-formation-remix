import darkTheme from "~/themes/dark";
import lightTheme from "~/themes/light";
import { DEFAULT_THEME } from "~/constants";
import type { Theme, ThemeOptions } from '@mui/material/styles';

import type { ThemeNames } from "~/constants";

const themes: Record<ThemeNames, Theme> = {
  dark: darkTheme,
  light: lightTheme
};

// https://stackoverflow.com/questions/59365396/how-to-use-material-ui-custom-theme-in-react-with-typescript
declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    sidebar: {
      width: number;
      closedWidth: number;
    };
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    sidebar?: {
      width?: number;
      closedWidth?: number;
    };
  }
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

/**
 * Return the MUI Theme object
 */
export function getTheme(themeName: ThemeNames = DEFAULT_THEME): Theme {
  const theme = themes.hasOwnProperty(themeName)
    ? themes[themeName]
    : themes[DEFAULT_THEME];

    return theme
}
