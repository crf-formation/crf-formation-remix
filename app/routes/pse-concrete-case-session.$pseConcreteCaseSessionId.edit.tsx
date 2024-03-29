import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import FormErrorHelperText from "~/component/form/FormErrorHelperText";
import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import PseConcreteCaseSessionStateAutocomplete
  from "~/component/pse-concrete-case-session/PseConcreteCaseSessionStateAutocomplete";
import type { PseConcreteCaseSessionPutDto } from "~/dto/pseconcretecasesession.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseSessionPutDtoValidator } from "~/form/pseconcretecasesession.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import {
  pseConcreteCaseSessionApiObjectToDto,
  pseConcreteCaseSessionPutDtoToApiObject
} from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById, updatePseConcreteCaseSession } from "~/service/pseconcretecasesession.server";
import { getPseFormationByPseConcreteCaseSessionId } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { generateAria } from "~/util/form";
import { requireLoggedInRequestContext } from "~/service/session.server";

// update PSE concrete case session

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

export const loader: LoaderFunction = async ({ request, params }) => {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject
  } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(
      pseConcreteCaseSessionApiObject
    )
  });
};

export async function action({ request, params }: ActionArgs) {
  const { pseConcreteCaseSessionApiObject } = await security(request, params);

  const result = await validateForm<PseConcreteCaseSessionPutDto>(request, pseConcreteCaseSessionPutDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }
  const putDto = result.data;

  const concreteCaseSessionApiObject = await updatePseConcreteCaseSession(
    pseConcreteCaseSessionApiObject.id,
    pseConcreteCaseSessionPutDtoToApiObject(putDto)
  );

  return redirect(`/pse-concrete-case-session/${concreteCaseSessionApiObject.id}`);
}

export default function SessionPseRoute() {
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    ["name", nameRef],
    ["state", stateRef]
  ]);

  return (
    <Page
      title={pseConcreteCaseSession.name}
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
    >

      <Section>
        <FormView
          submitText="Valider"
          validator={pseConcreteCaseSessionPutDtoValidator}
        >
          <FormTextField
            name="name"
            ref={nameRef}
            defaultValue={pseConcreteCaseSession.name}
            label="Nom de la session"
            variant="standard"
            margin="normal"
            type="string"
            autoFocus
          />

          <PseConcreteCaseSessionStateAutocomplete
            name="state"
            ref={stateRef}
            defaultValue={pseConcreteCaseSession.state}
            label="Status"
            variant="standard"
            margin="normal"
            type="string"
            required
            autoFocus
            {...generateAria(actionData, "state")}
          />
          <FormErrorHelperText name="state" actionData={actionData} />
        </FormView>
      </Section>

    </Page>
  );
}
