
import { Button, Box, TextField } from "@mui/material";
import type { Params} from "@remix-run/react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRef, useEffect } from "react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import Callout from "~/components/typography/Callout";
import type { SecurityFunction } from "~/constants/remix";
import type { PseConcreteCaseSessionPostDto } from "~/dto/pseconcretecasesession.dto";
import { pseConcreteCaseSessionPostDtoToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { createPseConcreteCaseSession } from "~/services/pseconcretecasesession.server";
import { findPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
});

export async function loader({ request, params }: LoaderArgs) {
	const { pseFormationApiObject } = await security(request, params)

  return json({
    formationId: pseFormationApiObject.id,
  })
}

const PostSchema = z.object({
  formationId: z.string(),
	name: z.string(),
});

export async function action({ request, params }: ActionArgs) {
	const { pseFormationApiObject } = await security(request, params)

	const result = await getFormData(request, PostSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }
	const postDto = result.data as PseConcreteCaseSessionPostDto

	if (pseFormationApiObject.id !== postDto.formationId) {
		// TODO: error
	}

	const concreteCaseSessionApiObject = await createPseConcreteCaseSession(
		pseConcreteCaseSessionPostDtoToApiObject(postDto)
	)

	return redirect(`/pse-concrete-case-session/${concreteCaseSessionApiObject.id}`);
}

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}
	
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    pseFormationApiObject,
  }
}

export default function ConcreteCaseSessionsRoute() {
  const { formationId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <PageContainer>
      <PageTitle title="Créer une session" />
      <Section>
        <Callout severity="info">Créez une nouvelle session de cas concret</Callout>

        <Form method="post">
          <input type="hidden" name="formationId" value={formationId} />

          <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
            <TextField
              name="name"
              ref={nameRef}
              label="Nom de la session"
              variant="standard"
              margin="normal"
              type="string"
              required
              autoFocus
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-describedby="name-form-error"
            />
            <FormErrorHelperText name="name" actionData={actionData} />
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </Form>
      </Section>
    </PageContainer>
  );
}

