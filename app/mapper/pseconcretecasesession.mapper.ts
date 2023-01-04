import { isEmpty } from "lodash";
import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionGroupOrderApiObject, PseConcreteCaseSessionGroupOrderSituationApiObject, PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject, PseConcreteCaseSessionStateApiEnum } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSessionDto, PseConcreteCaseSessionGroupOrderDto, PseConcreteCaseSessionGroupOrderSituationDto, PseConcreteCaseSessionPostDto, PseConcreteCaseSessionPutDto, PseConcreteCaseSessionStateDtoEnum } from "~/dto/pseconcretecasesession.dto";
import type { PseConcreteCaseSessionEntity } from "~/entity";
import { assertEnum } from "~/util/enum";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseSituationApiObjectToDto, pseConcreteCaseSituationEntityToApiObject } from "./pseconcretecasesituation.mapper";

export function pseConcreteCaseSessionEntityToApiObject(
  entity: PseConcreteCaseSessionEntity
): PseConcreteCaseSessionApiObject {
  return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		name: entity.name,
		state: pseConcreteCaseSessionStateStringToApiEnum(entity.state),

		pseConcreteCaseGroups: entity.groups.map(pseConcreteCaseGroupEntityToApiObject),
		pseConcreteCaseSituations: entity.situations.map(pseConcreteCaseSituationEntityToApiObject),

		isConfigured: !isEmpty(entity.groups) && !isEmpty(entity.situations)
  };
}

function pseConcreteCaseSessionStateStringToApiEnum(state: string): PseConcreteCaseSessionStateApiEnum {
	return assertEnum<PseConcreteCaseSessionStateApiEnum>(state, [
    "CREATED",
    "RUNNING",
    "CLOSED",
  ]);
}

export function pseConcreteCaseSessionApiObjectToDto(
  apiObject: PseConcreteCaseSessionApiObject
): PseConcreteCaseSessionDto {
  return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		name: apiObject.name,
		state: pseConcreteCaseSessionStateApiEnumToDto(apiObject.state),
		stateLabel: getStateLabel(pseConcreteCaseSessionStateApiEnumToDto(apiObject.state)),
		pseConcreteCaseGroups: apiObject.pseConcreteCaseGroups.map(pseConcreteCaseGroupApiObjectToDto),
		pseConcreteCaseSituations: apiObject.pseConcreteCaseSituations.map(pseConcreteCaseSituationApiObjectToDto),
		isConfigured: apiObject.isConfigured,
  };
}


function pseConcreteCaseSessionStateApiEnumToDto(state: PseConcreteCaseSessionStateApiEnum): PseConcreteCaseSessionStateDtoEnum {
	return assertEnum<PseConcreteCaseSessionStateDtoEnum>(state, [
    "CREATED",
    "RUNNING",
    "CLOSED",
  ]);
}


export function pseConcreteCaseSessionPostDtoToApiObject(dto: PseConcreteCaseSessionPostDto): PseConcreteCaseSessionPostApiObject {
	return {
    name: dto.name,
    state: "CREATED",
    formationId: dto.formationId,
  };
}


export function pseConcreteCaseSessionPutDtoToApiObject(dto: PseConcreteCaseSessionPutDto): PseConcreteCaseSessionPutApiObject {
	return {
    name: dto.name,
    state: pseConcreteCaseSessionStateDtoEnumToApi(dto.state),
  };
}

function pseConcreteCaseSessionStateDtoEnumToApi(state: PseConcreteCaseSessionStateDtoEnum): PseConcreteCaseSessionStateApiEnum {
	return assertEnum<PseConcreteCaseSessionStateApiEnum>(state, [
    "CREATED",
    "RUNNING",
    "CLOSED",
  ]);
}

function getStateLabel(state: PseConcreteCaseSessionStateDtoEnum) {
	switch (state) {
		case 'CREATED': return 'Non commencé'
		case 'RUNNING': return 'En cours'
		case 'CLOSED': return 'Fermé'
	}
}


//
//
//

export function pseConcreteCaseSessionGroupOrderApiObjectToDto(apiObject: PseConcreteCaseSessionGroupOrderApiObject): PseConcreteCaseSessionGroupOrderDto {
	return {
		pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(apiObject.pseConcreteCaseGroup),
		groupOrderSituations: apiObject.groupOrderSituations.map(pseConcreteCaseSessionGroupOrderSituationApiObjectToDto), 
		duplicatedPositions: apiObject.duplicatedPositions.map(pseConcreteCaseSessionGroupOrderSituationApiObjectToDto),
		situationsWithoutPosition: apiObject.situationsWithoutPosition.map(pseConcreteCaseSituationApiObjectToDto), 
		hasNoPositions: apiObject.hasNoPositions,
		hasSomeSituationsWithoutPosition: apiObject.hasSomeSituationsWithoutPosition,
	}
}

function pseConcreteCaseSessionGroupOrderSituationApiObjectToDto(apiObject: PseConcreteCaseSessionGroupOrderSituationApiObject): PseConcreteCaseSessionGroupOrderSituationDto {
	return {
		pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(apiObject.pseConcreteCaseSituation),
		position: apiObject.position
	}
}
