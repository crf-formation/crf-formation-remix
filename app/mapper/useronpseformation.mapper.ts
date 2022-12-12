import type { UserOnPseFormationEntity } from "~/apiobject/entity";
import type { UserOnPseFormationApiObject } from "~/apiobject/useronpseformation.apiobject";
import type { UserOnPseFormationDto } from "~/dto/useronpseformation.dto";

export function userOnPseformationApiObjectToDto(apiObject: UserOnPseFormationApiObject): UserOnPseFormationDto {
  return {
    formationId: apiObject.formationId,
    userId: apiObject.userId,
    role: apiObject.role,
    assignedAt: apiObject.assignedAt,
  };
}

export function userOnPseformationEntityToApiObject(entity: UserOnPseFormationEntity): UserOnPseFormationApiObject {
  return {
    formationId: entity.formationId,
    userId: entity.userId,
    role: entity.role,
    assignedAt: entity.assignedAt,
		// TODO: load user?
  }
}
