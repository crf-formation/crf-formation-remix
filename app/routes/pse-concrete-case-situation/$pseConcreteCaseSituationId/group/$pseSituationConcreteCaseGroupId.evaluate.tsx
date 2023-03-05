import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
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
import { Ariane, ArianeItem } from '~/component/layout/Ariane';
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from '~/component/layout/PagePaperHeader';
import PageSpace from "~/component/layout/PageSpace";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import PseConcreteCaseSituationEvaluateGroupForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationEvaluateGroupForm";
import type { SecurityFunction } from "~/constant/remix";
import type { PseUserConcreteCaseGroupEvaluationPostDto } from "~/dto/pseuserconcretecase.dto";
import { validateForm } from "~/form/abstract";
import { pseUserConcreteCaseGroupEvaluationPostDtoValidator } from "~/form/pseuserconcretecase.form";
import { buildPseUserConcreteCaseGroupEvaluation } from "~/helper/pseuserconcretecase.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { redirectActionToCurrentPage } from "~/helper/responses.helper";
import { pseCompetenceApiObjectToDto } from "~/mapper/psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseUserConcreteCaseGroupEvaluationApiObjectToDto, pseUserConcreteCaseGroupEvaluationPostDtoToApiObject } from "~/mapper/pseuserconcretecase.mapper";
import { getPseCompetences } from "~/service/psecompetence.server";
import { getPseConcreteCaseGroup } from "~/service/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { updatePseUserConcreteCaseGroupEvaluation } from "~/service/pseuserconcretecase.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string(),
	pseSituationConcreteCaseGroupId: z.string(),
});

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

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject,
  } = await security(request, params);

	const pseCompetenceApiObjects: Array<PseCompetenceApiObject> = await getPseCompetences();

  const pseUserConcreteCaseGroupEvaluationApiObject = buildPseUserConcreteCaseGroupEvaluation(
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject,
    pseCompetenceApiObjects
  )

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
		pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(pseConcreteCaseSituationApiObject),
		pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(pseConcreteCaseGroupApiObject),
    pseCompetences: pseCompetenceApiObjects.map(pseCompetenceApiObjectToDto),
    pseUserConcreteCaseGroupEvaluation: pseUserConcreteCaseGroupEvaluationApiObjectToDto(pseUserConcreteCaseGroupEvaluationApiObject)
	});
};

export async function action({ request, params  }: ActionArgs) {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject,
  } = await security(request, params);

  // TODO: session must be RUNNING

  const result = await validateForm<PseUserConcreteCaseGroupEvaluationPostDto>(request, pseUserConcreteCaseGroupEvaluationPostDtoValidator)
  if (result.errorResponse) {
    return result.errorResponse
  }

  const pseUserConcreteCaseGroupEvaluationPostDto: PseUserConcreteCaseGroupEvaluationPostDto = result.data

  if (pseUserConcreteCaseGroupEvaluationPostDto.formationId !== pseFormationApiObject.id) {
    throw new Error(`Forbidden`)
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSituationId !== pseConcreteCaseSituationApiObject.id) {
    throw new Error(`Forbidden`)
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSessionId !== pseConcreteCaseSessionApiObject.id) {
    throw new Error(`Forbidden`)
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseGroupId !== pseConcreteCaseGroupApiObject.id) {
    throw new Error(`Forbidden`)
  }

  await updatePseUserConcreteCaseGroupEvaluation(
    pseUserConcreteCaseGroupEvaluationPostDtoToApiObject(pseUserConcreteCaseGroupEvaluationPostDto)
  )

  return redirectActionToCurrentPage(request);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Situation ${data?.pseConcreteCaseSituation?.pseConcreteCaseType?.name}`,
  };
};

export default function PseConcreteCaseSituationRoute() {
  const {
    pseFormation,
    pseConcreteCaseSession,
    pseConcreteCaseSituation,
    pseConcreteCaseGroup,
    pseUserConcreteCaseGroupEvaluation,
  } = useLoaderData<typeof loader>();

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
            pseUserConcreteCaseGroupEvaluation={pseUserConcreteCaseGroupEvaluation}
          />
        </Section>
      </PageContainer>
    </>
  );
}