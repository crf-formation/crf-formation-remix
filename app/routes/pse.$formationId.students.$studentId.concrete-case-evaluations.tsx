import Stack from "@mui/material/Stack";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import Section from "~/component/layout/Section";
import PseUserConcreteCasesTable from "~/component/pse-user-concrete-case/PseUserConcreteCasesTable";
import Callout from "~/component/typography/Callout";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseUserSummaryConcreteCaseApiObjectToDto } from "~/mapper/pseusersummary.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseUserConcreteCasesResume } from "~/service/pseuserconcretecase.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { V2_MetaFunction } from "@remix-run/node";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string()
});

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, studentId } = await security(request, params);

  const pseUserSummaryConcreteCaseApiObject = await getPseUserConcreteCasesResume(pseFormationApiObject.id, studentId);

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseUserSummaryConcreteCase: pseUserSummaryConcreteCaseApiObjectToDto(pseUserSummaryConcreteCaseApiObject)
  });
}


const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema);

  const pseFormationApiObject = await getPseFormationById(formationId);

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    studentId
  };
};

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Cas concrets - évaluations` }
  ];
};

export default function SessionRoute() {
  const { pseUserSummaryConcreteCase } = useLoaderData<typeof loader>();

  return (
    <Stack spacing={2}>
      <Section>
        {pseUserSummaryConcreteCase.userConcreteCases.length === 0 ? (
          <Callout severity="info">
            Ce participant n'as pas encore participé à un cas concret
          </Callout>
        ) : (
          <PseUserConcreteCasesTable
            pseUserSummaryConcreteCase={pseUserSummaryConcreteCase}
          />
        )}
      </Section>
    </Stack>
  );
}
