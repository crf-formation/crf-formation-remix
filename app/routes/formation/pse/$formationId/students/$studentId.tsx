import { Grid, Typography } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import AppTabsLink from "~/components/layout/AppTabsLink";
import PageContainer from "~/components/layout/PageContainer";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { userOnPseFormationApiObjectToDto } from '~/mapper/useronpseformation.mapper';
import { findPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormation } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getUserOnPseFormationEntityById } from "~/services/useronpseformation.server";

// Note: not named index.tsx ont $studentId directory, because of the <Outlet />

const zparams = z.object({
  formationId: z.string(),
  studentId: z.string(),
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

	const userOnPseFormationApiObject = await getUserOnPseFormationEntityById(formationId, studentId)

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

  const tabs = [
    {
      label: 'Travail préparatoire',
      href: `/formation/pse/${formation.id}/students/${student.id}/preparatory-work`
    },
    {
      label: 'Techniques',
      href: `/formation/pse/${formation.id}/students/${student.id}/technique`
    },
    {
      label: 'Savoir de mise en oeuvre des procédures',
      href: `/formation/pse/${formation.id}/students/${student.id}/concrete-case`
    },
    {
      label: 'Commentaire final',
      href: `/formation/pse/${formation.id}/students/${student.id}/final-comment`
    }
  ]

  return (
    <>
      <AppTabsLink tabs={tabs} />
      <PageContainer>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1">{student.fullName}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Outlet />
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
