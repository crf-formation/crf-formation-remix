// based on https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/root.tsx
import { withEmotionCache } from "@emotion/react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { LinksFunction, LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import DevToolbar from "./component/dev/DevToolbar";
import {
  isRouteErrorResponse,
  Link as RmxLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import fr from "date-fns/locale/fr";
import nProgressStyles from "nprogress/nprogress.css";
import { useContext, useMemo } from "react";
import { AuthenticityTokenProvider } from "~/component/csrf";
import ClientStyleContext from "~/component/layout/ClientStyleContext";
import Layout from "~/component/layout/Layout";
import { LoadingBar } from "~/component/layout/LoadingBar";
import useIsLoading from "~/hook/useIsLoading";
import { getPublicProperties } from "~/service/publicproperties.server";
import ErrorPageContainer from "./component/layout/ErrorPageContainer";
import FlashMessages from "./component/layout/FlashMessages";
import type { ThemeNames } from "./constant";
import { DEFAULT_THEME } from "./constant";
import { CSRF_SESSION_KEY } from "./constant/index.server";
import type { FlashMessage } from "./dto/flash.dto";
import type { PseFormationDto } from "./dto/pseformation.dto";
import type { PublicPropertiesDto } from "./dto/publicproperties.dto";
import type { UserMeDto } from "./dto/user.dto";
import useEnhancedEffect from "./hook/useEnhancedEffect";
import { pseFormationApiObjectToDto } from "./mapper/pseformation.mapper";
import { userApiObjectToUserMeDto } from "./mapper/user.mapper";
import { getBrowserEnv } from "./service/env.server";
import { getFlashMessages } from "./service/flash.server";
import { getCurrentPseFormationForUser } from "./service/pseformation.server";
import type { Locales } from "./service/request.server";
import { getClientLocales, isDesktop } from "./service/request.server";
import { commitSession, getMe, getSession } from "./service/session.server";
import { getTheme } from "./theme";
import { getUserTheme, themeCookie } from "./util/theme.server";
import type { BrowserEnvDto } from "~/dto/env.dto";
import { browserEnvApiObjectToDto } from "./mapper/environment.mapper";
import { publicPropertiesApiObjectToDto } from "~/mapper/publicproperties.mapper";
import { flashMessageApiObjectToDto } from "./mapper/flashmessage.mapper";

export interface RootLoaderData {
  user: UserMeDto | null;
  themeName: ThemeNames;
  csrf: string;
  locales: Locales;
  browserEnv: BrowserEnvDto;
  isDesktop: boolean;
  flashMessages: FlashMessage[];
  publicProperties: Optional<PublicPropertiesDto>;
  currentPseFormation: Optional<PseFormationDto>;
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);

  // let ipAddress = getClientIPAddress(request);
  // console.log({ ipAddress })

  const csrf = session.get(CSRF_SESSION_KEY);

  const user = await getMe(request);

  const currentPseFormationApiObject = user ? await getCurrentPseFormationForUser(user.id) : null;

  const browserEnvApiObject = getBrowserEnv();
  const publicPropertiesApiObject = await getPublicProperties()

  const flashMessageApiObjects = await getFlashMessages(session);

  return json(
    {
      // https://github.com/sergiodxa/remix-utils
      csrf, // csrf: pass token to browser
      user: !user ? null : userApiObjectToUserMeDto(user),
      themeName: await getUserTheme(request),
      locales: getClientLocales(request),
      // env properties to share with the browser side.
      browserEnv: browserEnvApiObjectToDto(browserEnvApiObject),
      isDesktop: isDesktop(request),

      publicProperties: publicPropertiesApiObjectToDto(publicPropertiesApiObject),

      currentPseFormation: currentPseFormationApiObject ? pseFormationApiObjectToDto(currentPseFormationApiObject) : null,

      flashMessages: flashMessageApiObjects?.map(flashMessageApiObjectToDto),
    },
    {
      headers: {
        // https://remix.run/docs/en/v1/api/remix#sessionflashkey-value
        // only necessary with cookieSessionStorage
        // will remove the flash message for you
        "Set-Cookie": await commitSession(session)
      }
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
      "Set-Cookie": await themeCookie.serialize(newTheme)
    }
  });
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: nProgressStyles }];
};

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "CRF formation" },
    { name: "charset", content: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" }
  ];
};

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
      themeName: loaderDataThemeName
    }: DocumentProps,
    emotionCache
  ) => {
    const isLoading = useIsLoading();

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
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={fr}
        >
          <CssBaseline />

          <LoadingBar isLoading={isLoading} />

          <FlashMessages />

          {children}
        </LocalizationProvider>
      </ThemeProvider>
      <ScrollRestoration />
      <Scripts />

      {process.env.NODE_ENV === "development" && <LiveReload />}
      {process.env.NODE_ENV === "development" && <DevToolbar />}
      </body>
      </html>
    );
  }
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { csrf, user, themeName, browserEnv } = useLoaderData<typeof loader>();

  return (
    <AuthenticityTokenProvider token={csrf}>
      <Document themeName={themeName}>
        <Layout isLoggedIn={!!user}>
          <Outlet />
        </Layout>

        {/* Make env data availaible on window directly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.browserEnv = ${JSON.stringify(browserEnv)}`
          }}
        />
      </Document>
    </AuthenticityTokenProvider>
  );
}


function ErrorView({ error }: { error: Error }) {

  // Note: we do not display the stacktrace, because it does not have any sense on the front.
  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 6
      }}
    >
      <Typography variant="h4" component="h1">
        An error occurred
      </Typography>

      <Box sx={{ marginTop: 6 }}>
        <Typography
          component="pre"
          variant="inherit"
          sx={{ color: "error.main" }}
        >
          {error.message || "unknown error"}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 6 }}>
        <MuiLink component={RmxLink} to="/">
          Go to Home
        </MuiLink>
      </Box>
    </Box>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary() {
  const error = useRouteError();

  console.log({ error });

  // TODO: add ErrorBoundary on a sub-route to have access to isLoggedIn on root loader data ?
  return (
    <Document title="Error!" themeName={undefined}>
      <Layout isLoggedIn={false}>
        {/* when true, this is what used to go to `CatchBoundary`*/}
        {isRouteErrorResponse(error) ? (
          <ErrorPageContainer
            error={error}
          />
        ) : (
          <ErrorView error={error as Error} />
        )}

      </Layout>
    </Document>
  );
}
