import type { LoaderArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { generateUserPdf } from "~/helper/psepdf.herlper";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pdf } from "~/helper/responses.helper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseUserSummary } from "~/service/pseusesummary.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import type { UserMeApiObject } from "~/apiobject/user.apiobject";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  userId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  userMeApiObject: UserMeApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { formationId } = getParamsOrFail(params, ParamsSchema);
  const pseFormationApiObject = await getPseFormationById(formationId);

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject,
    userMeApiObject
  };
};

// display the student summary for the formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject, userMeApiObject } = await security(request, params);

  const { formationId, userId } = getParamsOrFail(params, ParamsSchema);

  const pseUserSummaryApiObject = await getPseUserSummary(
    formationId,
    userId
  );

  const pdfContent = await generateUserPdf(
    pseFormationApiObject,
    userMeApiObject,
    pseUserSummaryApiObject
  );

  return pdf(pdfContent);
};
