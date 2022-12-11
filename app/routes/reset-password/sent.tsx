import { Box, Typography } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { getUserId } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Password fogotten",
  };
};

export default function PasswordResetPage() {
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
