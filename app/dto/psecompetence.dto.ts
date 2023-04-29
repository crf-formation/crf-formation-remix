export interface PseCompetenceDto {
  readonly id: string;
  readonly description: string;
  readonly requiredCountToValidatePseGlobal: number;
  readonly requiredCountToValidatePse1: number;
}
