import type { User as UserEntity } from "@prisma/client";
import type {
    UserApiObject,
    UserPostApiObject,
    UserPutApiObject,
    UserRoleApiEnum,
    UserStateApiEnum,
} from "~/apiobject/user.apiobject";
import type {
    UserDto,
    UserMeDto,
    UserPostDto,
    UserPutDto,
    UserRoleDtoEnum,
    UserStateDtoEnum,
} from "~/dto/user.dto";
import { assertEnum } from "~/util/enum";

export function userPostDtoToApiObject(
  dto: UserPostDto
): UserPostApiObject {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    state: "CREATED",
    role: "USER",
  };
}

export function userPutDtoToApiObject(
  dto: UserPutDto
): UserPutApiObject {
  return {
    state: dto.state,
    role: dto.role,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
  };
}

export function userEntityToApiObject(userEntity: UserEntity): UserApiObject {
  return {
    id: userEntity.id,
    state: userStateStringToApiEnum(userEntity.state),
    role: userRoleStringToApiEnum(userEntity.role),
    email: userEntity.email,
    firstName: userEntity.firstName,
    lastName: userEntity.lastName,
    createdAt: userEntity.createdAt,
    updatedAt: userEntity.updatedAt,
  };
}

export function userApiObjectToUserMeDto(
  userApiObject: UserApiObject
): UserMeDto {
  return {
    id: userApiObject.id,
    state: userStateStringToDtoEnum(userApiObject.state),
    role: userRoleStringToDtoEnum(userApiObject.role),
    email: userApiObject.email,
    firstName: userApiObject.firstName,
    lastName: userApiObject.lastName,
    createdAt: userApiObject.createdAt.toISOString(),
    updatedAt: userApiObject.updatedAt.toISOString(),

    isAdmin: userApiObject.role === "ADMIN",
    isSuperAdmin: userApiObject.role === "SUPER_ADMIN",
    hasAdminPermission:
      userApiObject.role === "ADMIN" || userApiObject.role === "SUPER_ADMIN",
  };
}

export function userApiObjectToDto(userApiObject: UserApiObject): UserDto {
  return {
    id: userApiObject.id,
    state: userApiObject.state,
    role: userApiObject.role,
    email: userApiObject.email,
    firstName: userApiObject.firstName,
    lastName: userApiObject.lastName,
    fullName: [userApiObject.firstName, userApiObject.lastName]
      .filter(Boolean)
      .join(" "),
    createdAt: userApiObject.createdAt.toISOString(),
    updatedAt: userApiObject.updatedAt.toISOString(),

    isAdmin: userApiObject.role === "ADMIN",
    isSuperAdmin: userApiObject.role === "SUPER_ADMIN",
    hasAdminPermission:
      userApiObject.role === "ADMIN" || userApiObject.role === "SUPER_ADMIN",
  };
}

export function dataToUserPutDto(data: any): UserPutDto {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    state: data.state,
    role: data.role,
  };
}

function userRoleStringToApiEnum(role: string): UserRoleApiEnum {
  return assertEnum<UserRoleApiEnum>(role, ["USER", "ADMIN", "SUPER_ADMIN"]);
}

function userStateStringToApiEnum(state: string): UserStateApiEnum {
  return assertEnum<UserStateApiEnum>(state, [
    "CREATED",
    "ENABLED",
    "DISABLED",
    "ARCHIVED",
  ]);
}

function userRoleStringToDtoEnum(role: UserRoleApiEnum): UserRoleDtoEnum {
  return assertEnum<UserRoleDtoEnum>(role, ["USER", "ADMIN", "SUPER_ADMIN"]);
}

function userStateStringToDtoEnum(state: UserStateApiEnum): UserStateDtoEnum {
  return assertEnum<UserStateApiEnum>(state, [
    "CREATED",
    "ENABLED",
    "DISABLED",
    "ARCHIVED",
  ]);
}
