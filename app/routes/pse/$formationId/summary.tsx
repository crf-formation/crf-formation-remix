import { Stack } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from '~/apiobject/pseformation.apiobject';
import type { PseSummaryApiObject } from "~/apiobject/psesummary.apiobject";
import { Ariane, ArianeItem } from '~/component/layout/Ariane';
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from '~/component/layout/PagePaperHeader';
import PageSpace from '~/component/layout/PageSpace';
import PageSubtitle from '~/component/layout/PageSubtitle';
import PageTitle from '~/component/layout/PageTitle';
import Section from "~/component/layout/Section";
import PseSummaryConcreteCaseSummary from "~/component/pse-summary/PseSummaryConcreteCaseSummary";
import PseSummaryPreparatoryWorkSummary from "~/component/pse-summary/PseSummaryPreparatoryWorkSummary";
import PseSummaryResult from "~/component/pse-summary/PseSummaryResult";
import PseSummaryTechniqueSummary from "~/component/pse-summary/PseSummaryTechniqueSummary";
import type { SecurityFunction } from '~/constant/remix';
import { loadAndBuildPseSummary } from "~/helper/psesummary.helper";
import { getParamsOrFail } from '~/helper/remix.params.helper';
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseSummaryApiObjectToDto } from "~/mapper/psesummary.mapper";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}
	
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    pseFormationApiObject,
  }
}

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params)

  const pseSummaryApiObject: PseSummaryApiObject = await loadAndBuildPseSummary(pseFormationApiObject)

  return json({
		formation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseSummary: pseSummaryApiObjectToDto(pseSummaryApiObject),
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - Follow up`,
  };
};

export default function FromationPseRoute() {
  const { formation, pseSummary } = useLoaderData<typeof loader>();

  return (
    <>
      <PagePaperHeader
        ariane={
          <Ariane>
            <ArianeItem label="PSE" href="pse" />
          </Ariane>
        }
      >
        <PageTitle title={`PSE: ${formation.title} - Résumé de formation`} />
        <PageSubtitle subtitle="Résumé de la formation pour tous les participants" />
      </PagePaperHeader>

      <PageSpace variant="header" />

      <PageContainer>
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
      </PageContainer>
    </>
  );
}