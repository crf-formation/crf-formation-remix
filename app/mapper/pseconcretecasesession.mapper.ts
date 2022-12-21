import { isEmpty } from "lodash";
import type { PseConcreteCaseSessionEntity } from "~/entity";
import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject, PseConcreteCaseSessionStateApiEnum } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSessionDto, PseConcreteCaseSessionPostDto, PseConcreteCaseSessionPutDto, PseConcreteCaseSessionStateDtoEnum } from "~/dto/pseconcretecasesession.dto";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseSituationApiObjectToDto, pseConcreteCaseSituationEntityToApiObject } from "./pseconcretecasesituation.mapper";
import { assertEnum } from "~/utils/enum";

export function pseConcreteCaseSessionEntityToApiObject(
  entity: PseConcreteCaseSessionEntity
): PseConcreteCaseSessionApiObject {
  return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		name: entity.name,
		state: pseConcreteCaseSessionStateStringToApiEnum(entity.state),

		groups: entity.groups.map(pseConcreteCaseGroupEntityToApiObject),
		situations: entity.situations.map(pseConcreteCaseSituationEntityToApiObject),

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
  entity: PseConcreteCaseSessionApiObject
): PseConcreteCaseSessionDto {
  return {
		id: entity.id,
		createdAt: entity.createdAt.toISOString(),
		updatedAt: entity.updatedAt.toISOString(),
		name: entity.name,
		state: pseConcreteCaseSessionStateApiEnumToDto(entity.state),
		stateLabel: getStateLabel(pseConcreteCaseSessionStateApiEnumToDto(entity.state)),
		groups: entity.groups.map(pseConcreteCaseGroupApiObjectToDto),
		situations: entity.situations.map(pseConcreteCaseSituationApiObjectToDto),
		isConfigured: entity.isConfigured,
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
    state: dto.state,
  };
}
function getStateLabel(state: PseConcreteCaseSessionStateDtoEnum) {
	switch (state) {
		case 'CREATED': return 'Non commencé'
		case 'RUNNING': return 'En cours'
		case 'CLOSED': return 'Fermé'
	}
}
