import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/component/layout/PageContainer";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import PseConcreteCaseSituationForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationForm";
import type { SecurityFunction } from "~/constant/remix";
import type { PseConcreteCaseSituationPutDto } from "~/dto/pseconcretecasesituation.dto";
import { pseConcreteCaseSituationPutDtoValidator } from "~/form/pseconcretecasesituation.form";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationApiObjectToDto, pseConcreteCaseSituationPutDtoToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituation, updatePseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getParamsOrFail } from '~/util/remix.params';

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
  const { pseFormationApiObject, pseConcreteCaseSessionApiObject, pseConcreteCaseSituationApiObject } = await security(request, params)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
		pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(pseConcreteCaseSituationApiObject),
	});
};

export async function action({ request, params  }: ActionArgs) {
  const { pseConcreteCaseSituationApiObject, pseConcreteCaseSessionApiObject } = await security(request, params)

  const result = await pseConcreteCaseSituationPutDtoValidator.validate(
    await request.formData()
  );

  if (result.error) {
    return validationError(result.error);
  }

  const putDto = result.data as PseConcreteCaseSituationPutDto;

  const putApiObject = pseConcreteCaseSituationPutDtoToApiObject(putDto, pseConcreteCaseSituationApiObject, pseConcreteCaseSessionApiObject.id)

  await updatePseConcreteCaseSituation(pseConcreteCaseSituationApiObject.id, putApiObject)

  return redirect(`/pse-concrete-case-situation/${pseConcreteCaseSituationApiObject.id}`)
}

const security: SecurityFunction<{
  userApiObject: UserApiObject;
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseSituationApiObject: PseConcreteCaseSituationApiObject;
}> = async (request: Request, params: Params) => {
  const { pseConcreteCaseSituationId } = getParamsOrFail(params, ParamsSchema)

  const userApiObject = await requireUser(request)

  const pseConcreteCaseSituationApiObject = await getPseConcreteCaseSituation(pseConcreteCaseSituationId)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSituationApiObject.pseConcreteCaseSessionId)

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    userApiObject,
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Situation ${data?.pseConcreteCaseSituation?.pseConcreteCaseType?.name}`,
  };
};

export default function PseConcreteCaseSituationRoute() {
  const { pseFormation, pseConcreteCaseSession, pseConcreteCaseSituation } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  return (
    <PageContainer>
      <PageTitle title={`Situation ${pseConcreteCaseSituation?.pseConcreteCaseType?.name}`} />
      <Section>
        <PseConcreteCaseSituationForm
          pseFormationId={pseFormation.id}
          pseConcreteCaseSessionId={pseConcreteCaseSession.id}
          pseConcreteCaseGroups={pseConcreteCaseSession.pseConcreteCaseGroups}
          actionData={actionData}
        	// edit data
					isEdit
          teacher={pseConcreteCaseSituation.teacher}
          pseConcreteCaseType={pseConcreteCaseSituation.pseConcreteCaseType}
          pseSituationConcreteCaseGroups={pseConcreteCaseSituation.pseSituationConcreteCaseGroups}
        />
      </Section>
    </PageContainer>
  );
}