import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { Paper, Typography } from '@mui/material';
import { json } from "@remix-run/node";
import PageContainer from "~/component/layout/PageContainer";

export async function loader({ request }: LoaderArgs) {
  return json({
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Compte créé",
  };
};

export default function WelcomeRoute() {
  return (
    <PageContainer>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>
          Compte créé !
        </Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>
          Votre compte a bien été créé
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Il vous reste cependant à valider votre addresse email. Un email vous
          a été envoyé.
        </Typography>
      </Paper>
    </PageContainer>
  );
}
