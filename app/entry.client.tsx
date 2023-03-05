// https://codesandbox.io/s/remix-mui-switch-theme-fixed-latest-mv73cj?file=/app/entry.client.tsx:1202-1221
import { CacheProvider } from '@emotion/react';
import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import ClientStyleContext from "~/component/layout/ClientStyleContext";
import type { ThemeNames } from "~/constant";
import { DEFAULT_THEME } from "~/constant";
import { getCookie, getParsedCookie } from "~/util/theme.client";
import createEmotionCache from './util/createEmotionCache';

function ClientCacheProvider({ children }: React.PropsWithChildren<{}>) {
  const [cache, setCache] = useState(createEmotionCache());

  const themeCookie = getCookie("theme");
  const parsedCookie = getParsedCookie(themeCookie);
  let defaultThemeName: ThemeNames = DEFAULT_THEME;
  if (parsedCookie === "dark" || parsedCookie === "light") {
    defaultThemeName = parsedCookie;
  }

  const [themeName, setThemeName] = useState<ThemeNames>(defaultThemeName);

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset, themeName, setThemeName }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}


const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <ClientCacheProvider>
          {/* <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}> */}
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              {/* <CssBaseline /> */}
              <RemixBrowser />
            {/* </ThemeProvider>
          </CacheProvider> */}
        </ClientCacheProvider>
      </StrictMode>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
