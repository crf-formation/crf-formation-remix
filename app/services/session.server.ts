import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { CookieSerializeOptions, Session } from '@remix-run/server-runtime';
import invariant from "tiny-invariant";
import { SESSION_KEY, SESSION_MAX_AGE } from "~/constants/index.server";
import type { UserDto } from "~/dto/user.dto";
import { getUserMe } from "~/services/user.server";
import { ApiErrorException } from './api.error';
import { getUserById } from "./user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<UserDto["id"] | undefined> {
  const session = await getSession(request);
  return session.get(SESSION_KEY)?.userId;
}

export async function getToken(
  request: Request
): Promise<UserDto["id"] | undefined> {
  const session = await getSession(request);
  return session.get(SESSION_KEY)?.token;
}

export async function getMe(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const token = await requireToken(request);
  try {
    const UserDto = await getUserMe(token);
    return UserDto
  } catch (e) {
    if (e instanceof ApiErrorException && e.status === 401) {
      throw await logout(request);
    }
  }
  return null
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

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const token = await requireToken(request)

  const userDto = await getUserById(token, userId);
  if (userDto) return userDto;

  throw await logout(request);
}

export async function requireToken(request: Request) {
  const token = await getToken(request);

  if (token) {
    return token
  }

  throw await logout(request);
}

export async function requireAuth(request: Request) {
  return {
    token: await requireToken(request),
    userId: await requireUserId(request),
  }
}

export async function createUserSession({
  session,
  userId,
  token,
  remember,
  redirectTo,
}: {
  session: Session;
  userId: string;
  token: string;
  remember: boolean;
  redirectTo: string;
}) {
  session.set(SESSION_KEY,  { token, userId });
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        // TODO: max-age will be overriden when we commitSession on the code..
        maxAge: remember
          ? SESSION_MAX_AGE
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const cookie = await sessionStorage.destroySession(session)

  return redirect("/", {
    headers: {
      "Set-Cookie": cookie
    },
  });
}

export async function commitSession(session: Session, options?: CookieSerializeOptions): Promise<string> {
  return sessionStorage.commitSession(session, { maxAge: SESSION_MAX_AGE, ...options })
}

export let { destroySession } = sessionStorage;