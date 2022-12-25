import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import FormTextField from "~/components/form/FormTextField";
import FormView from "~/components/form/FormView";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import PseConcreteCaseSessionStateAutocomplete from "~/components/pse-concrete-case-session/PseConcreteCaseSessionStateAutocomplete";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseSessionPutDto } from "~/dto/pseconcretecasesession.dto";
import { validateForm } from '~/form/abstract';
import { pseConcreteCaseSessionPutDtoValidator } from "~/form/pseconcretecasesession.form";
import useFormFocusError from "~/hooks/useFormFocusError";
import { pseConcreteCaseSessionApiObjectToDto, pseConcreteCaseSessionPutDtoToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseConcreteCaseSessionById, updatePseConcreteCaseSession } from "~/services/pseconcretecasesession.server";
import { getPseFormationByPseConcreteCaseSessionId } from '~/services/pseformation.server';
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { generateAria } from "~/utils/form";
import { getParamsOrFail } from '~/utils/remix.params';

// update PSE concrete case session

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const {
    pseFormationApiObject,
    pseConcreteCaseSessionApiObject,
  } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(
      pseConcreteCaseSessionApiObject
    ),
  });
};

export async function action({ request, params }: ActionArgs) {
	const { pseConcreteCaseSessionApiObject } = await security(request, params)

	const result = await validateForm<PseConcreteCaseSessionPutDto>(request, pseConcreteCaseSessionPutDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }
	const putDto = result.data 

	const concreteCaseSessionApiObject = await updatePseConcreteCaseSession(
		pseConcreteCaseSessionApiObject.id,
		pseConcreteCaseSessionPutDtoToApiObject(putDto)
	)

	return redirect(`/pse-concrete-case-session/${concreteCaseSessionApiObject.id}`);
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
    pseConcreteCaseSessionApiObject
  }
}

export default function SessionPseRoute() {
  const { pseConcreteCaseSession } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);

	useFormFocusError(actionData, [ 
		[ 'name', nameRef ],
		[ 'state', stateRef ],
	])

  return (
    <PageContainer>
      <PageTitle title={pseConcreteCaseSession.name} />

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
						{...generateAria(actionData, 'state')}
          />
          <FormErrorHelperText name="state" actionData={actionData} />
        </FormView>
      </Section>
    </PageContainer>
  );
}
