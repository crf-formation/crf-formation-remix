import type { PseModuleDto } from "./psemodule.dto";

export interface PseTechniqueDto {
	id: string;
	name: string;
	requiredForPse1: boolean;
	pseModule: PseModuleDto;
	pseModuleId: string;
}