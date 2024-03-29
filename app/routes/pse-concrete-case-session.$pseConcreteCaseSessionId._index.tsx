import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import PageActions from "~/component/layout/PageActions";
import Section from "~/component/layout/Section";
import Callout from "~/component/typography/Callout";
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseConcreteCaseSessionGroupOrderDto } from "~/dto/pseconcretecasesession.dto";
import type { PseConcreteCaseSituationDto, PseSituationConcreteCaseGroupDto } from "~/dto/pseconcretecasesituation.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import {
  pseConcreteCaseSessionApiObjectToDto,
  pseConcreteCaseSessionGroupOrderApiObjectToDto
} from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import {
  getPseConcreteCaseSessionById,
  getPseConcreteCaseSituationsGroupsOrder
} from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituationsForPseConcreteCaseSessionId } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";


// GET PSE concrete case sessions

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema);

  const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId);
  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject
  } = await security(request, params);

  const pseConcreteCaseSituationApiObjects = await getPseConcreteCaseSituationsForPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);

  const pseConcreteCaseSessionGroupOrderApiObjects = getPseConcreteCaseSituationsGroupsOrder(
    pseConcreteCaseSessionApiObject.pseConcreteCaseGroups,
    pseConcreteCaseSituationApiObjects
  );

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
    pseConcreteCaseSituations: pseConcreteCaseSituationApiObjects.map(pseConcreteCaseSituationApiObjectToDto),
    pseConcreteCaseSessionGroupOrders: pseConcreteCaseSessionGroupOrderApiObjects.map(pseConcreteCaseSessionGroupOrderApiObjectToDto)
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Session - ${data?.pseConcreteCaseSession?.name}` }
  ];
};

function PseConcreteCaseGroupsTable({ pseFormationId, pseConcreteCaseSessionId, pseConcreteCaseGroups }) {
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
            <TableCell>Membres</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pseConcreteCaseGroups.map((group: PseConcreteCaseGroupDto) => (
            <TableRow key={group.id}>
              <TableCell>
                <Link href={`/pse-concrete-case-group/${group.id}`}>
                  {group.name}
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
        {/* TODO: pagination */}
      </Table>
    </Section>
  );
}

function PseConcreteCaseSituationsTable({ pseConcreteCaseSessionId, pseConcreteCaseSituations }) {
  return (
    <Section
      title="Situations"
      action={
        <span>
          <Link
            href={`/pse-concrete-case-session/${pseConcreteCaseSessionId}/situation/new`}
          >
            <AddIcon />
          </Link>
        </span>
      }
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Formateur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pseConcreteCaseSituations.map((pseConcreteCaseSituation: PseConcreteCaseSituationDto) => (
            <TableRow key={pseConcreteCaseSituation.id}>
              <TableCell>
                <Link href={`/pse-concrete-case-situation/${pseConcreteCaseSituation.id}`}>
                  {pseConcreteCaseSituation.name}
                </Link>
              </TableCell>
              <TableCell>{pseConcreteCaseSituation.teacher.fullName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* TODO: pagination */}
      </Table>
    </Section>
  );
}


function PseConcreteCaseSituationGroupOrder({ pseConcreteCaseSessionId, pseConcreteCaseSituation }: {
  pseConcreteCaseSessionId: string,
  pseConcreteCaseSituation: PseConcreteCaseSituationDto
}) {
  return (
    <Grid item md={6}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box>
          <Typography variant="h4">{pseConcreteCaseSituation.name}</Typography>
          <Typography variant="subtitle2">
            {pseConcreteCaseSituation.teacher.fullName}
          </Typography>
        </Box>

        <Button>
          <Link
            href={`/pse-concrete-case-situation/${pseConcreteCaseSituation.id}`}
          >
            <ModeEditIcon />
          </Link>
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {pseConcreteCaseSituation.pseSituationConcreteCaseGroups.length ===
          0 && (
            <Box mt={2}>
              <p>L'ordre des groupes n'as pas encore été défini.</p>
            </Box>
          )}

        <List sx={{ mt: 2 }}>
          {pseConcreteCaseSituation.pseSituationConcreteCaseGroups.map(
            (
              pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupDto
            ) => (
              <ListItem
                key={pseSituationConcreteCaseGroup.id}
                secondaryAction={
                  <Button>
                    <Link
                      href={`/pse-concrete-case-situation/${pseConcreteCaseSituation.id}/group/${pseSituationConcreteCaseGroup.pseConcreteCaseGroupId}/evaluate`}
                    >
                      Évaluer
                    </Link>
                  </Button>
                }
              >
                <ListItemText primary={
                  <span>{pseSituationConcreteCaseGroup.position}.{" "}{pseSituationConcreteCaseGroup.pseConcreteCaseGroup.name}</span>} />
              </ListItem>
            )
          )}
        </List>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Grid>
  );
}

function PseConcreteCaseSituationGroupsOrder(
  {
    pseConcreteCaseSessionId,
    pseConcreteCaseSituations,
    noneHasPosition
  }: {
    pseConcreteCaseSessionId: string;
    pseConcreteCaseSituations: Array<PseConcreteCaseSituationDto>;
    noneHasPosition: boolean;
  }) {
  return (
    <Section title="Situations - Ordre de passage">
      {noneHasPosition && (
        <Callout severity="warning">
          L'ordre des groupes n'as pas encore été défini.
        </Callout>
      )}

      <Grid container spacing={2}>
        {pseConcreteCaseSituations?.map(
          (pseConcreteCaseSituation: PseConcreteCaseSituationDto) => (
            <PseConcreteCaseSituationGroupOrder
              key={pseConcreteCaseSituation.id}
              pseConcreteCaseSessionId={pseConcreteCaseSessionId}
              pseConcreteCaseSituation={pseConcreteCaseSituation}
            />
          )
        )}
      </Grid>
    </Section>
  );
}

function PseConcreteGroupOrder({ groupOrder }: { groupOrder: PseConcreteCaseSessionGroupOrderDto }) {
  return (
    <Grid item md={6}>
      <Typography variant="h4">
        {groupOrder.pseConcreteCaseGroup.name}
      </Typography>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {groupOrder.hasNoPositions && (
          <Callout severity="warning">L'ordre de passage n'as pas encore été défini.</Callout>
        )}

        {groupOrder.hasSomeSituationsWithoutPosition && (
          <Box>
            <Callout severity="warning">
              L'ordre de passage n'a pas été défini sur certaines situations:
              <ul>
                {groupOrder.situationsWithoutPosition.map(situationWithoutPosition => (
                  <li key={situationWithoutPosition.id}>{situationWithoutPosition.name}</li>
                ))}
              </ul>
            </Callout>
          </Box>
        )}

        {groupOrder.duplicatedPositions.length > 0 && (
          <Callout severity="warning">
            Le groupe a été placé dans la même position sur plusieurs situations.
          </Callout>
        )}

        {/* Order */}
        {groupOrder.groupOrderSituations?.map((groupOrderSituation) => (
          <div key={groupOrderSituation.pseConcreteCaseSituation.id}>
            {groupOrderSituation.position}.
            {groupOrderSituation.pseConcreteCaseSituation.name}
          </div>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />
    </Grid>
  );
}

function PseConcreteGroupsOrder({ pseConcreteCaseSessionGroupOrders, noneHasPosition }: {
  pseConcreteCaseSessionGroupOrders: Array<PseConcreteCaseSessionGroupOrderDto>,
  noneHasPosition: boolean
}) {
  return (
    <Section title="Groupes - Ordre de passage">
      {noneHasPosition && (
        <Callout severity="warning">
          L'ordre des groupes n'as pas encore été défini.
        </Callout>
      )}

      <Grid container spacing={2}>
        {!noneHasPosition && pseConcreteCaseSessionGroupOrders?.map((groupOrder: PseConcreteCaseSessionGroupOrderDto) => (
          <PseConcreteGroupOrder
            key={groupOrder.pseConcreteCaseGroup.id}
            groupOrder={groupOrder}
          />
        ))}
      </Grid>
    </Section>
  );
}

export default function SessionPseRoute() {
  const {
    pseFormation,
    pseConcreteCaseSessionGroupOrders,
    pseConcreteCaseSession,
    pseConcreteCaseSituations
  } = useLoaderData<typeof loader>();

  const noneHasPosition = pseConcreteCaseSessionGroupOrders.every((groupOrder: PseConcreteCaseSessionGroupOrderDto) => groupOrder.hasNoPositions);

  return (
    <Page
      ariane={
        <Ariane>
          <ArianeItem label="PSE" href="pse" />

          <ArianeItem
            label={pseFormation.title}
            href={`/pse/${pseFormation.id}`}
          />

          <ArianeItem
            label="Cas concret"
            href={`/pse/${pseFormation.id}/concrete-case/session`}
          />

        </Ariane>
      }
      title={pseConcreteCaseSession.name}
      action={
        <PageActions>
          <Chip label={pseConcreteCaseSession.stateLabel} />

          <Button>
            <Link
              href={`/pse-concrete-case-session/${pseConcreteCaseSession.id}/edit`}
            >
              Éditer
            </Link>
          </Button>
        </PageActions>
      }
    >

      <Grid container spacing={2}>
        <Grid item md={8}>
          <Stack spacing={2}>
            <PseConcreteCaseSituationGroupsOrder
              pseConcreteCaseSessionId={pseConcreteCaseSession.id}
              pseConcreteCaseSituations={pseConcreteCaseSituations}
              noneHasPosition={noneHasPosition}
            />
            <PseConcreteGroupsOrder
              pseConcreteCaseSessionGroupOrders={
                pseConcreteCaseSessionGroupOrders
              }
              noneHasPosition={noneHasPosition}
            />
          </Stack>
        </Grid>

        <Grid item md={4}>
          <Stack spacing={2}>
            <PseConcreteCaseGroupsTable
              pseFormationId={pseFormation.id}
              pseConcreteCaseSessionId={pseConcreteCaseSession.id}
              pseConcreteCaseGroups={
                pseConcreteCaseSession.pseConcreteCaseGroups
              }
            />

            <PseConcreteCaseSituationsTable
              pseConcreteCaseSessionId={pseConcreteCaseSession.id}
              pseConcreteCaseSituations={pseConcreteCaseSituations}
            />

            {/* TODO: list users without groups */}
          </Stack>
        </Grid>
      </Grid>

    </Page>
  );
}
