import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ActionArgs } from "@remix-run/node";
import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserMeApiObject } from "~/apiobject/user.apiobject";
import DailyNoteForm from "~/component/daily/DailyNoteForm";
import type { DailyNotePostDto } from "~/dto/daily.dto";
import { validateForm } from "~/form/abstract";
import { dailyValidator } from "~/form/daily.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { dailyNotePostDtoToApiObject } from "~/mapper/daily.mapper";
import { createDailyNote } from "~/service/daily.server";
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import type { loader } from "~/routes/pse.$formationId.students.$studentId.concrete-case-evaluations";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string()
});

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

export const action = async ({ request, params }: ActionArgs) => {
  const { pseFormationApiObject, studentId } = await security(request, params);

  const result = await validateForm<DailyNotePostDto>(request, dailyValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }

  const dailyNotePostDto = result.data;

  const dailyNote = await createDailyNote(dailyNotePostDtoToApiObject(dailyNotePostDto));

  return redirect(`/pse/${pseFormationApiObject.id}/students/${studentId}/daily/${dailyNote.id}`);
};

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Nouvelle note` }
  ];
};

export default function NewDailyNotePage() {
  const newDaily: DailyNotePostDto = {
    title: "",
    content: ""
  };

  return (
    <>
      <Typography variant="h4">Nouvelle note</Typography>
      <Box mt={2}>
        <DailyNoteForm daily={newDaily} />
      </Box>
    </>
  );
}