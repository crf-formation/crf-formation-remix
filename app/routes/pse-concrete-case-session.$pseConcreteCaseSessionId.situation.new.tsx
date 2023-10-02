import type { ActionArgs, LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import PseConcreteCaseSituationForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationForm";
import type { PseConcreteCaseSituationPostDto } from "~/dto/pseconcretecasesituation.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseSituationPostDtoValidator } from "~/form/pseconcretecasesituation.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseConcreteCaseSituationPostDtoToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { createPseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema);

  const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId);

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);
  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject
  };
};

export async function loader(
  {
    request,
    params
  }: LoaderArgs) {
  const { pseFormationApiObject, pseConcreteCaseSessionApiObject } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
  });
};

export async function action({ request, params }: ActionArgs) {
  const { pseConcreteCaseSessionApiObject } = await security(request, params);

  const result = await validateForm<PseConcreteCaseSituationPostDto>(request, pseConcreteCaseSituationPostDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }
  const postDto = result.data;

  const postApiObject = pseConcreteCaseSituationPostDtoToApiObject(postDto);

  await createPseConcreteCaseSituation(postApiObject);

  return redirect(`/pse-concrete-case-session/${pseConcreteCaseSessionApiObject.id}`);
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Nouvelle situation` }
  ];
};

export default function PseConcreteCaseSessionNewSituationRoute() {
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  return (
    <Page
      title="Nouvelle situation"
      subtitle={`Créez une situation pour la session ${pseConcreteCaseSession.name}`}
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
        </Ariane>
      }
    >

      <PseConcreteCaseSituationForm
        pseFormationId={pseFormation.id}
        pseConcreteCaseSessionId={pseConcreteCaseSession.id}
        pseConcreteCaseGroups={pseConcreteCaseSession.pseConcreteCaseGroups}
        actionData={actionData}
      />

    </Page>
  );
}
