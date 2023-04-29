import type { Session } from "@remix-run/server-runtime";
import { badRequest } from "~/helper/responses.helper";
import type { ApiErrorException } from "~/service/api.error";
import { addFlashMessage } from "~/service/flash.server";
import { commitSession } from "~/service/session.server";

/**
 * Create a response receiving a JSON object with the status code 400.
 * @example
 * export let loader: LoaderFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   throw badRequest<BoundaryData>({ user });
 * }
 */
export async function badRequestWithFlash(
  session: Session,
  e: ApiErrorException
) {
  session = await addFlashMessage(
    session,
    "error",
    e.message
  );

  return badRequest(e, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
