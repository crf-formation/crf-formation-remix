import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { CookieSerializeOptions, Session } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { UserApiObject, UserMeApiObject } from "~/apiobject/user.apiobject";
import { SESSION_KEY, SESSION_MAX_AGE } from "~/constant/index.server";
import { getUserMe } from "~/service/user.server";
import { ApiErrorException } from "./api.error";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production"
  }
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<UserApiObject["id"] | undefined> {
  const session = await getSession(request);
  return session.get(SESSION_KEY)?.userId;
}

export async function getMe(request: Request): Promise<Optional<UserMeApiObject>> {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  try {
    return await getUserMe(userId);
  } catch (e) {
    if (e instanceof ApiErrorException && e.status === 401) {
      throw await logout(request);
    }
  }
  return null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request): Promise<UserMeApiObject> {
  const userMe = await getMe(request);

  if (userMe) return userMe;

  throw await logout(request);
}

export async function requireAdmin(request: Request): Promise<UserMeApiObject> { // TODO: return UserMeApiObject?
  const user = await requireUser(request);

  if (user.role === "ADMIN" || user.role == "SUPER_ADMIN") return user;

  throw await redirect("/");
}

export async function requireAuth(request: Request) {
  return {
    userId: await requireUserId(request)
  };
}

export async function createUserSession(
  {
    session,
    userId,
    remember,
    redirectTo
  }: {
    session: Session;
    userId: string;
    remember: boolean;
    redirectTo: string;
  }) {
  session.set(SESSION_KEY, { userId });

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        // TODO: max-age will be overriden when we commitSession on the code..
        maxAge: remember
          ? SESSION_MAX_AGE
          : undefined
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const cookie = await sessionStorage.destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": cookie
    }
  });
}

export async function commitSession(session: Session, options?: CookieSerializeOptions): Promise<string> {
  return sessionStorage.commitSession(session, { maxAge: SESSION_MAX_AGE, ...options });
}

export let { destroySession } = sessionStorage;