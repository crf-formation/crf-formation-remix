import type { Session } from "@remix-run/server-runtime";
import { addFlashMessage } from "~/services/flash.server";
import { commitSession } from "~/services/session.server";
import { badRequest } from "./responses";
import type { ApiErrorException } from '../services/api.error';

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
      "Set-Cookie": await commitSession(session),
    },
  })
}
