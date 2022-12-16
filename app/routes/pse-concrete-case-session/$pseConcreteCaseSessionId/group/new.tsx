import { Box, Button, Stack, TextField } from "@mui/material";
import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageContainer from "~/components/layout/PageContainer";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseConcreteCaseSessionById } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getFormData, getParamsOrFail } from '~/utils/remix.params';
import FormationStudentAutocomplete from "~/components/formationpse/FormationStudentAutocomplete"
import { useEffect, useRef } from "react";
import { getPseFormationByPseConcreteCaseSessionId } from "~/services/pseformation.server";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import type { PseConcreteCaseGroupPostDto } from "~/dto/pseconcretecasegroup.dto";
import Section from "~/components/layout/Section";
import PageTitle from "~/components/layout/PageTitle";

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

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)

	// TODO:
	// await assertUserHasAccessToFormation(user.id, pseConcreteCaseSessionApiObject.id)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
		pseConcreteCaseSession: pseConcreteCaseSessionApiObjectToDto(pseConcreteCaseSessionApiObject)
	});
};

const PostSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
	name: z.string(),
  students: z.array(z.string())
});

export async function action({ request, params  }: ActionArgs) {
	const { pseConcreteCaseSessionId } = getParamsOrFail(params, ParamsSchema)

	await requireUser(request)
	const pseConcreteCaseSessionApiObject = await getPseConcreteCaseSessionById(pseConcreteCaseSessionId)

  const pseFormationApiObject = await getPseFormationByPseConcreteCaseSessionId(pseConcreteCaseSessionApiObject.id)
 	// TODO:
	// await assertUserHasAccessToFormation(user.id, pseConcreteCaseSessionApiObject.id)

  // TODO: finalize creation
  console.log({
    formData: await (await request.clone().formData()).get("students")
  })

  const result = await getFormData(request, PostSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }
	const postDto = result.data as PseConcreteCaseGroupPostDto

  console.log(JSON.stringify(postDto, null, 2))
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Nouveau groupe`,
  };
};

export default function SessionPseRoute() {
  const { pseFormation, pseConcreteCaseSession } = useLoaderData<typeof loader>();

	const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <PageContainer>
      <PageTitle title="Créer un groupe" />
      <Section>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Form method="post">
            <input
              type="hidden"
              name="pseConcreteCaseSessionId"
              value={pseConcreteCaseSession.id}
            />

            <Stack
              spacing={2}
              sx={{ display: "flex", flexDirection: "column", mt: 2 }}
            >
              <TextField
                name="name"
                ref={nameRef}
                label="Nom du groupe"
                variant="standard"
                margin="normal"
                type="string"
                autoFocus
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-describedby="name-form-error"
              />
              <FormErrorHelperText name="firstName" actionData={actionData} />

              <FormationStudentAutocomplete
                formationId={pseFormation.id}
                name="students"
              />
              <FormErrorHelperText name="students" actionData={actionData} />
            </Stack>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Form>
        </Box>
      </Section>
    </PageContainer>
  );
}
