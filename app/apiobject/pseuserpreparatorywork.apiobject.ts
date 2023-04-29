import type { PseModuleApiObject } from "./psemodule.apiobject";

export interface PseUserPreparatoryWorkApiObject {
  readonly id: Optional<string>; // null when object not yet created on database
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly userId: string;
  readonly formationId: string;
  readonly pseModule: PseModuleApiObject;
  readonly pseModuleId: string;
  readonly openingDate?: Optional<Date>;
  readonly realisedDate?: Optional<Date>;
  readonly realised: boolean;
}

export interface PseUserPreparatoryWorkPostApiObject {
  pseModuleId: string;
  openingDate: Optional<DateISOString>;
  realisedDate: Optional<DateISOString>;
  realised: boolean;
}