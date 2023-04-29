import type { PseModuleApiObject } from "./psemodule.apiobject";

export interface PseTechniqueApiObject {
  readonly id: string;
  readonly name: string;
  readonly requiredForPse1: boolean;
  // TODO: rename to module?
  readonly pseModule: PseModuleApiObject;
  readonly pseModuleId: string;
}