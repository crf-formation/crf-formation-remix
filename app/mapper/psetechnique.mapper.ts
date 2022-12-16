import type { PseTechniqueEntity } from "~/entity";
import type { PseTechniqueApiObject } from "~/apiobject/psetechnique.apiobject";
import type { PseTechniqueDto } from "~/dto/psetechnique.dto";
import { pseModuleEntityToApiObject } from "./psemodule.mapper";

export function pseTechniqueApiObjectToDto(apiObject: PseTechniqueApiObject): PseTechniqueDto {
  return {
		id: apiObject.id,
		name: apiObject.name,
		requiredForPse1: apiObject.requiredForPse1,
		pseModule: apiObject.pseModule,
		pseModuleId: apiObject.pseModuleId,
  };
}

export function pseTechniqueEntityToApiObject(entity: PseTechniqueEntity): PseTechniqueApiObject {
  return {
		id: entity.id,
		name: entity.name,
		requiredForPse1: entity.requiredForPse1,
		pseModule: pseModuleEntityToApiObject(entity.pseModule),
		pseModuleId: entity.pseModuleId,
  }
}
