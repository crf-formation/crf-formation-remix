import { prisma } from "~/db.server";
import type {
  UserPostApiObject,
} from "~/apiobject/user.apiobject";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

export async function createUserEntity(
  userPostApiObject: UserPostApiObject
): Promise<User> {
  const hashedPassword = await bcrypt.hash(userPostApiObject.password, 10);

  const userEntity = await prisma.user.create({
    data: {
      email: userPostApiObject.email,
      firstName: userPostApiObject.firstName,
      lastName: userPostApiObject.lastName,
      state: userPostApiObject.state,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  return userEntity
}

export async function findUserEntityByEmail(
  email: string
): Promise<Optional<User>> {
  const userEntity = await prisma.user.findUnique({ where: { email } });
  if (!userEntity) {
    return null;
  }
  return userEntity
}

export async function findUserEntityById(
  id: string
): Promise<Optional<User>> {
  const userEntity = await prisma.user.findUnique({ where: { id } });
  if (!userEntity) {
    return null;
  }
  return userEntity
}

export async function findUserEntityByEmailAndPassword(
  email: string,
  password: string
): Promise<Optional<User>> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

	return userWithoutPassword;
}