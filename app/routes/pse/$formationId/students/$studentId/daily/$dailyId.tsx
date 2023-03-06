import { TextField } from '@mui/material';
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constant/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
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

  const dailyList = [
    {
      id: "1",
      createdAt: new Date(),
      updateddAt: new Date(),
      title: "Note 1 - Lundi",
			content: `Content note 1`
    },
    {
      id: "2",
      createdAt: new Date(),
      updateddAt: new Date(),
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

export default function DailyRoute() {
  const { daily } = useLoaderData<typeof loader>();

  return (
    <>
      <TextField
        defaultValue={daily.content}
        variant="filled"
        size="medium"
        fullWidth
        multiline
        rows={15}
      />
    </>
  );
}
