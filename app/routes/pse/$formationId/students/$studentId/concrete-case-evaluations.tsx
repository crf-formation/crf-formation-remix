import { Stack } from "@mui/material";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import Section from "~/component/layout/Section";
import PseUserConcreteCasesTable from "~/component/pse-user-concrete-case/PseUserConcreteCasesTable";
import type { SecurityFunction } from "~/constant/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { pseUserSummaryConcreteCaseApiObjectToDto } from "~/mapper/pseusersummary.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseUserConcreteCasesResume } from "~/service/pseuserconcretecase.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, studentId } = await security(request, params)

  const pseUserSummaryConcreteCaseApiObject = await getPseUserConcreteCasesResume(pseFormationApiObject.id, studentId)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseUserSummaryConcreteCase: pseUserSummaryConcreteCaseApiObjectToDto(pseUserSummaryConcreteCaseApiObject),
  });
}


const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
}> = async (request: Request, params: Params) => {
  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
    studentId,
  }
}

export default function SessionRoute() {
  const { pseUserSummaryConcreteCase } = useLoaderData<typeof loader>();

  return (
    <Stack spacing={2}>
      <Section>
        <PseUserConcreteCasesTable
          pseUserSummaryConcreteCase={pseUserSummaryConcreteCase}
        />
      </Section>
    </Stack>
  );
}
