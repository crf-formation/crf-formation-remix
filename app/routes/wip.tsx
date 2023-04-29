import type { LoaderArgs } from "@remix-run/node";
import { json, V2_MetaFunction } from "@remix-run/node";

import { Paper, Typography } from "@mui/material";
import WipImage from "~/component/image/wip";
import PageContainer from "~/component/layout/PageContainer";
import { requireUser } from "~/service/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({
    user
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Work in progress` }
  ];
};

export default function WipRoute() {
  return (
    <PageContainer>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>Under construction</Typography>

        <WipImage style={{ width: "80%" }} />
      </Paper>
    </PageContainer>
  );
}
