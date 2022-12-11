import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { Box, Paper, Typography } from '@mui/material';
import { json } from "@remix-run/node";
import PageContainer from "~/components/layout/PageContainer";
import Callout from "~/components/typography/Callout";
import useUser from "~/hooks/useUser";
import { requireUser } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({
    user
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Welcome",
  };
};

export default function WelcomePage() {
	const user = useUser()
  return (
    <PageContainer>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>
          Welcome !
        </Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>
          Your account has been configured
        </Typography>

        <Typography sx={{ mt: 2 }}>
          You now have access to the backoffice.
        </Typography>

        {/* margin on mobile */}
        <Box mx={2}>
          <Callout
            severity="info"
            withIcon
            sx={{ maxWidth: 480, mx: "auto", mt: 4 }}
          >
            You are linked to the group: {user.storesGroup.displayName}
          </Callout>
        </Box>
      </Paper>

      {/* TODO: display tutorial from notion? */}
    </PageContainer>
  );
}
