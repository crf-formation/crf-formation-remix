import Stack from "@mui/material/Stack";
import type { LoaderArgs } from "@remix-run/node";
import { json, V2_MetaFunction } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseSummaryApiObject } from "~/apiobject/psesummary.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import PseSummaryConcreteCaseSummary from "~/component/pse-summary/PseSummaryConcreteCaseSummary";
import PseSummaryPreparatoryWorkSummary from "~/component/pse-summary/PseSummaryPreparatoryWorkSummary";
import PseSummaryResult from "~/component/pse-summary/PseSummaryResult";
import PseSummaryTechniqueSummary from "~/component/pse-summary/PseSummaryTechniqueSummary";
import { loadAndBuildPseSummary } from "~/helper/psesummary.helper";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseSummaryApiObjectToDto } from "~/mapper/psesummary.mapper";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema);

  const userApiObject = await requireUser(request);

  const pseFormationApiObject = await findPseFormationById(formationId);

  if (!pseFormationApiObject) {
    throw new Error(`Formation not found: ${formationId}`);
  }

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject
  };
};

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params);

  const pseSummaryApiObject: PseSummaryApiObject = await loadAndBuildPseSummary(pseFormationApiObject);

  return json({
    formation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseSummary: pseSummaryApiObjectToDto(pseSummaryApiObject)
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `PSE - Résumé de formation` }
  ];
};


export default function FormationPseRoute() {
  const { formation, pseSummary } = useLoaderData<typeof loader>();

  return (
    <Page
      ariane={
        <Ariane>
          <ArianeItem label="PSE" href="pse" />
        </Ariane>
      }
      title={`PSE: ${formation.title} - Résumé de formation`}
      subtitle="Résumé de la formation pour tous les participants"
    >

      <Stack spacing={2}>
        <Section title="Résumé">
          <PseSummaryResult
            resultSummary={pseSummary.resultSummary}
          />
        </Section>

        <Section title="Cas concrets">
          <PseSummaryConcreteCaseSummary
            concreteCaseSummary={pseSummary.concreteCaseSummary}
          />
        </Section>

        <Section title="Techniques">
          <PseSummaryTechniqueSummary
            techniqueSummary={pseSummary.techniqueSummary}
          />
        </Section>

        <Section title="Travail préparatoire">
          <PseSummaryPreparatoryWorkSummary
            preparatoryWorkSummary={pseSummary.preparatoryWorkSummary}
          />
        </Section>
      </Stack>
    </Page>
  );
}