import type { PseUserPreparatoryWorkEntity } from "~/entity";
import type { PseUserPreparatoryWorkApiObject } from "~/apiobject/pseformationpreparatorywork.apiobject";
import type { PseUserPreparatoryWorkDto } from "~/dto/pseformationpreparatorywork.dto";
import { pseModuleEntityToApiObject } from "./psemodule.mapper";

export function pseUserPreparatoryWorkEntityToApiObject(entity: PseUserPreparatoryWorkEntity): PseUserPreparatoryWorkApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		userId: entity.userId,
		formationId: entity.formationId,
		pseModule  : pseModuleEntityToApiObject(entity.pseModule),
		pseModuleId: entity.pseModuleId,
		openingDate : entity.openingDate,
		realisedDate: entity.realisedDate,
		realised: entity.realised,
	}
}

export function pseUserPreparatoryWorkApiObjectToDto(apiObject: PseUserPreparatoryWorkApiObject): PseUserPreparatoryWorkDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		userId: apiObject.userId,
		formationId: apiObject.formationId,
		pseModule  : apiObject.pseModule,
		pseModuleId: apiObject.pseModuleId,
		openingDate : apiObject.openingDate?.toISOString(),
		realisedDate: apiObject.realisedDate?.toISOString(),
		realised: apiObject.realised,
	}
}