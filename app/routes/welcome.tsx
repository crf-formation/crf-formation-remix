import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { Paper, Typography } from '@mui/material';
import { json, V2_MetaFunction } from "@remix-run/node";
import PageContainer from "~/component/layout/PageContainer";
import useUser from "~/hook/useUser";
import { requireUser } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({
    user
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Bienvenue !` },
  ];
};

export default function WelcomeRoute() {
	const user = useUser()
  return (
    <PageContainer>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>
          Bienvenue {user.firstName} !
        </Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>
          Votre compte a bien été configuré
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Vous avez désormais accès à CRF Formation.
        </Typography>
      </Paper>
    </PageContainer>
  );
}
