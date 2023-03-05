import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import type { PseEvaluationCompetenceGradePostDto, PseUserConcreteCaseGroupEvaluationPostDto, PseUserGradesEvaluationPostDto } from "~/dto/pseuserconcretecase.dto";
import { PseUserConcreteCaseCompetenceGradeZEnum } from "~/dto/pseuserconcretecase.dto";

const PseUserConcreteCaseGradeSchema: z.ZodType<PseEvaluationCompetenceGradePostDto> = 
	z.object({
		pseCompetenceId: z.string(),
		grade: PseUserConcreteCaseCompetenceGradeZEnum
	}
)

const PseUserConcreteCaseSchema: z.ZodType<PseUserGradesEvaluationPostDto> =  z.object({
	userId: z.string(),
	grades: z.array(PseUserConcreteCaseGradeSchema)
})

export const PseUserConcreteCaseGroupEvaluationPostDtoPostSchema: z.ZodType<PseUserConcreteCaseGroupEvaluationPostDto> = z.object({
	formationId: z.string(),
	pseConcreteCaseSituationId: z.string(),
	pseConcreteCaseGroupId: z.string(),
	pseConcreteCaseSessionId: z.string(),

	usersGrades: zfd.json(z.array(PseUserConcreteCaseSchema))
});

export const pseUserConcreteCaseGroupEvaluationPostDtoValidator = withZod(PseUserConcreteCaseGroupEvaluationPostDtoPostSchema)
