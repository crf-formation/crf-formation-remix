import type { LoaderArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from '~/apiobject/pseformation.apiobject';
import type { UserApiObject } from "~/apiobject/user.apiobject";
import { generateUserPdf } from "~/helper/psepdf.herlper";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from '~/helper/remix.params.helper';
import { pdf } from "~/helper/responses.helper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseUserSummary } from "~/service/pseusesummary.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  userId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
    userApiObject,
  }
}

// display the student summary for the formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, userApiObject } = await security(request, params)

  const { formationId, userId } = getParamsOrFail(params, ParamsSchema)

	const pseUserSummaryApiObject = await getPseUserSummary(
    formationId,
    userId
  );

	const pdfContent = await generateUserPdf(
    pseFormationApiObject,
    userApiObject,
    pseUserSummaryApiObject
  );

  return pdf(pdfContent);
};
