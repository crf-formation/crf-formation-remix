import { Grid, Link } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import AppTabsLink from "~/component/layout/AppTabsLink";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import ButtonStack from "~/component/layout/ButtonStack";
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from "~/component/layout/PagePaperHeader";
import PageSpace from "~/component/layout/PageSpace";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/constant/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useUser from "~/hook/useUser";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { userOnPseFormationApiObjectToDto } from '~/mapper/useronpseformation.mapper';
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getUserOnPseFormationEntityById } from "~/service/useronpseformation.server";

// Note: not named index.tsx ont $studentId directory, because of the <Outlet />

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

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

// display the student summary for the formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userOnPseFormationApiObject = await getUserOnPseFormationEntityById(formationId, studentId)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    student: userOnPseFormationApiObjectToDto(userOnPseFormationApiObject).user,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data?.student?.fullName,
  };
};

export default function UserPseFormationSummaryRoute() {
  const { pseFormation, student } = useLoaderData<typeof loader>();
  const user = useUser();

  const tabs = [
    {
      label: 'Travail préparatoire',
      href: `/pse/${pseFormation.id}/students/${student.id}/preparatory-work`
    },
    {
      label: 'Techniques',
      href: `/pse/${pseFormation.id}/students/${student.id}/technique`
    },
    {
      label: 'Savoir de mise en oeuvre des procédures',
      href: `/pse/${pseFormation.id}/students/${student.id}/concrete-case-evaluations`
    },
    {
      label: 'Suivi quotidien',
      href: `/pse/${pseFormation.id}/students/${student.id}/daily`
    },
    {
      label: 'Résumé',
      href: `/pse/${pseFormation.id}/students/${student.id}/summary`
    }
  ]

  return (
    <>
      <PagePaperHeader
        ariane={
          <Ariane>
            <ArianeItem label="PSE" href="pse" />

            <ArianeItem
              label={pseFormation.title}
              href={`/pse/${pseFormation.id}`}
            />

            <ArianeItem label="Participants" href={`/pse/${pseFormation.id}`} />
          </Ariane>
        }
      >
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
              <ButtonStack>
                {user.hasAdminPermission && (
                  <Link href={`/admin/user/${student.id}`}>
                    Éditer l'utilisateur
                  </Link>
                )}

                <Link
                  href={`/pdf/pse/${pseFormation.id}/final/${student.id}`}
                  target="_blank"
                >
                  PDF final
                </Link>
              </ButtonStack>
            </Section>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
