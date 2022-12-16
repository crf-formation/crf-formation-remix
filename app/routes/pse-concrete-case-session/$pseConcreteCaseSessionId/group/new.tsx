import { Box, Button, Grid, TextField } from "@mui/material";
import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageContainer from "~/components/layout/PageContainer";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';
import FormationStudentAutocomplete from "~/components/formationpse/FormationStudentAutocomplete"
import { useEffect, useRef } from "react";

const ParamsSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema)

	await requireUser(request)

	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId)

	// TODO:
	// await assertUserHasAccessToFormation(user.id, pseConcreteCaseSessionApiObject.id)

  const formationId = 'clbp9n0bb0000t0vsuapesxll'

  return json({
    formationId,
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
	});
};

export async function action({ request, params  }: ActionArgs) {
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Nouveau groupe`,
  };
};

export default function SessionPseRoute() {
  const { formationId, pseConcreteCaseSession } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Form action="post">
          <input
            type="hidden"
            name="pseConcreteCaseSessionId"
            value={pseConcreteCaseSession.id}
          />

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

						<FormationStudentAutocomplete formationId={formationId} />
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </Form>
      </Grid>
    </PageContainer>
  );
}
