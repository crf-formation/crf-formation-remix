import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import type { Params } from "@remix-run/react";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import InternalLink from "~/component/typography/InternalLink";
import type { SecurityFunction } from "~/helper/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useI18n from "~/hook/useI18n";
import { pseFormationApiObjectToDto } from '~/mapper/pseformation.mapper';
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

// Note: not named index.tsx on daily directory, because of the <Outlet />


const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
}> = async (request: Request, params: Params) => {
  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
    studentId,
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, studentId } = await security(request, params)

  const dailyList = [
    {
      id: "1",
      createdAt: new Date(),
      updateddAt: new Date(),
      title: "Note 1 - Lundi",
    },
    {
      id: "2",
      createdAt: new Date(),
      updateddAt: new Date(),
      title: "Note 2 - Mardi",
    }
  ]

  return json({
    dailyList,
    studentId,
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
  });
}

export default function DailyListRoute() {
  const { pseFormation, studentId, dailyList } = useLoaderData<typeof loader>();
  const { formatDate } = useI18n()

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Link to="new" style={{ textDecoration: "none" }}>
            <Button variant="outlined">créer une note</Button>
          </Link>

          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {dailyList.map((daily) => (
              <InternalLink
                sx={{
                  textDecoration: "none",
                  '&.active .MuiListItem-root': {
                    borderSize: 1,
                    borderRight: "solid",
                    borderColor: "primary.main"
                  }
                }}
                key={daily.id}
                to={daily.id}
              >
                <ListItem>
                  <ListItemText
                    primary={daily.title}
                    secondary={formatDate(daily.createdAt, 'datetime')}
                  />
                </ListItem>
              </InternalLink>
            ))}
          </List>
        </Grid>

        <Grid item md={8}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
}
