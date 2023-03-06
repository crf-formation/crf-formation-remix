import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import type { Params } from "@remix-run/react";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constant/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
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
              <NavLink
                key={daily.id}
                to={daily.id}
                style={({ isActive }) =>
                  isActive
                    ? {
                        border: `1px solid black`,
                      }
                    : undefined
                }
              >
                <ListItem>
                  <ListItemText
                    primary={daily.title}
                    secondary={daily.createdAt}
                  />
                </ListItem>
              </NavLink>
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
