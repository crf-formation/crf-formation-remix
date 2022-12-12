import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { Paper, Typography } from '@mui/material';
import { json } from "@remix-run/node";
import WipImage from "~/components/image/wip";
import PageContainer from "~/components/layout/PageContainer";
import { requireUser } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({
    user
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Work in progress",
  };
};

export default function WipRoute() {
  return (
    <PageContainer>
      <Paper sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h2" sx={{ mt: 2 }}>Under construction</Typography>
					
					<WipImage style={{ width: '80%' }} />
      </Paper>
    </PageContainer>
  );
}
