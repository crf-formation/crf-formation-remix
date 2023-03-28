import type { PseUserPreparatoryWorkApiObject, PseUserPreparatoryWorkPostApiObject } from "~/apiobject/pseuserpreparatorywork.apiobject";
import type { PseUserPreparatoryWorkDto, PseUserPreparatoryWorkPostDto } from "~/dto/pseuserpreparatorywork.dto";
import type { PseUserPreparatoryWorkEntity } from "~/entity";
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

export function pseUserPreparatoryWorkApiObjectToPostDto(apiObject: PseUserPreparatoryWorkApiObject): PseUserPreparatoryWorkPostDto {
	return {
		pseModuleId: apiObject.pseModuleId,
		openingDate: apiObject.openingDate?.toISOString(),
		realisedDate: apiObject.realisedDate?.toISOString(),
		realised: apiObject.realised,
		pseModuleName: apiObject.pseModule?.name,
	}
}

export function pseUserPreparatoryWorkPostDtoToApiObject(dto: PseUserPreparatoryWorkPostDto): PseUserPreparatoryWorkPostApiObject {
	return {
		pseModuleId: dto.pseModuleId,
		openingDate: dto.openingDate,
		realisedDate: dto.realisedDate,
		realised: dto.realised,
	}
}
