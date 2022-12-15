import { Button, Box, TextField, Typography } from "@mui/material";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRef, useEffect } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageContainer from "~/components/layout/PageContainer";
import Section from "~/components/layout/Section";
import { PseConcreteCaseSessionPostDto } from "~/dto/pseconcretecasesession.dto";
import { pseConcreteCaseSessionPostDtoToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { createConcreteCaseSession } from "~/services/pseconcretecasesession.server";
import { getSession, requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
});

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
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
  const session = await getSession(request);

  const user = await requireUser(request);
	// TODO: has access to formation

	const { formationId } = getParamsOrFail(params, ParamsSchema)

	const result = await getFormData(request, PostSchema);
  if (!result.success) {
    return json(result.errors, { status: 400 });
  }

	const postDto = result.data as PseConcreteCaseSessionPostDto

	if (formationId !== postDto.formationId) {
		// TODO: error
	}

	const concreteCaseSessionApiObject = await createConcreteCaseSession(
		pseConcreteCaseSessionPostDtoToApiObject(postDto)
	)

	return redirect(`/pse/${formationId}/concrete-case/session/${concreteCaseSessionApiObject.id}`);
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
      <Section>
        <Typography variant="h3">Créer une session de cas concrets</Typography>

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

