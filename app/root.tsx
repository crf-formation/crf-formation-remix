// based on https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/root.tsx
import { ThemeProvider, withEmotionCache } from "@emotion/react";
import { Box, CssBaseline, Link as MuiLink, Typography } from "@mui/material";
import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction
} from "@remix-run/node";
import {
  redirect
} from "@remix-run/node";
import {
  Link as RmxLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch, useLoaderData
} from "@remix-run/react";
import nProgressStyles from "nprogress/nprogress.css";
import { useContext, useMemo } from "react";
import { AuthenticityTokenProvider } from "~/components/csrf";
import Layout from "~/components/layout/Layout";
import ClientStyleContext from "~/contexts/ClientStyleContext";
import type { ThemeNames } from "./constants";
import { DEFAULT_THEME } from "./constants";
import useEnhancedEffect from "./hooks/useEnhancedEffect";
import { commitSession, getMe, getSession } from "./services/session.server";
import { getTheme } from "./themes";
import { getUserTheme, themeCookie } from "./utils/theme.server";
// import { getClientIPAddress } from "~/services/clientip.server"
import { json } from "@remix-run/node";
import type { ActionArgs } from '@remix-run/server-runtime';
import { LoadingBar } from "~/components/layout/LoadingBar";
import useIsLoading from "~/hooks/useIsLoading";
import { logger } from "~/services/logger";
import ErrorPageContainer from "./components/layout/ErrorPageContainer";
import FlashMessages from "./components/layout/FlashMessages";
import { CSRF_SESSION_KEY } from "./constants/index.server";
import type { Env } from "./constants/types";
import type { UserMeDto } from "./dto/user.dto";
import { getPublicProperties } from '~/services/publicproperties.server';
import { getBrowserEnv } from "./services/env.server";
import type { FlashMessage } from "./services/flash.server";
import { getFlashMessages } from "./services/flash.server";
import type { Locales } from "./services/request.server";
import { getClientLocales, isDesktop } from "./services/request.server";
import DebugMatches from "./components/dev/DebugMatches";
import type { PublicPropertiesDto } from "./dto/publicproperties.dto";

export interface RootLoaderData {
  user: UserMeDto | null;
  themeName: ThemeNames;
  csrf: string;
  locales: Locales;
  env: Env;
  isDesktop: boolean;
  flashMessages: FlashMessage[];
  publicProperties: PublicPropertiesDto | null;
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);

  // let ipAddress = getClientIPAddress(request);
  // console.log({ ipAddress })

  const csrf = session.get(CSRF_SESSION_KEY)

  const flashMessages = await getFlashMessages(session)

  const user = await getMe(request)

  return json<RootLoaderData>(
    {
      // https://github.com/sergiodxa/remix-utils
      csrf, // csrf: pass token to browser
      user,
      themeName: await getUserTheme(request),
      locales: getClientLocales(request),
      // env properties to share with the browser side.
      env: getBrowserEnv(),
      isDesktop: isDesktop(request),

      publicProperties: await getPublicProperties(),

      flashMessages,
    },
    {
      headers: {
        // https://remix.run/docs/en/v1/api/remix#sessionflashkey-value
        // only necessary with cookieSessionStorage
        // will remove the flash message for you
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

/**
 * Toggle theme based on the current theme in the cookie
 */
export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  // Get the redirectBack url from the hidden input that was submitted with the form
  const redirectBack = String(form.get("redirectBack"));

  const currentTheme = await getUserTheme(request);
  const newTheme: ThemeNames = currentTheme === "dark" ? "light" : "dark";

  return redirect(redirectBack || "/", {
    headers: {
      "Set-Cookie": await themeCookie.serialize(newTheme),
    },
  });
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: nProgressStyles }];
};

export const meta: MetaFunction<typeof loader> = () => ({
  charset: "utf-8",
  title: "",
  viewport: "width=device-width,initial-scale=1",
});

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
  themeName?: ThemeNames;
};
const Document = withEmotionCache(
  (
    {
      children,
      title,
      themeName: propThemeName,
      themeName: loaderDataThemeName,
    }: DocumentProps,
    emotionCache
  ) => {
    const isLoading = useIsLoading()

    const clientStyleData = useContext(ClientStyleContext);

    // not using useTheme yet, to use loaderData.
    // maybe we could access it from useTheme using useRouteData("root")?
    const themeName: ThemeNames = useMemo(() => {
      return (
        propThemeName ||
        loaderDataThemeName ||
        clientStyleData.themeName ||
        DEFAULT_THEME
      );
    }, [loaderDataThemeName, clientStyleData, propThemeName]);

    const theme = getTheme(themeName);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only executed on client
    useEnhancedEffect(() => {
      // change the theme in style context
      clientStyleData.setThemeName(themeName);
    }, [themeName]);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />

          {/* NOTE: Very important meta tag */}
          {/* because using this, css is re-inserted in entry.server.tsx */}
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </head>
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <LoadingBar isLoading={isLoading} />

            <FlashMessages />

            {children}
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />

          {process.env.NODE_ENV === "development" && <DebugMatches />}
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { csrf, user, themeName, env } = useLoaderData<typeof loader>();

  return (
    <AuthenticityTokenProvider token={csrf}>
      <Document themeName={themeName}>
        <Layout isLoggedIn={!!user}>
          <Outlet />
        </Layout>

				{/* Make env data availaible on window directly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
      </Document>
    </AuthenticityTokenProvider>
  );
}

function parse(error: Error) {
  try {
    return JSON.parse(error.message);
  } catch (e) {}
  return error;
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  logger.error(error);
  // console.trace()

  const errorMessage = parse(error);

  console.log({errorMessage, error})

  return (
    <Document title="Error!" themeName={errorMessage.themeName}>
      <Layout isLoggedIn={errorMessage.isLoggedIn}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" component="h1">
            An error occured
          </Typography>

          <Box sx={{ marginTop: 4 }}>
          <Typography
              component="pre"
              variant="inherit"
              sx={{ color: "error.main" }}
            >
              {errorMessage.localizedMessage}
            </Typography>
            <Typography
              component="pre"
              variant="inherit"
              sx={{ color: "error.main" }}
            >
              {errorMessage.message || error.message || "unknown error"}
            </Typography>
          </Box>

          {/* TODO: toggle on non-dev env? */}
          {errorMessage.jsonResponse && (
            <Box sx={{ marginTop: 4 }}>
              <Typography component="pre" variant="inherit">
                <Typography component="code" variant="inherit">
                  {errorMessage.jsonResponse}
                </Typography>
              </Typography>
            </Box>
          )}

          {/* TODO: toggle on non-dev env? */}
          <Box sx={{ marginTop: 4 }}>
            <Typography component="pre" variant="inherit">
              <Typography component="code" variant="inherit">
                {error.stack}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <MuiLink component={RmxLink} to="/">
              Go to Home
            </MuiLink>
          </Box>
        </Box>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    
    default:
      throw new Error(JSON.stringify(caught?.data || caught?.statusText));
  }

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
      themeName={caught.data?.themeName}
    >
      <Layout isLoggedIn={caught.data?.isLoggedIn}>
        <ErrorPageContainer
          title={`${caught.status}: ${caught.statusText}`}
          message={message}
        />
      </Layout>
    </Document>
  );
}
