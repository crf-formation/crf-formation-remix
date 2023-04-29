import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import Section from "~/component/layout/Section";
import { BooleanText } from "~/component/typography/BooleanText";
import Callout from '~/component/typography/Callout';
import Property from "~/component/typography/Property";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type { PseUserConcreteCaseCompetenceGradeDtoEnum } from "~/dto/pseuserconcretecase.dto";
import type {
  PseUserSummaryConcreteCaseDto,
  PseUserSummaryPreparatoryWorkDto,
  PseUserSummaryTechniqueDto,
} from "~/dto/pseusersummary.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseUserSummaryApiObjectToDto } from "~/mapper/pseusersummary.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseUserSummary } from "~/service/pseusesummary.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { V2_MetaFunction } from "@remix-run/node";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
  }
}

export async function loader({ request, params }: LoaderArgs) {
  await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

  const pseUserSummaryApiObject = await getPseUserSummary(
    formationId,
    studentId
  );

  return json({
    pseUserSummary: pseUserSummaryApiObjectToDto(pseUserSummaryApiObject),
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Résumé` },
  ];
};

function PreparatoryWork({
  preparatoryWork,
}: {
  preparatoryWork: PseUserSummaryPreparatoryWorkDto;
}) {
  return (
    <>
      <Property
        name="hasRealisedAllModules"
        value={
          <BooleanText
            withColor
            checked={preparatoryWork.hasRealisedAllModules}
          />
        }
      />
    </>
  );
}

function Techniques({ technique }: { technique: PseUserSummaryTechniqueDto }) {
  return (
    <>
      <Property
        name="hasAcquiredAllTechniques"
        value={
          <BooleanText withColor checked={technique.hasAcquiredAllTechniques} />
        }
      />

      <Property
        name="Techniques"
        value={
          <span>
            {technique.nbAcquired}
            {" / "}
            {technique.nbAcquired + technique.nbNotAcquired}
          </span>
        }
      />

      <Property
        name="hasAcquiredAllTechniquesToValidatePse1"
        value={
          <BooleanText
            withColor
            checked={technique.hasAcquiredAllTechniquesToValidatePse1}
          />
        }
      />

      <Property
        name="Techniques PSE1"
        value={
          <span>
            {technique.nbAcquiredToValidatePse1}
            {" / "}
            {technique.nbAcquiredToValidatePse1 +
              technique.nbNotAcquiredToValidatePse1}
          </span>
        }
      />
    </>
  );
}

function Summary(
  { hasValidatedPse, hasValidatedPse1 }:
  { hasValidatedPse: boolean, hasValidatedPse1: boolean }
) {
  return (
    <>
      <Property
        name="PSE Validé"
        value={<BooleanText withColor checked={hasValidatedPse} trueText="APTE" falseText="INAPTE" />}
      />

      <Property
        name="PSE 1 Validé"
        value={<BooleanText withColor checked={hasValidatedPse1} trueText="APTE" falseText="INAPTE" />}
      />
    </>
  );
}

function FinalComment() {
  return (
    <>
      Vous pouvez éditer ce commentaire tout au long de la formation.
      <Box mt={2}>
        <TextField multiline rows={6} fullWidth />
      </Box>
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button variant="contained">Sauvegarder</Button>
      </Box>
    </>
  );
}

function Grade({ grade }: { grade: PseUserConcreteCaseCompetenceGradeDtoEnum }) {
	const label = grade === 'NOT_EVALUATED' ? '' : grade

	return (
		<Box sx={{ width: 16 }}>
			{label}
		</Box>
	)
}

function ConcreteCase({ pseCompetences, concreteCase }: { pseCompetences: Array<PseCompetenceDto>, concreteCase: PseUserSummaryConcreteCaseDto }) {
  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>N</TableCell>
            <TableCell>Thème du cas concret</TableCell>
            {pseCompetences.map((pseCompetence) => (
              <TableCell key={pseCompetence.id} align="center">
                {pseCompetence.id}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {concreteCase.userConcreteCases.map((userConcreteCase, index) => (
            <TableRow key={userConcreteCase.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{userConcreteCase.pseConcreteCaseSituation.pseConcreteCaseType.name}</TableCell>
              {userConcreteCase.competences.map((competence) => {
                return (
                  <TableCell key={competence.id} align="center">
                    <Grade
                      grade={competence.grade}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {/* RESULT */}
          <TableRow>
            <TableCell></TableCell>
            <TableCell><Typography fontWeight={500}>RÉSULTAT</Typography></TableCell>
            {concreteCase.competencesSummary.map((pseCompetenceResult) => (
              <TableCell key={pseCompetenceResult.pseCompetenceId} align="center">
                {pseCompetenceResult.acquired ? (
                  <BooleanText withColor checked={pseCompetenceResult.acquired} />
                ) : (
                  <BooleanText
                    withColor
                    checked={pseCompetenceResult.acquiredForPse1}
                    trueText="PSE1"
                    trueColor="warning.main"
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default function SummaryRoute() {
  const { pseUserSummary } = useLoaderData<typeof loader>();

  if (!pseUserSummary) {
    return (
      <Callout severity="warning">
        Il n'y as pas encore de résumé pour ce participant.
      </Callout>
    )
  }

  return (
    <Stack spacing={2} sx={{ "& .Property-name": { width: 360 } }}>
      <Section title="Summary">
        <Summary
          hasValidatedPse={pseUserSummary.hasValidatedPse}
          hasValidatedPse1={pseUserSummary.hasValidatedPse1}
        />
      </Section>

      {pseUserSummary.preparatoryWork && (
        <Section title="Preparatory work">
          <PreparatoryWork preparatoryWork={pseUserSummary.preparatoryWork} />
        </Section>
      )}

      <Section title="Techniques">
        <Techniques technique={pseUserSummary.technique} />
      </Section>

      <Section title="Savoir de mise en oeuvre des procédures">
        {pseUserSummary.concreteCase.userConcreteCases.length === 0 ? (
          <Callout severity="info">
            Ce participant n'as pas encore participé à un cas concret
          </Callout>
        ) : (
          <ConcreteCase
            concreteCase={pseUserSummary.concreteCase}
            pseCompetences={pseUserSummary.pseCompetences}
          />
        )}
      </Section>

      <Section title="Commentaire final">
        <FinalComment />
      </Section>
    </Stack>
  );
}
