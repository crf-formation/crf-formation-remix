import { test as base } from '@playwright/test'
import { type User as UserModel } from '@prisma/client'
import * as setCookieParser from 'set-cookie-parser'
import type { UserApiObject, UserPostApiObject } from "~/apiobject/user.apiobject";
import { prisma } from "~/entity/db.server";
import { createUser, findUserByEmail } from "~/service/user.server";
import { userEntityToApiObject } from "~/mapper/user.mapper";
import type {
  PseFormationApiObject,
  PseFormationPostApiObject} from "~/apiobject/pseformation.apiobject";
import { pseFormationEntityToApiObject } from "~/mapper/pseformation.mapper";
import { createPseFormation, getPseFormationById, updatePseFormation } from "~/service/pseformation.server";
import { sessionStorage } from "~/service/session.server"
import { SESSION_KEY } from "~/constant/index.server";
import { PseFormationPutApiObject, PseFormationStateApiEnum } from "~/apiobject/pseformation.apiobject";
import { Page } from "playwright";

type GetOrInsertUserOptions = {
  id?: string
  email?: UserModel['email']
}

type GetOrInsertPseFormationOptions = {
  id?: string;
  userId?: string;
}

async function getOrInsertUser(
  {
    id,
    email,
  }: GetOrInsertUserOptions = {}): Promise<UserApiObject> {
  if (id) {
    const userEntity = await prisma.user.findUniqueOrThrow({
      where: { id: id },
    })
    return userEntityToApiObject(userEntity);
  } else {
    const userEmail = email ?? "jon-doe@crf-formation.fr"
    const byEmail = await findUserByEmail(userEmail);
    if (byEmail) {
      return byEmail;
    }

    const userPostApiObject: UserPostApiObject = {
      firstName: "Jon",
      lastName: "Doe",
      email: userEmail,
      role: "USER",
      state: "ENABLED"
    }
    return createUser(userPostApiObject)
  }
}

async function getOrInsertFormation(
  {
    id,
    userId
  }: GetOrInsertPseFormationOptions = {}): Promise<PseFormationApiObject> {
  let finalId = id ?? null
  if (!id) {
    const pseFormationPostApiObject: PseFormationPostApiObject = {
      state: "ENABLED",
      title: "Test formation",
      from: new Date(),
      to: new Date(),
      placeId: "boulogne",
    }
    const pseFormation = await createPseFormation(pseFormationPostApiObject);
    finalId = pseFormation.id

    if (!userId) {
      throw new Error("Missing userId")
    }

    const studentEmail = "student@test.com"

    let student = await findUserByEmail(studentEmail);
    if (!student) {
      const userPostApiObject: UserPostApiObject = {
        firstName: "Student",
        lastName: "Doe",
        email: studentEmail,
        role: "USER",
        state: "ENABLED"
      }
      student = await createUser(userPostApiObject)
    }

    // add user to formation
    const pseFormationPutApiObject: PseFormationPutApiObject = {
      state: pseFormation.state,
      title: pseFormation.title,
      from: pseFormation.from,
      to: pseFormation.to,
      placeId: pseFormation.place.id,
      users: [
        {
          id: undefined,
          userId: userId,
          formationId: pseFormation.id,
          role: "TEACHER",
          assignedAt: new Date()
        },
        {
          id: undefined,
          userId: student.id,
          formationId: pseFormation.id,
          role: "STUDENT",
          assignedAt: new Date()
        }
      ]
    }
    await updatePseFormation(pseFormation.id, pseFormationPutApiObject);
  }
  if (!finalId) {
    throw new Error("Missing formation id");
  }
  return getPseFormationById(finalId)
}

type ExtendedTestProps = {
  insertNewUser(options?: GetOrInsertUserOptions): Promise<UserApiObject>
  login(options?: GetOrInsertUserOptions): Promise<UserApiObject>
  getPseFormation(options?: GetOrInsertPseFormationOptions): Promise<PseFormationApiObject>
}

export type TestProps = ExtendedTestProps & {
  page: Page;
};

export const test = base.extend<ExtendedTestProps>({
  insertNewUser: async ({}, use) => {
    let userId: string | undefined = undefined
    await use(async options => {
      const user: UserApiObject = await getOrInsertUser(options)
      userId = user.id
      return user
    })
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  },
  login: async ({ page }, use) => {
    let userId: string | undefined = undefined
    await use(async options => {
      const user = await getOrInsertUser(options)
      userId = user.id

      const session = await sessionStorage.getSession()
      session.set(SESSION_KEY, { userId });

      const cookieConfig = setCookieParser.parseString(
        await sessionStorage.commitSession(session),
      ) as any
      await page
        .context()
        .addCookies([{ ...cookieConfig, domain: 'localhost' }])
      return user
    })
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  },

  getPseFormation: async({ page }, use) => {
    let pseFormationId: string | undefined = undefined
    await use(async (options) => {
      const pseFormation = await getOrInsertFormation(options)
      pseFormationId = pseFormation.id
      return pseFormation
    })
    await prisma.pseFormation.delete({ where: { id: pseFormationId } }).catch(() => {})
  },

})

export const { expect } = test

export async function getFormationContext(
  {
    login,
    getPseFormation
  }: {
    login(options?: GetOrInsertUserOptions): Promise<UserApiObject>
    getPseFormation(options?: GetOrInsertPseFormationOptions): Promise<PseFormationApiObject>
  }) {
  const user = await login();
  const pseFormation: PseFormationApiObject = await getPseFormation({
    userId: user.id
  });
  const student = pseFormation.students[0]

  return {
    user,
    pseFormation,
    student
  }
}

/**
 * This allows you to wait for something (like an email to be available).
 *
 * It calls the callback every 50ms until it returns a value (and does not throw
 * an error). After the timeout, it will throw the last error that was thrown or
 * throw the error message provided as a fallback
 */
export async function waitFor<ReturnValue>(
  cb: () => ReturnValue | Promise<ReturnValue>,
  {
    errorMessage,
    timeout = 5000,
  }: { errorMessage?: string; timeout?: number } = {},
) {
  const endTime = Date.now() + timeout
  let lastError: unknown = new Error(errorMessage)
  while (Date.now() < endTime) {
    try {
      const response = await cb()
      if (response) return response
    } catch (e: unknown) {
      lastError = e
    }
    await new Promise(r => setTimeout(r, 100))
  }
  throw lastError
}