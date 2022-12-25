import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { PseUserConcreteCaseCompetenceGradeZEnum } from "~/dto/pseuserconcretecase.dto";

export const UserConcreteCaseSchema = z.array(
	z.object({ // PseUserConcreteCaseCompetence
		pseCompetenceId: z.string(),
		grade: PseUserConcreteCaseCompetenceGradeZEnum.default(PseUserConcreteCaseCompetenceGradeZEnum.Enum.NOT_EVALUATED)
	})
)

export const PseConcreteCaseSituationGroupEvaluatePostSchema = z.object({
  formationId: z.string(),
	pseConcreteCaseSituationId: z.string(),
	pseSituationConcreteCaseGroupId: z.string(),

	users: z.array(z.object({
		userId: z.string(),
		grades: UserConcreteCaseSchema
	}))
});

export const pseConcreteCaseSituationGroupEvaluatePostDtoValidator = withZod(PseConcreteCaseSituationGroupEvaluatePostSchema)
