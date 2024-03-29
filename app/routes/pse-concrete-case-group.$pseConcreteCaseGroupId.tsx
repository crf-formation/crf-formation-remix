import type { ActionArgs, LoaderFunction , V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import PseConcreteCaseGroupForm from "~/component/pse-concrete-case-group/PseConcreteCaseGroupForm";
import type { PseConcreteCaseGroupPutDto, PseUserConcreteCaseGroupStudentDto } from "~/dto/pseconcretecasegroup.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseGroupPutDtoValidator } from "~/form/pseconcretecasegroup.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import {
  pseConcreteCaseGroupApiObjectToDto,
  pseConcreteCaseGroupPutDtoToApiObject
} from "~/mapper/pseconcretecasegroup.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseGroup, updatePseConcreteCaseGroup } from "~/service/pseconcretecasegroup.server";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  pseConcreteCaseGroupId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseGroupApiObject: PseConcreteCaseGroupApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { pseConcreteCaseGroupId } = getParamsOrFail(params, ParamsSchema);
  const pseConcreteCaseGroupApiObject = await getPseConcreteCaseGroup(pseConcreteCaseGroupId);

  const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseGroupApiObject.pseConcreteCaseSessionId);

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);
  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseGroupApiObject
  };
};

export const loader: LoaderFunction = async (
  {
    request,
    params
  }) => {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseGroupApiObject
  } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
    pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(pseConcreteCaseGroupApiObject)
  });
};

export async function action({ request, params }: ActionArgs) {
  const { pseConcreteCaseGroupApiObject } = await security(request, params);

  const result = await validateForm<PseConcreteCaseGroupPutDto>(request, pseConcreteCaseGroupPutDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }
  const putDto = result.data;

  const putApiObject = pseConcreteCaseGroupPutDtoToApiObject(putDto);

  await updatePseConcreteCaseGroup(pseConcreteCaseGroupApiObject.id, putApiObject);

  return redirect(`/pse-concrete-case-group/${pseConcreteCaseGroupApiObject.id}`);
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Groupe ${data?.pseConcreteCaseGroup?.name}` }
  ];
};

export default function PseConcreteCaseGroupRoute() {
  const { pseFormation, pseConcreteCaseSession, pseConcreteCaseGroup } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  return (
    <Page
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
        </Ariane>
      }
      title={`Groupe ${pseConcreteCaseGroup?.name}`}
      subtitle={`Détail du groupe pour la session ${pseConcreteCaseSession.name}`}
    >

      <Section>
        <PseConcreteCaseGroupForm
          isEdit
          name={pseConcreteCaseGroup.name}
          students={pseConcreteCaseGroup.students?.map(
            (student: PseUserConcreteCaseGroupStudentDto) => student.user
          )}
          pseFormationId={pseFormation.id}
          pseConcreteCaseSessionId={pseConcreteCaseSession.id}
          actionData={actionData}
        />
      </Section>

    </Page>
  );
}
