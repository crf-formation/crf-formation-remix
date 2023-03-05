

export interface PseUserConcreteCasePostEntity {
	userId: string;
	pseSituationConcreteCaseGroupId: string;
	role: string;
	grades: Array<{
		pseCompetenceId: string;
		grade: string;
	}>;
}

