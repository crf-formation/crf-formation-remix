import type { LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Page from "~/component/layout/Page";
import useUser from "~/hook/useUser";
import { requireLoggedInRequestContext } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  const requestContext = await requireLoggedInRequestContext(request);
  return json({
    user: requestContext.userMeApiObject
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Bienvenue !` }
  ];
};

export default function WelcomeRoute() {
  const user = useUser();
  return (
    <Page>
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
    </Page>
  );
}
