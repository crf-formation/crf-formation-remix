import type { PseModuleEntity } from "~/apiobject/entity";
import type { PseModuleApiObject } from "~/apiobject/psemodule.apiobject";

export function pseModuleEntityToApiObject(
  entity: PseModuleEntity
): PseModuleApiObject {
  return {
    id: entity.id,
    name: entity.name,
    moduleId: entity.moduleId,
  };
}
