import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import Section from "~/components/layout/Section";
import { BooleanText } from "~/components/typography/BooleanText";
import Property from "~/components/typography/Property";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type {
  PseUserSummaryConcreteCaseDto,
  PseUserSummaryPreparatoryWorkDto,
  PseUserSummaryTechniqueDto,
} from "~/dto/pseusesummary.dto";
import { pseUserSummaryApiObjectToDto } from "~/mapper/pseusersummary.mapper";
import { getPseUserSummary } from "~/services/pseusesummary.server";

const zparams = z.object({
  formationId: z.string(),
  studentId: z.string(),
});

export async function loader({ params }: LoaderArgs) {
  const { formationId, studentId } = zparams.parse(params);

  const pseUserSummaryApiObject = await getPseUserSummary(
    formationId,
    studentId
  );

  return json({
    pseUserSummary: pseUserSummaryApiObjectToDto(pseUserSummaryApiObject),
  });
}

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
  { hasValidatePse, hasValidatePse1 }:
  { hasValidatePse: boolean, hasValidatePse1: boolean }
) {
  return (
    <>
      <Property
        name="PSE Validé"
        value={<BooleanText withColor checked={hasValidatePse} trueText="APTE" falseText="INAPTE" />}
      />

      <Property
        name="PSE 1 Validé"
        value={<BooleanText withColor checked={hasValidatePse1} trueText="APTE" falseText="INAPTE" />}
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
        <Button type="submit">Sauvegarder</Button>
      </Box>
    </>
  );
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
          {concreteCase.concreteCaseModules.map((concreteCaseModule, index) => (
            <TableRow key={concreteCaseModule.pseModuleId}>
              <TableCell>{index}</TableCell>
              <TableCell>{concreteCaseModule.pseModule.name}</TableCell>
              {pseCompetences.map((pseCompetenceResult) => {
                const c = concreteCaseModule.competenceResults.find(
                  (c) => c.pseCompetenceId === pseCompetenceResult.id
                );
                if (!c) return null;
                return (
                  <TableCell key={pseCompetenceResult.id} align="center">
                    {c.acquired ? (
                      <BooleanText withColor checked={c.acquired} />
                    ) : (
                      <BooleanText
                        withColor
                        checked={c.acquiredForPse1}
                        trueText="PSE1"
                        trueColor="warning.main"
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {/* RESULT */}
          <TableRow>
            <TableCell></TableCell>
            <TableCell><Typography fontWeight={500}>RESULTAT</Typography></TableCell>
            {concreteCase.competenceResults.map((pseCompetenceResult) => (
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

  return (
    <Stack spacing={2} sx={{ "& .Property-name": { width: 360 } }}>
      <Section title="Summary">
        <Summary
          hasValidatePse={pseUserSummary.hasValidatePse}
          hasValidatePse1={pseUserSummary.hasValidatePse1}
        />
      </Section>

      <Section title="Preparatory work">
        <PreparatoryWork preparatoryWork={pseUserSummary.preparatoryWork} />
      </Section>

      <Section title="Techniques">
        <Techniques technique={pseUserSummary.technique} />
      </Section>

      <Section title="Savoir de mise en oeuvre des procédures">
        <ConcreteCase
          concreteCase={pseUserSummary.concreteCase}
          pseCompetences={pseUserSummary.pseCompetences}
        />
      </Section>

      <Section title="Commentaire final">
        <FinalComment />
      </Section>
    </Stack>
  );
}
