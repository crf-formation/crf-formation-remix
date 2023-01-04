import { createContext } from "react";

import { DEFAULT_THEME } from "~/constant";

import type { ThemeNames } from "~/constant";

export interface ClientStyleContextData {
  reset: () => void;
  themeName: ThemeNames;
  setThemeName: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

export default createContext<ClientStyleContextData>({
  reset: () => {},
  themeName: DEFAULT_THEME,
  setThemeName: () => {}
});
