import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { validationError } from "remix-validated-form";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import PseConcreteCaseSituationForm from "~/components/pse-concrete-case-situation/PseConcreteCaseSituationForm";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseSituationPutDto } from "~/dto/pseconcretecasesituation.dto";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationPutDtoToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { getPseConcreteCaseSituation, updatePseConcreteCaseSituation } from "~/services/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';
import { pseConcreteCaseSituationApiObjectToDto } from '~/mapper/pseconcretecasesituation.mapper';
import { pseConcreteCaseSituationPutDtoValidator } from "~/form/pseconcretecasesituation.form";

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

  const updatedApiObject = await updatePseConcreteCaseSituation(pseConcreteCaseSituationApiObject.id, putApiObject)
  console.log(JSON.stringify({ updatedApiObject }, null, 2))

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
