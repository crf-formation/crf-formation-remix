import Box from "@mui/material/Box";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useRef } from "react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import type { PseConcreteCaseSessionPostDto } from "~/dto/pseconcretecasesession.dto";
import { validateForm } from "~/form/abstract";
import { pseConcreteCaseSessionPostDtoValidator } from "~/form/pseconcretecasesession.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import { pseConcreteCaseSessionPostDtoToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { createPseConcreteCaseSession } from "~/service/pseconcretecasesession.server";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { formationId } = getParamsOrFail(params, ParamsSchema);

  const pseFormationApiObject = await findPseFormationById(formationId);

  if (!pseFormationApiObject) {
    throw new Error(`Formation not found: ${formationId}`);
  }

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject)
  });
}


export async function action({ request, params }: ActionArgs) {
  const { pseFormationApiObject } = await security(request, params);

  const result = await validateForm<PseConcreteCaseSessionPostDto>(request, pseConcreteCaseSessionPostDtoValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }
  const postDto = result.data;

  if (pseFormationApiObject.id !== postDto.formationId) {
    // TODO: error
  }

  const concreteCaseSessionApiObject = await createPseConcreteCaseSession(
    pseConcreteCaseSessionPostDtoToApiObject(postDto)
  );

  return redirect(`/pse-concrete-case-session/${concreteCaseSessionApiObject.id}`);
}

export default function ConcreteCaseSessionsRoute() {
  const { pseFormation } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    ["name", nameRef]
  ]);

  return (
    <Page
      title="Créer une session"
      subtitle="Créez une nouvelle session de cas concret"
      ariane={
        <Ariane>
          <ArianeItem label="PSE" href="/pse" />

          <ArianeItem
            label={pseFormation.title}
            href={`/pse/${pseFormation.id}`}
          />
        </Ariane>
      }
    >
      <Section sx={{ maxWidth: 720 }}>

        <FormView
          submitText="Créer"
          validator={pseConcreteCaseSessionPostDtoValidator}
        >
          <input type="hidden" name="formationId" value={pseFormation.id} />

          <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
            <FormTextField
              name="name"
              ref={nameRef}
              label="Nom de la session"
              variant="standard"
              margin="normal"
              type="string"
              required
              autoFocus
            />
          </Box>
        </FormView>
      </Section>
    </Page>
  );
}

