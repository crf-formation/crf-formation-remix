import type { PseModuleApiObject } from "./psemodule.apiobject";

export interface PseUserPreparatoryWorkApiObject {
	id: Optional<string>; // null when object not yet created on database
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  formationId: string;
  pseModule: PseModuleApiObject;
  pseModuleId: string;
  openingDate?: Optional<Date>;
  realisedDate?: Optional<Date>;
  realised: boolean;
}