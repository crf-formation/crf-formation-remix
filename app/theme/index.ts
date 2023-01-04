import darkTheme from "~/themes/dark";
import lightTheme from "~/themes/light";
import { DEFAULT_THEME, CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '~/constants';
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

    // https://blog.prototypr.io/heading-tags-what-are-they-and-how-to-use-ec7b0973b678
    theme.typography.h1.fontSize = '40pt'; // default: 6rem
    theme.typography.h2.fontSize = '32pt'; // default: 3.75rem
    theme.typography.h3.fontSize = '26pt'; // default: 3.75rem
    theme.typography.h4.fontSize = '22pt'; // default: 2.125rem
    theme.typography.h5.fontSize = '20pt'; // default: 1.5rem
    // theme.typography.h6.fontSize = '32pt'; // default: 1.25rem

    return {
      ...theme,
      palette: {
        ...theme.palette,
        // https://github.com/mui/material-ui/blob/b8e5f932eb7dff7f9bc19bde8887e9d59c5efc87/docs/src/modules/brandingTheme.ts
        error: {
          50: "#FFF0F1",
          100: "#FFDBDE",
          200: "#FFBDC2",
          300: "#FF99A2",
          400: "#FF7A86",
          500: "#FF505F",
          main: "#EB0014", // contrast 4.63:1
          600: "#EB0014",
          700: "#C70011",
          800: "#94000D",
          900: "#570007",
        },
        success: {
          50: "#E9FBF0",
          100: "#C6F6D9",
          200: "#9AEFBC",
          300: "#6AE79C",
          400: "#3EE07F",
          500: "#21CC66",
          600: "#1DB45A",
          // ...(mode === 'dark' && {
          //   main: '#1DB45A', // contrast 6.17:1 (blueDark.800)
          // }),
          // ...(mode === 'light' && {
          main: "#1AA251", // contrast 3.31:1
          // }),
          700: "#1AA251",
          800: "#178D46",
          900: "#0F5C2E",
        },
        // warning: {
        //   50: '#FFF9EB',
        //   100: '#FFF3C1',
        //   200: '#FFECA1',
        //   300: '#FFDC48', // vs blueDark900: WCAG 10.4 AAA, APCA 72 Ok for text
        //   400: '#F4C000', // vs blueDark900: WCAG 6.4 AA normal, APCA 48 Only large text
        //   500: '#DEA500', // vs blueDark900: WCAG 8 AAA normal, APCA 58 Only large text
        //   main: '#DEA500',
        //   600: '#D18E00', // vs blueDark900: WCAG 6.4 AA normal, APCA 48 Only large text
        //   700: '#AB6800', // vs white bg: WCAG 4.4 AA large, APCA 71 Ok for text
        //   800: '#8C5800', // vs white bg: WCAG 5.9 AAA large, APCA 80 Best for text
        //   900: '#5A3600', // vs white bg: WCAG 10.7 AAA, APCA 95 Best for text
        // },
      },
      sidebar: {
        width: DRAWER_WIDTH,
        closedWidth: CLOSED_DRAWER_WIDTH,
      },
    };
}
