import { useContext, useMemo } from "react";
import { DEFAULT_THEME } from "~/constants";
import ClientStyleContext from "~/contexts/ClientStyleContext";
import type { ThemeNames } from "~/theme";
import { getTheme } from "~/theme";

export default function useTheme() {
	const { themeName: propThemeName } = useContext(ClientStyleContext)

  let themeName: ThemeNames = useMemo(() => {
    return propThemeName || DEFAULT_THEME;
  }, [propThemeName]);

  const theme = getTheme(themeName);

	return theme
}