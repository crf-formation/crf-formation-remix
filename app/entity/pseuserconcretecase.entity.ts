export interface PseUserConcreteCasePostEntity {
  readonly userId: string;
  readonly pseSituationConcreteCaseGroupId: string;
  readonly role: string;
  readonly grades: Array<{
    readonly pseCompetenceId: string;
    readonly grade: string;
  }>;
}

