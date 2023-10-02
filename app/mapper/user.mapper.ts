import type { User as UserEntity } from "@prisma/client";
import type {
  PermissionApiObject,
  UserApiObject, UserMeApiObject,
  UserPostApiObject,
  UserPutApiObject,
  UserRoleApiEnum,
  UserStateApiEnum
} from "~/apiobject/user.apiobject";
import type {
  PermissionDto,
  UserDto,
  UserMeDto,
  UserPostDto,
  UserPutDto,
  UserRoleDtoEnum,
  UserStateDtoEnum
} from "~/dto/user.dto";
import { assertEnum } from "~/mapper/abstract.mapper";
import { AuthorityApiEnum } from "~/apiobject/permission.apiobject";

export function userPostDtoToApiObject(
  dto: UserPostDto
): UserPostApiObject {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    state: "CREATED",
    role: "USER"
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
    lastName: dto.lastName
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
    updatedAt: userEntity.updatedAt
  };
}

function buildPermission(identifier: AuthorityApiEnum): PermissionApiObject {
  return {
    id: identifier,
    identifier: identifier,
    technicalName: identifier,
    technicalDescription: identifier,
  }
}
function createPermissions(userEntity: UserEntity): Array<PermissionApiObject> {
  const allPermissions = [
    buildPermission("resourcemanager.prouser.list"),
    buildPermission("resourcemanager.prouser.create"),
    buildPermission("resourcemanager.prouser.update"),
    buildPermission("resourcemanager.formation.list"),
    buildPermission("resourcemanager.formation.create"),
    buildPermission("resourcemanager.formation.update"),
  ]
    // for the moment the database does not handle a list of permissions, only a role,
  // which we convert into permissions here
  if (userEntity.role === "ADMIN") {
    return [
      buildPermission('admin'),
      ...allPermissions
    ]
  }

  if (userEntity.role === "SUPER_ADMIN") {
    return [
      buildPermission('super-admin'),
      buildPermission('admin'),
      ...allPermissions
    ]
  }

  return []
}

export function userEntityToMeApiObject(userEntity: UserEntity): UserMeApiObject {
  return {
    id: userEntity.id,
    role: userRoleStringToApiEnum(userEntity.role),
    email: userEntity.email,
    firstName: userEntity.firstName,
    lastName: userEntity.lastName,
    createdAt: userEntity.createdAt,
    updatedAt: userEntity.updatedAt,
    permissions: createPermissions(userEntity),
  };
}

export function userMeApiObjectToUserMeDto(
  userApiObject: UserMeApiObject
): UserMeDto {
  return {
    id: userApiObject.id,
    role: userRoleStringToDtoEnum(userApiObject.role),
    email: userApiObject.email,
    firstName: userApiObject.firstName,
    lastName: userApiObject.lastName,
    fullName: [userApiObject.firstName, userApiObject.lastName]
      .filter(Boolean)
      .join(" "),
    createdAt: userApiObject.createdAt.toISOString(),
    updatedAt: userApiObject.updatedAt.toISOString(),
    permissions: userApiObject.permissions.map(permissionApiObjectToDto),
  };
}

function permissionApiObjectToDto(
  apiObject: PermissionApiObject
): PermissionDto {
  return {
    id: apiObject.id,
    identifier: apiObject.identifier,
    technicalName: apiObject.technicalName,
    technicalDescription: apiObject.technicalDescription,
  };
}

export function userApiObjectToDto(userApiObject: UserApiObject): UserDto {
  return {
    id: userApiObject.id,
    state: userStateStringToDtoEnum(userApiObject.state),
    role: userRoleStringToDtoEnum(userApiObject.role),
    email: userApiObject.email,
    firstName: userApiObject.firstName,
    lastName: userApiObject.lastName,
    fullName: [userApiObject.firstName, userApiObject.lastName]
      .filter(Boolean)
      .join(" "),
    createdAt: userApiObject.createdAt.toISOString(),
    updatedAt: userApiObject.updatedAt.toISOString(),
  };
}

export function dataToUserPutDto(data: any): UserPutDto {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    state: data.state,
    role: data.role
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
    "ARCHIVED"
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
    "ARCHIVED"
  ]);
}
