import type { UserOnPseFormationEntity } from "~/entity";
import type {
  UserOnPseFormationApiObject,
  UserOnPseFormationPutApiObject,
  UserOnPseFormationRoleApiEnum,
} from "~/apiobject/useronpseformation.apiobject";
import type {
  UserOnPseFormationDto,
  UserOnPseFormationPutDto,
  UserOnPseFormationRoleDtoEnum,
} from "~/dto/useronpseformation.dto";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";
import { assertEnum } from "~/utils/enum";

export function userOnPseFormationDataToPutDto(
  data: any,
  role: UserOnPseFormationRoleDtoEnum
): UserOnPseFormationPutDto {
  return {
    userId: data.id,
    assignedAt: data.assignedAt,
    role,
  };
}

export function userOnPseFormationDataPutDtoToApiObject(
  dto: UserOnPseFormationPutDto,
  current: Optional<UserOnPseFormationApiObject>,
  formationId: string
): UserOnPseFormationPutApiObject {
  return {
    id: current?.id,
    userId: dto.userId,
    formationId,
    role: dto.role,
    assignedAt: current?.assignedAt || new Date(),
  };
}

export function userOnPseFormationApiObjectToDto(
  apiObject: UserOnPseFormationApiObject
): UserOnPseFormationDto {
  return {
    formationId: apiObject.formationId,
    userId: apiObject.userId,
    role: userOnPseFormationRoleApiEnumToDtoEnum(apiObject.role),
    assignedAt: apiObject.assignedAt.toISOString(),
    user: userApiObjectToDto(apiObject.user),
  };
}

export function userOnPseFormationEntityToApiObject(
  entity: UserOnPseFormationEntity
): UserOnPseFormationApiObject {
  return {
    id: entity.id,
    formationId: entity.formationId,
    userId: entity.userId,
    role: userOnPseFormationRoleStringToApiEnum(entity.role),
    assignedAt: entity.assignedAt,
    user: userEntityToApiObject(entity.user),
  };
}

function userOnPseFormationRoleStringToApiEnum(
  role: string
): UserOnPseFormationRoleApiEnum {
  return assertEnum<UserOnPseFormationRoleApiEnum>(role, [
    "STUDENT",
    "TEACHER",
  ]);
}

function userOnPseFormationRoleApiEnumToDtoEnum(
  role: UserOnPseFormationRoleApiEnum
): UserOnPseFormationRoleDtoEnum {
  return assertEnum<UserOnPseFormationRoleDtoEnum>(role, [
    "STUDENT",
    "TEACHER",
  ]);
}
