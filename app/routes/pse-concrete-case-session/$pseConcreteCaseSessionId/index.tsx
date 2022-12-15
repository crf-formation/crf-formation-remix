import { Grid, Stack, Typography } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { assertUserHasAccessToFormation } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema)

	const user = await requireUser(request)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId)
	

	// TODO:
	// await assertUserHasAccessToFormation(user.id, pseConcreteCaseSessionApiObject.id)

  return json({
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - ${data.pseConcreteCaseSession.title}`,
  };
};

export default function SessionPseRoute() {
  const { pseConcreteCaseSession } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Session: {pseConcreteCaseSession.name}</Typography>
        </Grid>

        <Grid item md={8}>
          <Stack spacing={2}>
            {/* TODO:  list groups */}
            {/* TODO:  list situations */}
          </Stack>
        </Grid>

      </Grid>
    </PageContainer>
  );
}
