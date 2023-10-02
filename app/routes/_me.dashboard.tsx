import type { Params } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { SecurityFunction } from "~/helper/remix.helper";
import { requireLoggedInRequestContext } from "~/service/session.server";
import type { V2_MetaFunction } from "@remix-run/node";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useUser from "~/hook/useUser";
import Callout from "~/component/typography/Callout";
import Page from "~/component/layout/Page";
import type { UserMeApiObject } from "~/apiobject/user.apiobject";

const security: SecurityFunction<{
  userApiObject: UserMeApiObject;
}> = async (request: Request, params: Params) => {
  const requestContext = await requireLoggedInRequestContext(request);
  return {
    userApiObject: requestContext.userMeApiObject
  };
};


export async function loader({ request, params }: LoaderArgs) {
  const { userApiObject } = await security(request, params);

  return json({});
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Dashboard" }
  ];
};


export default function DashboardRoute() {
  const user = useUser();

  return (
    <Page>
      <Stack spacing={3}>
        {/* Welcome message */}
        <Paper sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h2" sx={{ mt: 2 }}>
            Bienvenue {user.firstName} !
          </Typography>

          {/* margin on mobile */}
          <Box mx={2}>
            <Callout
              severity="info"
              withIcon
              sx={{ maxWidth: 480, mx: "auto", mt: 4 }}
            >
              Vous êtes connecté sur le site des formations PSE.
            </Callout>
          </Box>
        </Paper>
      </Stack>
    </Page>
  );
}
