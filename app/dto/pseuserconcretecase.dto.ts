import { z } from "zod";
import type { PseUserConcreteCaseRoleApiEnum } from "~/apiobject/pseuserconcretecase.apiobject";
import type { PseConcreteCaseSituationDto } from "~/dto/pseconcretecasesituation.dto";
import type { PseCompetenceDto } from "./psecompetence.dto";
import type { PseConcreteCaseGroupDto } from "./pseconcretecasegroup.dto";
import type { UserDto } from "./user.dto";

export type PseUserConcreteCaseStateDtoEnum = "CREATED" | "RUNNING" | "CLOSED";
export type PseUserConcreteCaseRoleDtoEnum = "LEADER" | "MINION" | "WATCHER" | "UNKNOWN";

// readonly TODO: no zod on dtos?
export const PseUserConcreteCaseCompetenceGradeZEnum = z.enum(["A", "B", "C", "D", "NOT_EVALUATED"]);
export type PseUserConcreteCaseCompetenceGradeDtoEnum = z.infer<typeof PseUserConcreteCaseCompetenceGradeZEnum>

export const PseUserConcreteCaseRoleZEnum: z.ZodType<PseUserConcreteCaseRoleDtoEnum> = z.enum(["LEADER", "MINION", "WATCHER", "UNKNOWN"]);

export interface PseUserConcreteCaseDto {
  readonly id: string;
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;
  readonly userId: string;
  // optionally loaded
  readonly user?: UserDto;
  readonly pseConcreteCaseGroup: PseConcreteCaseGroupDto;
  readonly pseConcreteCaseSituation: PseConcreteCaseSituationDto;
  readonly state: PseUserConcreteCaseStateDtoEnum;
  readonly selected: boolean;
  readonly competences: Array<PseUserConcreteCaseCompetenceDto>;
  readonly role: PseUserConcreteCaseRoleDtoEnum;
}

export interface PseUserConcreteCaseCompetenceDto {
  readonly id: string;
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;
  readonly pseCompetenceId: string;
  readonly pseCompetence: PseCompetenceDto;
  readonly grade: PseUserConcreteCaseCompetenceGradeDtoEnum;
}


// --

export interface PseUserConcreteCaseGroupEvaluationDto {
  readonly formationId: string;
  readonly pseConcreteCaseSituationId: string;
  readonly pseConcreteCaseGroupId: string;
  readonly pseConcreteCaseSessionId: string;
  readonly pseConcreteCaseTypeId: string;
  readonly pseSituationConcreteCaseGroupId: string;

  readonly usersGrades: Array<PseUserEvaluationDto>;

  // utility data
  readonly competencesToEvaluate: Array<PseCompetenceDto>;
  readonly students: Array<UserDto>;
}

export interface PseUserEvaluationDto {
  readonly userId: string;
  readonly role: PseUserConcreteCaseRoleApiEnum;
  readonly grades: Array<PseEvaluationCompetenceGradeDto>;
}

export interface PseEvaluationCompetenceGradeDto {
  readonly pseCompetenceId: string;
  readonly shouldEvaluate: boolean;
  readonly grade: PseUserConcreteCaseCompetenceGradeDtoEnum; // should default to NOT_EVALUATED
}

// --

export interface PseUserConcreteCaseGroupEvaluationPostDto {
  readonly formationId: string;
  readonly pseConcreteCaseSituationId: string;
  readonly pseConcreteCaseGroupId: string;
  readonly pseConcreteCaseSessionId: string;
  readonly pseConcreteCaseTypeId: string;
  readonly pseSituationConcreteCaseGroupId: string;

  readonly usersGrades: Array<PseUserEvaluationPostDto>;
}

export interface PseUserEvaluationPostDto {
  readonly userId: string;
  readonly role: PseUserConcreteCaseRoleApiEnum;
  readonly grades: Array<PseEvaluationCompetenceGradePostDto>;
}

export interface PseEvaluationCompetenceGradePostDto {
  readonly pseCompetenceId: string;
  readonly grade: PseUserConcreteCaseCompetenceGradeDtoEnum; // should default to NOT_EVALUATED
}