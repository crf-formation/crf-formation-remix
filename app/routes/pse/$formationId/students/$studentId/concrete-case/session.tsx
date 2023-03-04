import { Stack } from "@mui/material";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constant/remix";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getParamsOrFail } from "~/util/remix.params";
import { getPseUserConcreteCases } from '~/service/pseuserconcretecase.server';
import { pseUserConcreteCaseApiObjectToDto } from '~/mapper/pseuserconcretecase.mapper';

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, studentId } = await security(request, params)

  const pseUserConcreteCaseApiObjects = await getPseUserConcreteCases(pseFormationApiObject.id, studentId)

  return json({
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    pseUserConcreteCases: pseUserConcreteCaseApiObjects.map(pseUserConcreteCaseApiObjectToDto),
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
  const { pseUserConcreteCases } = useLoaderData<typeof loader>();

  return (
    <Stack spacing={2}>
      {/* TODO: */}
    </Stack>
  );
}
