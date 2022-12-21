import type {
  PseConcreteCaseGroupEntity,
  PseUserConcreteCaseGroupStudentEntity,
} from "~/entity";
import type {
  PseConcreteCaseGroupApiObject,
  PseConcreteCaseGroupPostApiObject,
  PseConcreteCaseGroupPutApiObject,
  PseUserConcreteCaseGroupStudentApiObject,
} from "~/apiobject/pseconcretecasegroup.apiobject";
import type {
  PseConcreteCaseGroupDto,
  PseConcreteCaseGroupPostDto,
  PseConcreteCaseGroupPutDto,
  PseUserConcreteCaseGroupStudentDto,
} from "~/dto/pseconcretecasegroup.dto";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";
import { uniq } from "lodash";

export function pseConcreteCaseGroupEntityToApiObject(
  entity: PseConcreteCaseGroupEntity
): PseConcreteCaseGroupApiObject {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    name: entity.name,
    pseConcreteCaseSessionId: entity.pseConcreteCaseSessionId,
    students: entity.students.map(
      pseUserConcreteCaseGroupStudentEntityToApiObject
    ),
  };
}

function pseUserConcreteCaseGroupStudentEntityToApiObject(
  entity: PseUserConcreteCaseGroupStudentEntity
): PseUserConcreteCaseGroupStudentApiObject {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    userId: entity.userId,
    user: entity.user && userEntityToApiObject(entity.user),
  };
}

export function pseConcreteCaseGroupApiObjectToDto(
  apiObject: PseConcreteCaseGroupApiObject
): PseConcreteCaseGroupDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt?.toISOString(), // TODO: fix date
    updatedAt: apiObject.updatedAt?.toISOString(), // TODO: fix date
    name: apiObject.name,
    pseConcreteCaseSessionId: apiObject.pseConcreteCaseSessionId,
    students: apiObject.students.map(
      pseUserConcreteCaseGroupStudentApiObjectToDto
    ),
  };
}
function pseUserConcreteCaseGroupStudentApiObjectToDto(
  apiObject: PseUserConcreteCaseGroupStudentApiObject
): PseUserConcreteCaseGroupStudentDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt?.toISOString(), // TODO: fix date
    updatedAt: apiObject.updatedAt?.toISOString(), // TODO: fix date
    userId: apiObject.userId,
    user: apiObject.user && userApiObjectToDto(apiObject.user),
  };
}

export function pseConcreteCaseGroupPostDtoToApiObject(
  dto: PseConcreteCaseGroupPostDto
): PseConcreteCaseGroupPostApiObject {
  return {
    pseConcreteCaseSessionId: dto.pseConcreteCaseSessionId,
    name: dto.name,
    students: uniq(dto.students),
  };
}

export function pseConcreteCaseGroupPutDtoToApiObject(
  dto: PseConcreteCaseGroupPutDto
): PseConcreteCaseGroupPutApiObject {
  return {
    pseConcreteCaseSessionId: dto.pseConcreteCaseSessionId,
    name: dto.name,
    students: uniq(dto.students),
  };
}
