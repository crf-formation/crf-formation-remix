import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/component/layout/PageContainer";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import PseConcreteCaseSituationForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationForm";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseSituationPostDto } from "~/dto/pseconcretecasesituation.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseSituationPostDtoValidator } from "~/form/pseconcretecasesituation.form";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationPostDtoToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { createPseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getParamsOrFail } from '~/util/remix.params';

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { pseFormationApiObject, pseConcreteCaseSessionApiObject } = await security(request, params)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
	});
};

export async function action({ request, params  }: ActionArgs) {
	const { pseConcreteCaseSessionApiObject } = await security(request, params)

  const result = await validateForm<PseConcreteCaseSituationPostDto>(request, pseConcreteCaseSituationPostDtoValidator)
  if (result.errorResponse) {
    return result.errorResponse
  }
	const postDto = result.data

  const postApiObject = pseConcreteCaseSituationPostDtoToApiObject(postDto)

  await createPseConcreteCaseSituation(postApiObject)

  return redirect(`/pse-concrete-case-session/${pseConcreteCaseSessionApiObject.id}`)
}

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
    pseConcreteCaseSessionApiObject,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Nouvelle situation`,
  };
};

export default function PseConcreteCaseSessionNewSituationRoute() {
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  return (
    <PageContainer>
      <PageTitle title="Créer une situation" />
      <Section>
        <PseConcreteCaseSituationForm 
          pseFormationId={pseFormation.id}
          pseConcreteCaseSessionId={pseConcreteCaseSession.id}
          pseConcreteCaseGroups={pseConcreteCaseSession.pseConcreteCaseGroups}
          actionData={actionData}
        />
      </Section>
    </PageContainer>
  );
}
