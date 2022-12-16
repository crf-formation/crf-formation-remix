
import { Button, Box, TextField } from "@mui/material";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRef, useEffect } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import Callout from "~/components/typography/Callout";
import type { PseConcreteCaseSessionPostDto } from "~/dto/pseconcretecasesession.dto";
import { pseConcreteCaseSessionPostDtoToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { createPseConcreteCaseSession } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
});

export async function loader({ request, params }: LoaderArgs) {
  await requireUser(request);
	// TODO: has access to formation

	const { formationId } = getParamsOrFail(params, ParamsSchema)

  return json({
    formationId,
  })
}

const PostSchema = z.object({
  formationId: z.string(),
	name: z.string(),
});

export async function action({ request, params }: ActionArgs) {
  await requireUser(request);
	// TODO: has access to formation

	const { formationId } = getParamsOrFail(params, ParamsSchema)

	const result = await getFormData(request, PostSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }
	const postDto = result.data as PseConcreteCaseSessionPostDto

	if (formationId !== postDto.formationId) {
		// TODO: error
	}

	const concreteCaseSessionApiObject = await createPseConcreteCaseSession(
		pseConcreteCaseSessionPostDtoToApiObject(postDto)
	)

	return redirect(`/pse-concrete-case-session/${concreteCaseSessionApiObject.id}`);
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
              autoFocus
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-describedby="name-form-error"
            />
            <FormErrorHelperText name="firstName" actionData={actionData} />
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

