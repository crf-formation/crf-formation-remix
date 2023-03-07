import type { PseModuleDto } from "./psemodule.dto";

export interface PseUserPreparatoryWorkDto {
	readonly id: Optional<string>; // null when object not yet created on database
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;
  readonly userId: string;
  readonly formationId: string;
  readonly pseModule: PseModuleDto;
  readonly pseModuleId: string;
  readonly openingDate: Optional<DateISOString>;
  readonly realisedDate: Optional<DateISOString>;
  readonly realised: boolean;
}