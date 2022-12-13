import type { PseTechniqueApiObject } from "./psetechnique.apiobject";


export interface PseUserTechniqueApiObject {
	id: Optional<string>; // null when object not yet created on database
  userId: string;
  formationId: string;
  technique: PseTechniqueApiObject;
  techniqueId: string;
  acquired: boolean;
}