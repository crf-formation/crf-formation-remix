import type { ActionArgs, LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import PseConcreteCaseSituationForm from "~/component/pse-concrete-case-situation/PseConcreteCaseSituationForm";
import type { PseConcreteCaseSituationPutDto } from "~/dto/pseconcretecasesituation.dto";
import { pseConcreteCaseSituationPutDtoValidator } from "~/form/pseconcretecasesituation.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import {
  pseConcreteCaseSituationApiObjectToDto,
  pseConcreteCaseSituationPutDtoToApiObject
} from "~/mapper/pseconcretecasesituation.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById } from "~/service/pseconcretecasesession.server";
import { getPseConcreteCaseSituation, updatePseConcreteCaseSituation } from "~/service/pseconcretecasesituation.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  pseConcreteCaseSituationId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  pseConcreteCaseSessionApiObject: PseConcreteCaseSessionApiObject;
  pseConcreteCaseSituationApiObject: PseConcreteCaseSituationApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { pseConcreteCaseSituationId } = getParamsOrFail(params, ParamsSchema);
  const pseConcreteCaseSituationApiObject = await getPseConcreteCaseSituation(pseConcreteCaseSituationId);

  const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSituationApiObject.pseConcreteCaseSessionId);

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id);
  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject
  };
};

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
    pseConcreteCaseSituationApiObject
  } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject),
    pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(pseConcreteCaseSituationApiObject)
  });
};

export async function action({ request, params }: ActionArgs) {
  const { pseConcreteCaseSituationApiObject, pseConcreteCaseSessionApiObject } = await security(request, params);

  const result = await pseConcreteCaseSituationPutDtoValidator.validate(
    await request.formData()
  );

  if (result.error) {
    return validationError(result.error);
  }

  const putDto = result.data as PseConcreteCaseSituationPutDto;

  const putApiObject = pseConcreteCaseSituationPutDtoToApiObject(putDto, pseConcreteCaseSituationApiObject, pseConcreteCaseSessionApiObject.id);

  await updatePseConcreteCaseSituation(pseConcreteCaseSituationApiObject.id, putApiObject);

  return redirect(`/pse-concrete-case-situation/${pseConcreteCaseSituationApiObject.id}`);
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Situation ${data?.pseConcreteCaseSituation?.pseConcreteCaseType?.name}` }
  ];
};

export default function PseConcreteCaseSituationRoute() {
  const { pseFormation, pseConcreteCaseSession, pseConcreteCaseSituation } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  return (
    <Page
      title={`Situation ${pseConcreteCaseSituation?.pseConcreteCaseType?.name}`}
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
        // edit data
        isEdit
        teacher={pseConcreteCaseSituation.teacher}
        pseConcreteCaseType={pseConcreteCaseSituation.pseConcreteCaseType}
        pseSituationConcreteCaseGroups={
          pseConcreteCaseSituation.pseSituationConcreteCaseGroups
        }
      />

    </Page>
  );
}
