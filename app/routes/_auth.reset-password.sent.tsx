import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect, V2_MetaFunction } from "@remix-run/node";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import { getUserId } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Mot de passe oublié" }
  ];
};

export default function PasswordResetRoute() {
  return (
    <PageFullContentWithLogo>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h5">Email sent</Typography>

        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          An email has been sent with a link to reset your token.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ md: 2, maxWidth: 300, mt: 3, fontWeight: 500 }}
        >
          You can close this page.
        </Typography>
      </Box>
    </PageFullContentWithLogo>
  );
}
