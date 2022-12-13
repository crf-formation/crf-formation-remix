import type { PseModuleEntity } from "~/apiobject/entity";
import type { PseModuleApiObject } from "~/apiobject/psemodule.apiobject";
import type { PseModuleDto } from "~/dto/psemodule.dto";

export function pseModuleEntityToApiObject(
  entity: PseModuleEntity
): PseModuleApiObject {
  return {
    id: entity.id,
    name: entity.name,
    moduleId: entity.moduleId,
  };
}

export function pseModuleApiObjectToDto(
  entity: PseModuleApiObject
): PseModuleDto {
  return {
    id: entity.id,
    name: entity.name,
    moduleId: entity.moduleId,
  };
}
