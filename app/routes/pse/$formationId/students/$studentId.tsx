import { Grid, Link } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import AppTabsLink from "~/components/layout/AppTabsLink";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import useUser from "~/hooks/useUser";
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
    title: data?.student?.fullName,
  };
};

export default function UserPseFormationSummaryRoute() {
  const { formation, student } = useLoaderData<typeof loader>();
  const user = useUser();

  const tabs = [
    {
      label: 'Travail préparatoire',
      href: `/pse/${formation.id}/students/${student.id}/preparatory-work`
    },
    {
      label: 'Techniques',
      href: `/pse/${formation.id}/students/${student.id}/technique`
    },
    {
      label: 'Savoir de mise en oeuvre des procédures',
      href: `/pse/${formation.id}/students/${student.id}/concrete-case/session`
    },
    {
      label: 'Suivi final',
      href: `/pse/${formation.id}/students/${student.id}/summary`
    }
  ]

  return (
    <>
      <AppTabsLink tabs={tabs} />
      <PageContainer>
        <PageTitle title={student.fullName} />

        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Outlet />
          </Grid>
          <Grid item xs={3}>
            <Section title="">
              {user.hasAdminPermission && (
                <Link href={`/admin/user/${student.id}`}>
                  Éditer l'utilisateur
                </Link>
              )}
            </Section>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
