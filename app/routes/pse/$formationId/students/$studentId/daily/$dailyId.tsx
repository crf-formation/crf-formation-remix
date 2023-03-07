import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import DailyNoteForm from '~/component/daily/DailyNoteForm';
import type { DailyNoteDto, DailyNotePostDto } from "~/dto/daily.dto";
import { validateForm } from "~/form/abstract";
import { dailyValidator } from "~/form/daily.form";
import type { SecurityFunction } from "~/helper/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { updateDailyNote } from "~/service/daily.server";
import { getPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
  dailyId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
	studentId: string;
	dailyId: string;
}> = async (request: Request, params: Params) => {
  const { formationId, studentId, dailyId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
		studentId,
		dailyId,
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const { studentId, dailyId } = await security(request, params)

  const dailyList: Array<DailyNoteDto> = [
    {
      id: "1",
      createdAt: new Date().toISOString(),
      updateddAt: new Date().toISOString(),
      title: "Note 1 - Lundi",
			content: `Content note 1`
    },
    {
      id: "2",
      createdAt: new Date().toISOString(),
      updateddAt: new Date().toISOString(),
      title: "Note 2 - Mardi",
			content: `Content note 2`
    }
  ]

	const daily = dailyList.find(daily => daily.id === dailyId)
	if (!daily) {
		throw new Error('daily not found')
	}

  return json({
    daily
  });
}

export const action = async ({ request, params }: ActionArgs) => {
  const { pseFormationApiObject, studentId, dailyId } = await security(request, params)

  const result = await validateForm<DailyNotePostDto>(request, dailyValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }

  const dailyNotePostDto = result.data;	

  const dailyNote = await updateDailyNote(dailyId, dailyNotePostDtoToApiObject(dailyNotePostDto));

  return redirect(`/pse/${pseFormationApiObject.id}/students/${studentId}/daily/${dailyNote.id}`);
};

export default function DailyRoute() {
  const { daily } = useLoaderData<typeof loader>();

  return (
    <>
      <DailyNoteForm daily={daily} />
    </>
  );
}
