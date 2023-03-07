import type { PseTechniqueDto } from "./psetechnique.dto";


export interface PseUserTechniqueDto {
	readonly id: Optional<string>; // null when object not yet created on database
  readonly userId: string;
  readonly formationId: string;
  readonly technique: PseTechniqueDto;
  readonly techniqueId: string;
  readonly acquired: boolean;
}