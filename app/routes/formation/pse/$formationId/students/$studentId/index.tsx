import { Grid, Typography } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { userOnPseFormationApiObjectToDto } from '~/mapper/useronpseformation.mapper';
import { findPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormation } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getUserOnPseFormationEntityById } from "~/services/useronpseformation.server";

const zparams = z.object({
  formationId: z.coerce.string(),
  studentId: z.coerce.string(),
})

// display the student summary for the formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
  const { formationId, studentId } = zparams.parse(params)

	// TODO: requireTeacher / admin
	const user = await requireUser(request)
	const pseFormationApiObject = await findPseFormationById(formationId)
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}
	await assertUserHasAccessToFormation(user.id, pseFormationApiObject.id)

	const userOnPseFormationApiObject  = await getUserOnPseFormationEntityById(formationId, studentId)

  return json({
    formation: pseFormationApiObjectToDto(pseFormationApiObject),
    student: userOnPseFormationApiObjectToDto(userOnPseFormationApiObject).user,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - ${data?.student?.fullName}`,
  };
};

export default function UserPseFormationSummaryRoute() {
  const { formation, student } = useLoaderData<typeof loader>();
  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">{student.fullName}</Typography>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
