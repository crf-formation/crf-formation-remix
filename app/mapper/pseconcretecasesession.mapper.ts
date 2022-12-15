import { isEmpty } from "lodash";
import type { PseConcreteCaseSessionEntity } from "~/apiobject/entity";
import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionStateApiEnum } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSessionDto, PseConcreteCaseSessionStateDtoEnum } from "~/dto/pseconcretecasesession.dto";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";

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
	// TODO: enforce validity
	return state as PseConcreteCaseSessionStateApiEnum
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
		groups: entity.groups.map(pseConcreteCaseGroupApiObjectToDto),
		situations: entity.situations.map(pseConcreteCaseSituationApiObjectToDto),
		isConfigured: entity.isConfigured,
  };
}


function pseConcreteCaseSessionStateApiEnumToDto(state: PseConcreteCaseSessionStateApiEnum): PseConcreteCaseSessionStateDtoEnum {
	// TODO: enforce validity
	return state as PseConcreteCaseSessionStateDtoEnum
}