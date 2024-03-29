import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import type { Params } from "@remix-run/react";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Fragment } from "react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import InternalLink from "~/component/typography/InternalLink";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useI18n from "~/hook/useI18n";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import type { V2_MetaFunction } from "@remix-run/node";
import { requireLoggedInRequestContext } from "~/service/session.server";

// Note: not named index.tsx on daily directory, because of the <Outlet />


const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema);

  const pseFormationApiObject = await getPseFormationById(formationId);

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    studentId
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, studentId } = await security(request, params);

  const dailyList = [
    {
      id: "1",
      createdAt: new Date(),
      updateddAt: new Date(),
      title: "Note 1 - Lundi"
    },
    {
      id: "2",
      createdAt: new Date(),
      updateddAt: new Date(),
      title: "Note 2 - Mardi"
    }
  ];

  return json({
    dailyList,
    studentId,
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject)
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Suivi quotidien` }
  ];
};

export default function DailyListRoute() {
  const { pseFormation, studentId, dailyList } = useLoaderData<typeof loader>();
  const { formatDate } = useI18n();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Link to="new" style={{ textDecoration: "none" }}>
              <Button variant="outlined">créer une note</Button>
            </Link>
          </Box>

          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", mt: 2 }}
          >
            {dailyList.map((daily) => (
              <Fragment key={daily.id}>
                <InternalLink
                  sx={{
                    textDecoration: "none",
                    "&.active .MuiListItem-root": {
                      borderSize: 1,
                      borderRight: "solid",
                      borderColor: "primary.main"
                    }
                  }}
                  to={daily.id}
                >
                  <ListItem>
                    <ListItemText
                      primary={daily.title}
                      secondary={formatDate(daily.createdAt, "datetime")}
                    />
                  </ListItem>
                </InternalLink>

                <Divider light component="li" />
              </Fragment>
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
