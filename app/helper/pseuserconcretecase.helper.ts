import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject, PseSituationConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseUserConcreteCaseGroupEvaluationApiObject } from "~/apiobject/pseuserconcretecase.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PseFormationApiObject } from '../apiobject/pseformation.apiobject';

/**
 * Build conveniant data to evaluate a group of students for a concrete case.
 */
export function buildPseUserConcreteCaseGroupEvaluation(
	pseFormation: PseFormationApiObject,
	pseConcreteCaseSession: PseConcreteCaseSessionApiObject,
  pseConcreteCaseSituation: PseConcreteCaseSituationApiObject,
  pseConcreteCaseGroup: PseConcreteCaseGroupApiObject,
  pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupApiObject,
  pseCompetences: Array<PseCompetenceApiObject>
): PseUserConcreteCaseGroupEvaluationApiObject {
  return {
    formationId: pseFormation.id,
			
		pseConcreteCaseSessionId: pseConcreteCaseSession.id,
    pseConcreteCaseSituationId: pseConcreteCaseSituation.id,
    pseConcreteCaseGroupId: pseConcreteCaseGroup.id,
    pseConcreteCaseTypeId: pseConcreteCaseSituation.pseConcreteCaseTypeId,
    pseSituationConcreteCaseGroupId: pseSituationConcreteCaseGroup.id,

    students: pseConcreteCaseGroup.students
      .map(
        (pseUserConcreteCaseGroupStudentApiObject) =>
          pseUserConcreteCaseGroupStudentApiObject.user as UserApiObject
      ),

    competencesToEvaluate: pseConcreteCaseSituation.pseConcreteCaseType.competencesToEvaluate,

    usersGrades: pseConcreteCaseGroup.students.map((student) => {
      if (!student.user) {
        throw new Error(`User not loaded on PseConcreteCaseGroup.students`)
      }
      return {
        userId: student.user.id,
        role: 'UNKNOWN',
        grades: pseCompetences.map((pseCompetence) => {
          const shouldEvaluate =
            !!pseConcreteCaseSituation.pseConcreteCaseType.competencesToEvaluate.find(
              (p) => p.id === pseCompetence.id
            );
          return {
            pseCompetenceId: pseCompetence.id,
            shouldEvaluate,
            grade: "NOT_EVALUATED",
          };
        }),
      };
    }),
  };
}