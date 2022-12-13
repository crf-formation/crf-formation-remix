import type { PseUserTechniqueEntity } from "~/apiobject/entity";
import type { PseUserTechniqueApiObject } from "~/apiobject/pseusertechnique.apiobject";
import type { PseUserTechniqueDto } from "~/dto/pseusertechnique.dto";
import { pseTechniqueApiObjectToDto, pseTechniqueEntityToApiObject } from "./psetechnique.mapper";

export function pseUserTechniqueEntityToApiObject(
  entity: PseUserTechniqueEntity
): PseUserTechniqueApiObject {
  return {
    id: entity.id,
    userId: entity.userId,
    formationId: entity.formationId,
    technique: pseTechniqueEntityToApiObject(entity.technique),
    techniqueId: entity.techniqueId,
  };
}

export function pseUserTechniqueApiObjectToDto(
  apiObject: PseUserTechniqueApiObject
): PseUserTechniqueDto {
  return {
    id: apiObject.id,
    userId: apiObject.userId,
    formationId: apiObject.formationId,
    technique: pseTechniqueApiObjectToDto(apiObject.technique),
    techniqueId: apiObject.techniqueId,
  };
}
