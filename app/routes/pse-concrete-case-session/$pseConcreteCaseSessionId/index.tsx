import { Button, Chip, Grid, Link, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params} from "@remix-run/react";
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
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import PageTitle from "~/components/layout/PageTitle";
import type { PseConcreteCaseGroupDto } from '../../../dto/pseconcretecasegroup.dto';
import { getPseFormationByPseConcreteCaseSessionId } from '~/services/pseformation.server';
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { SecurityFunction } from "~/constants/remix";
import PageAction from "~/components/layout/PageAction";

// GET PSE concrete case sessions

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
  } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(
      pseConcreteCaseSessionApiObject
    ),
  });
};

const security: SecurityFunction<{
  userApiObject: UserApiObject;
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
}> = async (request: Request, params: Params) => {
  const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId)
  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)	

	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    userApiObject,
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Session - ${data?.pseConcreteCaseSession?.name}`,
  };
};

function Groups({ pseFormationId, pseConcreteCaseSessionId, groups }) {
  return (
    <Section
      title="Groupes"
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

      <PageAction>
        <Chip label={pseConcreteCaseSession.stateLabel} />

        <Button>
          <Link
            href={`/pse-concrete-case-session/${pseConcreteCaseSession.id}/edit`}
          >
            Éditer
          </Link>
        </Button>
      </PageAction>

      <Grid container spacing={2}>
        <Grid item md={8}>
          <Stack spacing={2}>
            {/* TODO:  list situations */}
            <Situations pseConcreteCaseSessionId={pseConcreteCaseSession.id} />
            {/* TODO:  list groups */}
            <Groups
              pseFormationId={pseFormation.id}
              pseConcreteCaseSessionId={pseConcreteCaseSession.id}
              groups={pseConcreteCaseSession.groups}
            />
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
