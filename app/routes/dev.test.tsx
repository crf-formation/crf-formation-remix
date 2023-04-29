import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  Box, IconButton,
  Link as MuiLink, Tooltip,
  Typography
} from "@mui/material";
import { json, V2_MetaFunction } from "@remix-run/node";
import { Form, Link as RmxLink, useLocation } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import Main from "~/component/layout/Main";
import useRootData from "~/hook/useRootData";
import { addFlashMessage } from "~/service/flash.server";
import { commitSession, requireUser } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request)

	const session = await addFlashMessage(
		request,
		"success",
    `Testing success flash message`
  );

  return json(
    {
      user,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Test" },
  ];
};

export default function Test() {
  const { locales, themeName } = useRootData();

  const location = useLocation();

  return (
    <Main>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flexDirection: "column",
          "& > *": {
            mb: 1,
          },
        }}
      >
        <Form action="/" method="POST">
          <input
            type="hidden"
            name="redirectBack"
            value={`${location.pathname}${location.search}`}
          />
          <Tooltip title="Toggle theme">
            <IconButton type="submit" aria-label="Toggle theme">
              {themeName === "light" ? (
                <Brightness7Icon />
              ) : (
                <Brightness2Icon />
              )}
            </IconButton>
          </Tooltip>
          <Typography component="h1" variant="h6">
            Selected theme: {themeName}
          </Typography>
        </Form>
        <Box>
          <MuiLink component={RmxLink} to="/404">
            Test Root CatchBoundary
          </MuiLink>
        </Box>
        <Box>
          <MuiLink component={RmxLink} to="/test-private-route">
            Test Root ErrorBoundary
          </MuiLink>
        </Box>

        <Box sx={{ marginTop: 4 }}>locales: {locales?.join(", ")}</Box>
      </Box>
    </Main>
  );
}
