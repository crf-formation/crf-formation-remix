

export interface PseUserConcreteCasePostEntity {
	userId: string;
	pseConcreteCaseTypeId: string;
	pseConcreteCaseGroupId: string;
	role: string;
	grades: Array<{
		pseCompetenceId: string;
		grade: string;
	}>;
}

