import { Grid, Link } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import AppTabsLink from "~/component/layout/AppTabsLink";
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from "~/component/layout/PagePaperHeader";
import PageSpace from "~/component/layout/PageSpace";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/constant/remix";
import useUser from "~/hook/useUser";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { userOnPseFormationApiObjectToDto } from '~/mapper/useronpseformation.mapper';
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getUserOnPseFormationEntityById } from "~/service/useronpseformation.server";
import { getParamsOrFail } from "~/util/remix.params";

// Note: not named index.tsx ont $studentId directory, because of the <Outlet />

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

// display the student summary for the formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userOnPseFormationApiObject = await getUserOnPseFormationEntityById(formationId, studentId)

  return json({
    formation: pseFormationApiObjectToDto(pseFormationApiObject),
    student: userOnPseFormationApiObjectToDto(userOnPseFormationApiObject).user,
  });
};

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
  }
}

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
      <PagePaperHeader>
        <PageTitle title={student.fullName} />
      </PagePaperHeader>

      <AppTabsLink tabs={tabs} />

      <PageSpace variant="header" />

      <PageContainer>
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
