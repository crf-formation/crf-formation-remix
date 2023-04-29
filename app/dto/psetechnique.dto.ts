import type { PseModuleDto } from "./psemodule.dto";

export interface PseTechniqueDto {
  readonly id: string;
  readonly name: string;
  readonly requiredForPse1: boolean;
  readonly pseModule: PseModuleDto;
  readonly pseModuleId: string;
}