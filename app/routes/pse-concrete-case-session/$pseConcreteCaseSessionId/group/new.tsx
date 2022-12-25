import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import PseConcreteCaseGroupForm from "~/components/pse-concrete-case-group/PseConcreteCaseGroupForm";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseGroupPostDto } from "~/dto/pseconcretecasegroup.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseGroupPostDtoValidator } from "~/form/pseconcretecasegroup.form";
import { pseConcreteCaseGroupPostDtoToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { createPseConcreteCaseGroup } from "~/services/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';

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

  const result = await validateForm<PseConcreteCaseGroupPostDto>(request, pseConcreteCaseGroupPostDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }
	const postDto = result.data

  const postApiObject = pseConcreteCaseGroupPostDtoToApiObject(postDto)

  await createPseConcreteCaseGroup(postApiObject)

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
    title: `Nouveau groupe`,
  };
};

export default function PseConcreteCaseSessionNewGroupRoute() {
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  return (
    <PageContainer>
      <PageTitle title="Créer un groupe" />
      <Section>
        <PseConcreteCaseGroupForm 
          pseFormationId={pseFormation.id}
          pseConcreteCaseSessionId={pseConcreteCaseSession.id}
          actionData={actionData}
        />
      </Section>
    </PageContainer>
  );
}
