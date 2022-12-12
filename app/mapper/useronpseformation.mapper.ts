import type { UserOnPseFormationEntity } from "~/apiobject/entity";
import type { UserOnPseFormationApiObject, UserOnPseFormationPutApiObject, UserOnPseFormationRoleApiEnum } from "~/apiobject/useronpseformation.apiobject";
import type { UserOnPseFormationDto, UserOnPseFormationPutDto } from "~/dto/useronpseformation.dto";
import { userApiObjectToUserDto, userEntityToUserApiObject } from "./user.mapper";

export function userOnPseformationDataToPutDto(data: any): UserOnPseFormationPutDto {
  return {
    userId: data.userId,
    role: data.role,
    assignedAt: new Date(),
  }
}

export function userOnPseformationDataPutDtoToApiObject(dto: UserOnPseFormationPutDto, current: Optional<UserOnPseFormationApiObject>, formationId: string): UserOnPseFormationPutApiObject {
  return {
    id: current?.id,
    userId: dto.userId,
    formationId,
    role: dto.role,
    assignedAt: current?.assignedAt || new Date(),
  }
}

export function userOnPseformationApiObjectToDto(apiObject: UserOnPseFormationApiObject): UserOnPseFormationDto {
  return {
    formationId: apiObject.formationId,
    userId: apiObject.userId,
    role: userOnPseFormationRoleApiEnumToDtoEnum(apiObject.role),
    assignedAt: apiObject.assignedAt,
    user: userApiObjectToUserDto(apiObject.user)
  };
}

export function userOnPseformationEntityToApiObject(entity: UserOnPseFormationEntity): UserOnPseFormationApiObject {
  return {
    id: entity.id,
    formationId: entity.formationId,
    userId: entity.userId,
    role: stringToUserOnPseFormationRoleApiEnum(entity.role),
    assignedAt: entity.assignedAt,
    user: userEntityToUserApiObject(entity.user),
  }
}

function stringToUserOnPseFormationRoleApiEnum(role: string): UserOnPseFormationRoleApiEnum {
  // TODO: enforce validity
  return role as UserOnPseFormationRoleApiEnum;
}


function userOnPseFormationRoleApiEnumToDtoEnum(role: UserOnPseFormationRoleApiEnum): UserOnPseFormationRoleDtoEnum {
  // TODO: enforce validity
  return role as UserOnPseFormationRoleDtoEnum;
}