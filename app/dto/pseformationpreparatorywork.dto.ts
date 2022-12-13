import type { PseModuleDto } from "./psemodule.dto";

export interface PseUserPreparatoryWorkDto {
	id: string;
  createdAt: DateISOString;
  updatedAt: DateISOString;
  userId: string;
  formationId: string;
  pseModule: PseModuleDto;
  pseModuleId: string;
  openingDate: Optional<DateISOString>;
  realisedDate: Optional<DateISOString>;
  realised: boolean;
}