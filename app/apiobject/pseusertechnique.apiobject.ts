import type { PseTechniqueApiObject } from "./psetechnique.apiobject";


export interface PseUserTechniqueApiObject {
	readonly id: Optional<string>; // null when object not yet created on database
  readonly userId: string;
  readonly formationId: string;
  readonly technique: PseTechniqueApiObject;
  readonly techniqueId: string;
  readonly acquired: boolean;
}