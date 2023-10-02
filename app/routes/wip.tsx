import type { LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import WipImage from "~/component/image/wip";
import Page from "~/component/layout/Page";
import { requireLoggedInRequestContext } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireLoggedInRequestContext(request);
  
  return json({
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Work in progress` }
  ];
};

export default function WipRoute() {
  return (
    <Page>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>Under construction</Typography>

        <WipImage style={{ width: "80%" }} />
      </Paper>
    </Page>
  );
}
