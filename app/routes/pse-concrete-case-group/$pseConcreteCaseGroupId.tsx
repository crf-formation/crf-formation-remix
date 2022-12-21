import type { ActionArgs, LoaderFunction, MetaFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params} from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from '~/utils/remix.params';
import type { PseConcreteCaseGroupPutDto, PseUserConcreteCaseGroupStudentDto } from "~/dto/pseconcretecasegroup.dto";
import Section from "~/components/layout/Section";
import PageTitle from "~/components/layout/PageTitle";
import { pseConcreteCaseGroupPutDtoToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { getPseConcreteCaseGroup, updatePseConcreteCaseGroup } from "~/services/pseconcretecasegroup.server";
import { pseConcreteCaseGroupApiObjectToDto } from '../../mapper/pseconcretecasegroup.mapper';
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import PseConcreteCaseGroupForm from "~/components/pse-concrete-case-group/PseConcreteCaseGroupForm";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { SecurityFunction } from "~/constants/remix";

const ParamsSchema = z.object({
  pseConcreteCaseGroupId: z.string(),
});

// GET a formation
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

const PutSchema = z.object({
	name: z.string(),
  students: z.array(z.string())
});

export async function action({ request, params  }: ActionArgs) {
  const { pseConcreteCaseGroupApiObject } = await security(request, params)

  const result = await getFormData(request, PutSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }
	const putDto = result.data as PseConcreteCaseGroupPutDto

  const putApiObject = pseConcreteCaseGroupPutDtoToApiObject(putDto)

  const updatedApiObject = await updatePseConcreteCaseGroup(pseConcreteCaseGroupApiObject.id, putApiObject)
  console.log(JSON.stringify({ updatedApiObject }, null, 2))

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
