import type { ActionArgs, LoaderFunction, MetaFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params} from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from '~/utils/remix.params';
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import type { PseConcreteCaseGroupPostDto } from "~/dto/pseconcretecasegroup.dto";
import Section from "~/components/layout/Section";
import PageTitle from "~/components/layout/PageTitle";
import { pseConcreteCaseGroupPostDtoToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { createPseConcreteCaseGroup } from "~/services/pseconcretecasegroup.server";
import PseConcreteCaseGroupForm from "~/components/pse-concrete-case-group/PseConcreteCaseGroupForm";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { SecurityFunction } from "~/constants/remix";

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

const PostSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
	name: z.string(),
  students: z.array(z.string())
});

export async function action({ request, params  }: ActionArgs) {
	const { pseConcreteCaseSessionApiObject } = await security(request, params)

  const result = await getFormData(request, PostSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }
	const postDto = result.data as PseConcreteCaseGroupPostDto

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
