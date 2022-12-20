import { Grid, Link, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
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
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import PageTitle from "~/components/layout/PageTitle";
import type { PseConcreteCaseGroupDto } from '../../../dto/pseconcretecasegroup.dto';

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
  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)	

	// TODO:
	// await assertUserHasAccessToFormationAsTeacher(user.id, pseConcreteCaseSessionApiObject.id)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Session - ${data?.pseConcreteCaseSession?.name}`,
  };
};

function Groups({ pseFormationId, pseConcreteCaseSessionId, groups }) {
  return (
    <Section
      title="Groups"
      action={
        <span>
          <Link
            href={`/pse-concrete-case-session/${pseConcreteCaseSessionId}/group/new`}
          >
            <PersonAddIcon />
          </Link>
        </span>
      }
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Membres</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group: PseConcreteCaseGroupDto) => (
            <TableRow key={group.id}>
              <TableCell>
                <Link href={`/pse-concrete-case-group/${group.id}`}>
                  {group.name}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/pse-concrete-case-group/${group.id}`}>
                  {group.state}
                </Link>
              </TableCell>
              <TableCell>
                {group.students.map((student) => (
                  <div key={student.id}>
                    <Link href={`/pse/${pseFormationId}/students/${student.user.id}`}>{student.user.fullName}</Link>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* TODO: paginaation */}
      </Table>
    </Section>
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
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <PageTitle title={pseConcreteCaseSession.name} />

      <Grid container spacing={2}>

        <Grid item md={8}>
          <Stack spacing={2}>
            {/* TODO:  list situations */}
            <Situations pseConcreteCaseSessionId={pseConcreteCaseSession.id} />
            {/* TODO:  list groups */}
            <Groups pseFormationId={pseFormation.id} pseConcreteCaseSessionId={pseConcreteCaseSession.id} groups={pseConcreteCaseSession.groups} />
          </Stack>
        </Grid>

      </Grid>
    </PageContainer>
  );
}
