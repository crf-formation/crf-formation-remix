import type { ActionArgs, LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserMeApiObject } from "~/apiobject/user.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import PseConcreteCaseSituationEvaluateGroupForm
  from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationEvaluateGroupForm";
import type { PseUserConcreteCaseGroupEvaluationPostDto } from "~/dto/pseuserconcretecase.dto";
import { validateForm } from "~/form/abstract";
import { pseUserConcreteCaseGroupEvaluationPostDtoValidator } from "~/form/pseuserconcretecase.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { redirectActionToCurrentPage } from "~/helper/responses.helper";
import { pseCompetenceApiObjectToDto } from "~/mapper/psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import {
  pseUserConcreteCaseGroupEvaluationApiObjectToDto,
  pseUserConcreteCaseGroupEvaluationPostDtoToApiObject
} from "~/mapper/pseuserconcretecase.mapper";
import { addFlashMessage } from "~/service/flash.server";
import { getPseCompetences } from "~/service/psecompetence.server";
import { getPseConcreteCaseGroup } from "~/service/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import {
  getPseUserConcreteCaseGroupEvaluation,
  updatePseUserConcreteCaseGroupEvaluation
} from "~/service/pseuserconcretecase.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { commitSession, requireLoggedInRequestContext, requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string(),
  pseSituationConcreteCaseGroupId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseSituationApiObject: PseConcreteCaseSituationApiObject;
  pseConcreteCaseGroupApiObject: PseConcreteCaseGroupApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { pseConcreteCaseSituationId, pseSituationConcreteCaseGroupId } = getParamsOrFail(params, ParamsSchema);

  const pseConcreteCaseSituationApiObject = await getPseConcreteCaseSituation(pseConcreteCaseSituationId);

  const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSituationApiObject.pseConcreteCaseSessionId);

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);
  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  const pseConcreteCaseGroupApiObject = await getPseConcreteCaseGroup(pseSituationConcreteCaseGroupId);

  return {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject
  };
};

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject
  } = await security(request, params);

  const pseCompetenceApiObjects: Array<PseCompetenceApiObject> = await getPseCompetences();

  const pseUserConcreteCaseGroupEvaluationApiObject = await getPseUserConcreteCaseGroupEvaluation(
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject,
    pseCompetenceApiObjects
  );

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
    pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(pseConcreteCaseSituationApiObject),
    pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(pseConcreteCaseGroupApiObject),
    pseCompetences: pseCompetenceApiObjects.map(pseCompetenceApiObjectToDto),
    pseUserConcreteCaseGroupEvaluation: pseUserConcreteCaseGroupEvaluationApiObjectToDto(pseUserConcreteCaseGroupEvaluationApiObject)
  });
}

export async function action({ request, params }: ActionArgs) {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject,
    pseConcreteCaseGroupApiObject
  } = await security(request, params);

  // TODO: session must be RUNNING

  const result = await validateForm<PseUserConcreteCaseGroupEvaluationPostDto>(request, pseUserConcreteCaseGroupEvaluationPostDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }

  const pseUserConcreteCaseGroupEvaluationPostDto: PseUserConcreteCaseGroupEvaluationPostDto = result.data;

  if (pseUserConcreteCaseGroupEvaluationPostDto.formationId !== pseFormationApiObject.id) {
    throw new Error(`Forbidden`);
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSituationId !== pseConcreteCaseSituationApiObject.id) {
    throw new Error(`Forbidden`);
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSessionId !== pseConcreteCaseSessionApiObject.id) {
    throw new Error(`Forbidden`);
  }

  if (pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseGroupId !== pseConcreteCaseGroupApiObject.id) {
    throw new Error(`Forbidden`);
  }

  await updatePseUserConcreteCaseGroupEvaluation(
    pseUserConcreteCaseGroupEvaluationPostDtoToApiObject(pseUserConcreteCaseGroupEvaluationPostDto)
  );

  const session = await addFlashMessage(
    request,
    "success",
    `L'évaluation a été mise à jour`
  );

  return redirectActionToCurrentPage(request, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Situation ${data?.pseConcreteCaseSituation?.pseConcreteCaseType?.name}` }
  ];
};

export default function PseConcreteCaseSituationRoute() {
  const {
    pseFormation,
    pseConcreteCaseSession,
    pseConcreteCaseSituation,
    pseConcreteCaseGroup,
    pseUserConcreteCaseGroupEvaluation
  } = useLoaderData<typeof loader>();

  return (
    <Page
      title={`Évaluation ${pseConcreteCaseSituation?.pseConcreteCaseType?.name} - ${pseConcreteCaseGroup.name}`}
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
      <Section>
        <PseConcreteCaseSituationEvaluateGroupForm
          pseUserConcreteCaseGroupEvaluation={pseUserConcreteCaseGroupEvaluation}
        />
      </Section>
    </Page>
  );
}
