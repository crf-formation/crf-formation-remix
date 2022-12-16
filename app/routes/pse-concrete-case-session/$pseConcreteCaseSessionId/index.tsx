import { Grid, Link, Stack, Typography } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import Section from "~/components/layout/Section";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema)

	await requireUser(request)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId)
	

	// TODO:
	// await assertUserHasAccessToFormation(user.id, pseConcreteCaseSessionApiObject.id)

  return json({
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - ${data.pseConcreteCaseSession.name}`,
  };
};

function Groups({ pseConcreteCaseSessionId }) {
  return (
    <Section
      title="Groups"
      action={
        <span>
          <Link href={`/pse-concrete-case-session/${pseConcreteCaseSessionId}/group/new`}>
            <PersonAddIcon />
          </Link>
        </span>
      }
    ></Section>
  );
}

function Situations({ pseConcreteCaseSessionId }) {
  return (
    <Section
      title="Situations"
      action={
        <span>
          <Link href={`/pse-concrete-case-session/${pseConcreteCaseSessionId}/situation/new`}>
            <AddIcon />
          </Link>
        </span>
      }
    ></Section>
  );
}

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
            {/* TODO:  list situations */}
            <Situations pseConcreteCaseSessionId={pseConcreteCaseSession.id} />
            {/* TODO:  list groups */}
            <Groups pseConcreteCaseSessionId={pseConcreteCaseSession.id} />
          </Stack>
        </Grid>

      </Grid>
    </PageContainer>
  );
}
