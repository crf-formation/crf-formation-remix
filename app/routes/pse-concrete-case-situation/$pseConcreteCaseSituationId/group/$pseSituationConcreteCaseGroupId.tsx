import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import PseConcreteCaseSituationEvaluateGroupForm from "~/components/pse-concrete-case-situation/PseConcreteCaseSituationEvaluateGroupForm";
import type { SecurityFunction } from "~/constants/remix";
import { pseCompetenceApiObjectToDto } from "~/mapper/psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseCompetences } from "~/services/psecompetence.server";
import { getPseConcreteCaseGroup } from "~/services/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { getPseConcreteCaseSituation } from "~/services/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string(),
	pseSituationConcreteCaseGroupId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
  const { pseFormationApiObject, pseConcreteCaseSessionApiObject, pseConcreteCaseSituationApiObject, pseConcreteCaseGroupApiObject } = await security(request, params)
	const pseCompetences: Array<PseCompetenceApiObject> = await getPseCompetences();

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
		pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(pseConcreteCaseSituationApiObject),
		pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(pseConcreteCaseGroupApiObject),
    pseCompetences: pseCompetences.map(pseCompetenceApiObjectToDto),
	});
};

export async function action({ request, params  }: ActionArgs) {
  // TODO: session must be RUNNING
}

const security: SecurityFunction<{
  userApiObject: UserApiObject;
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseSituationApiObject: PseConcreteCaseSituationApiObject;
	pseConcreteCaseGroupApiObject: PseConcreteCaseGroupApiObject;
}> = async (request: Request, params: Params) => {
  const { pseConcreteCaseSituationId, pseSituationConcreteCaseGroupId } = getParamsOrFail(params, ParamsSchema)

  const userApiObject = await requireUser(request)

  const pseConcreteCaseSituationApiObject = await getPseConcreteCaseSituation(pseConcreteCaseSituationId)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSituationApiObject.pseConcreteCaseSessionId)

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

	const pseConcreteCaseGroupApiObject = await getPseConcreteCaseGroup(pseSituationConcreteCaseGroupId);

  return {
    userApiObject,
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
		pseConcreteCaseGroupApiObject,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Situation ${data?.pseConcreteCaseSituation?.pseConcreteCaseType?.name}`,
  };
};

export default function PseConcreteCaseSituationRoute() {
  const { pseCompetences, pseConcreteCaseSituation, pseConcreteCaseGroup } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <PageTitle title={`Évaluation ${pseConcreteCaseSituation?.pseConcreteCaseType?.name} - ${pseConcreteCaseGroup.name}`} />
      <Section>
				<PseConcreteCaseSituationEvaluateGroupForm 
          pseConcreteCaseGroup={pseConcreteCaseGroup} 
          pseConcreteCaseSituation={pseConcreteCaseSituation} 
          pseCompetences={pseCompetences} 
        />
      </Section>
    </PageContainer>
  );
}
