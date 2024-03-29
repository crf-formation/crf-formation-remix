import type { LoaderArgs } from "@remix-run/node";
import { json, V2_MetaFunction } from "@remix-run/node";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Page from "~/component/layout/Page";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Compte créé" }
  ];
};

export default function WelcomeRoute() {
  return (
    <Page>
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
    </Page>
  );
}
