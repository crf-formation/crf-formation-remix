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
import PageContainer from "~/component/layout/PageContainer";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import PseConcreteCaseSituationEvaluateGroupForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationEvaluateGroupForm";
import type { SecurityFunction } from "~/constant/remix";
import { pseCompetenceApiObjectToDto } from "~/mapper/psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseCompetences } from "~/service/psecompetence.server";
import { getPseConcreteCaseGroup } from "~/service/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getParamsOrFail } from '~/util/remix.params';
import PagePaperHeader from '~/component/layout/PagePaperHeader';
import { Ariane, ArianeItem } from '~/component/layout/Ariane';
import PageSpace from "~/component/layout/PageSpace";

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string(),
	pseSituationConcreteCaseGroupId: z.string(),
});

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
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
  const { pseFormation, pseCompetences, pseConcreteCaseSession, pseConcreteCaseSituation, pseConcreteCaseGroup } = useLoaderData<typeof loader>();

  return (
    <>
      <PagePaperHeader
        ariane={
          <Ariane>
            <ArianeItem label="PSE" href="pse" />

            <ArianeItem
              label={pseFormation.title}
              href={`/pse/${pseFormation.id}`}
            />

            <ArianeItem
              label="Sessions"
              href={`/pse/${pseFormation.id}/concrete-case/session`}
            />

            <ArianeItem
              label={pseConcreteCaseSession.name}
              href={`/pse-concrete-case-session/${pseConcreteCaseSession.id}`}
            />

            <ArianeItem
              label="Situations"
              href={`/pse-concrete-case-session/${pseConcreteCaseSession.id}`}
            />

            <ArianeItem
              label={pseConcreteCaseSituation.pseConcreteCaseType?.name}
              href={`/pse-concrete-case-situation/${pseConcreteCaseSituation.id}`}
            />
          </Ariane>
        }
      >
        <PageTitle
          title={`Évaluation ${pseConcreteCaseSituation?.pseConcreteCaseType?.name} - ${pseConcreteCaseGroup.name}`}
        />
      </PagePaperHeader>

      <PageSpace variant="header" />

      <PageContainer>
        <Section>
          <PseConcreteCaseSituationEvaluateGroupForm
            formationId={pseFormation.id}
            pseConcreteCaseGroup={pseConcreteCaseGroup}
            pseConcreteCaseSituation={pseConcreteCaseSituation}
            pseCompetences={pseCompetences}
          />
        </Section>
      </PageContainer>
    </>
  );
}
