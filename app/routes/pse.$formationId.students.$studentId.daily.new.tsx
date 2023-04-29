import { Box, Typography } from '@mui/material';
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import DailyNoteForm from "~/component/daily/DailyNoteForm";
import type { DailyPostDto as DailyNotePostDto } from "~/dto/daily.dto";
import { validateForm } from "~/form/abstract";
import { dailyValidator } from "~/form/daily.form";
import type { SecurityFunction } from '~/helper/remix.helper';
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { dailyNotePostDtoToApiObject } from "~/mapper/daily.mapper";
import { createDailyNote } from "~/service/daily.server";
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
	userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
		userApiObject,
    studentId,
  }
}

export const action = async ({ request, params }: ActionArgs) => {
  const { pseFormationApiObject, userApiObject, studentId } = await security(request, params)

  const result = await validateForm<DailyNotePostDto>(request, dailyValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }

  const dailyNotePostDto = result.data;	

  const dailyNote = await createDailyNote(dailyNotePostDtoToApiObject(dailyNotePostDto));

  return redirect(`/pse/${pseFormationApiObject.id}/students/${studentId}/daily/${dailyNote.id}`);
};

export default function NewDailyNotePage() {
  const newDaily: DailyNotePostDto = {
    title: "",
    content: "",
  }

  return (
    <>
      <Typography variant="h4">Nouvelle note</Typography>
      <Box mt={2}>
        <DailyNoteForm daily={newDaily} />
      </Box>
    </>
  );
}