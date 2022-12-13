import type { PseModuleApiObject } from "./psemodule.apiobject";

export interface PseUserPreparatoryWorkApiObject {
	id: string;
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