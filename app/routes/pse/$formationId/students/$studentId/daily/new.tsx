import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { SecurityFunction } from "~/helper/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
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

export const action = async ({ request }: ActionArgs) => {
  const { pseFormationApiObject, userApiObject, studentId } = await security(request, params)

	// TODO: zod
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null } },
      { status: 400 }
    );
  }

	const dailyNotePostDto = { title, body, creator: userApiObject, studentId };

  const note = await createDailyNote(dailyNotePostDto); // TODO: mapper

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}