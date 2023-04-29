import type { Session } from "@remix-run/server-runtime";
import { v4 as uuid } from "uuid";
import { getSession as getServerSession } from "./session.server";

interface FlashMessage {
  id: string;
  message: string;
  severity: FlashMessageType;
}

type FlashMessageType = "error" | "warning" | "info" | "success";


async function getSession(
  requestOrSession: Request | Session
): Promise<Session> {
  if (requestOrSession instanceof Request) {
    return await getServerSession(requestOrSession);
  }

  return requestOrSession as Session;
}

/**
 * You must update the session after adding a flash message:
 *
 * https://remix.run/docs/en/v1/api/remix
 * ```
 * headers: {
 *    // only necessary with cookieSessionStorage
 *    "Set-Cookie": await commitSession(session),
 *  },
 * ```
 *
 */
export async function addFlashMessage(
  requestOrSession: Request | Session,
  severity: FlashMessageType,
  message: string
): Promise<Session> {
  const session = await getSession(requestOrSession);

  const flashMessage = {
    id: uuid(),
    message,
    severity
  };

  // TODO: will always be empty since we did not commit the session yet.
  const flashMessages = await getFlashMessages(requestOrSession);
  flashMessages.push(flashMessage);

  session.flash("flashMessages", flashMessages);

  return session;
}

export async function getFlashMessages(requestOrSession: Request | Session) {
  const session = await getSession(requestOrSession);

  return session.get("flashMessages") || [];
}
