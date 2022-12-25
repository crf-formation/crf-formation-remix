import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import PseConcreteCaseGroupForm from "~/components/pse-concrete-case-group/PseConcreteCaseGroupForm";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseGroupPutDto, PseUserConcreteCaseGroupStudentDto } from "~/dto/pseconcretecasegroup.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseGroupPutDtoValidator } from "~/form/pseconcretecasegroup.form";
import { pseConcreteCaseGroupPutDtoToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseGroup, updatePseConcreteCaseGroup } from "~/services/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';
import { pseConcreteCaseGroupApiObjectToDto } from '../../mapper/pseconcretecasegroup.mapper';

const ParamsSchema = z.object({
  pseConcreteCaseGroupId: z.string(),
});

export const loader: LoaderFunction = async ({
  request,
	params
}) => {
  const { pseFormationApiObject, pseConcreteCaseSessionApiObject, pseConcreteCaseGroupApiObject } = await security(request, params)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
		pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(pseConcreteCaseGroupApiObject),
	});
};

export async function action({ request, params  }: ActionArgs) {
  const { pseConcreteCaseGroupApiObject } = await security(request, params)

  const result = await validateForm<PseConcreteCaseGroupPutDto>(request, pseConcreteCaseGroupPutDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }
	const putDto = result.data

  const putApiObject = pseConcreteCaseGroupPutDtoToApiObject(putDto)

  await updatePseConcreteCaseGroup(pseConcreteCaseGroupApiObject.id, putApiObject)

  return redirect(`/pse-concrete-case-group/${pseConcreteCaseGroupApiObject.id}`)
}

const security: SecurityFunction<{
  userApiObject: UserApiObject;
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseGroupApiObject: PseConcreteCaseGroupApiObject;
}> = async (request: Request, params: Params) => {
  const { pseConcreteCaseGroupId } = getParamsOrFail(params, ParamsSchema)

  const userApiObject = await requireUser(request)

  const pseConcreteCaseGroupApiObject = await getPseConcreteCaseGroup(pseConcreteCaseGroupId)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseGroupApiObject.pseConcreteCaseSessionId)

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    userApiObject,
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseGroupApiObject
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Groupe ${data?.pseConcreteCaseGroup?.name}`,
  };
};

export default function PseConcreteCaseGroupRoute() {
  const { pseFormation, pseConcreteCaseSession, pseConcreteCaseGroup } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  return (
    <PageContainer>
      <PageTitle title={`Groupe ${pseConcreteCaseGroup?.name}`} />
      <Section>
        <PseConcreteCaseGroupForm
					isEdit
          name={pseConcreteCaseGroup.name}
          students={pseConcreteCaseGroup.students?.map((student: PseUserConcreteCaseGroupStudentDto) => student.user)}
          pseFormationId={pseFormation.id}
          pseConcreteCaseSessionId={pseConcreteCaseSession.id}
          actionData={actionData}
        />
      </Section>
    </PageContainer>
  );
}
