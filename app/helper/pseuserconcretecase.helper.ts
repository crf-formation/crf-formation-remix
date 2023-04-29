import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type {
  PseConcreteCaseSituationApiObject,
  PseSituationConcreteCaseGroupApiObject
} from "~/apiobject/pseconcretecasesituation.apiobject";
import type {
  PseUserConcreteCaseApiObject,
  PseUserConcreteCaseGroupEvaluationApiObject
} from "~/apiobject/pseuserconcretecase.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PseFormationApiObject } from "../apiobject/pseformation.apiobject";

/**
 * Build conveniant data to evaluate a group of students for a concrete case.
 */
export function buildPseUserConcreteCaseGroupEvaluation(
  pseFormation: PseFormationApiObject,
  pseConcreteCaseSession: PseConcreteCaseSessionApiObject,
  pseConcreteCaseSituation: PseConcreteCaseSituationApiObject,
  pseConcreteCaseGroup: PseConcreteCaseGroupApiObject,
  pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupApiObject,
  pseUserConcreteCases: Array<PseUserConcreteCaseApiObject>,
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
      const user = student.user;
      if (!user) {
        throw new Error(`User not loaded on PseConcreteCaseGroup.students`);
      }

      // null if the user has not been evaluated yet.
      const pseUserConcreteCase = pseUserConcreteCases.find((pseUserConcreteCase) => pseUserConcreteCase.userId === user.id);

      console.log({
        pseUserConcreteCase: JSON.stringify(pseUserConcreteCase, null, 2)
      });

      return {
        userId: user.id,
        role: "UNKNOWN",
        grades: pseCompetences.map((pseCompetence) => {
          const shouldEvaluate =
            !!pseConcreteCaseSituation.pseConcreteCaseType.competencesToEvaluate.find(
              (p) => p.id === pseCompetence.id
            );

          const grade = pseUserConcreteCase?.competences?.find(c => c.pseCompetence.id === pseCompetence.id)?.grade
            ?? "NOT_EVALUATED";

          return {
            pseCompetenceId: pseCompetence.id,
            shouldEvaluate,
            grade
          };
        })
      };
    })
  };
}