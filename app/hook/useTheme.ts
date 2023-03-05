import { useContext, useMemo } from "react";
import ClientStyleContext from "~/component/layout/ClientStyleContext";
import { DEFAULT_THEME } from "~/constant";
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