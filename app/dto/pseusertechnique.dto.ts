import type { PseTechniqueDto } from "./psetechnique.dto";


export interface PseUserTechniqueDto {
	id: Optional<string>; // null when object not yet created on database
  userId: string;
  formationId: string;
  technique: PseTechniqueDto;
  techniqueId: string;
}