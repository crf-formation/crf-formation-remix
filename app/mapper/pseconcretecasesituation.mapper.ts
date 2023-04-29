import type {
  PseConcreteCaseSituationApiObject,
  PseConcreteCaseSituationPostApiObject,
  PseConcreteCaseSituationPutApiObject,
  PseSituationConcreteCaseGroupPutApiObject
} from "~/apiobject/pseconcretecasesituation.apiobject";
import type {
  PseConcreteCaseSituationDto,
  PseConcreteCaseSituationPostDto,
  PseConcreteCaseSituationPutDto,
  PseSituationConcreteCaseGroupDto,
  PseSituationConcreteCaseGroupPostDto,
  PseSituationConcreteCaseGroupPutDto
} from "~/dto/pseconcretecasesituation.dto";
import type { PseConcreteCaseSituationEntity, PseSituationConcreteCaseGroupEntity } from "~/entity";
import type { PseSituationConcreteCaseGroupApiObject } from "../apiobject/pseconcretecasesituation.apiobject";
import { pseConcreteCaseGroupApiObjectToDto } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseTypeApiObjectToDto, pseConcreteCaseTypeEntityToApiObject } from "./pseconcretecasetype.mapper";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";


export function pseConcreteCaseSituationEntityToApiObject(entity: PseConcreteCaseSituationEntity): PseConcreteCaseSituationApiObject {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    teacherId: entity.teacherId,
    pseConcreteCaseTypeId: entity.pseConcreteCaseTypeId,
    pseConcreteCaseSessionId: entity.pseConcreteCaseSessionId,
    teacher: entity.teacher && userEntityToApiObject(entity.teacher),
    pseConcreteCaseType: pseConcreteCaseTypeEntityToApiObject(entity.pseConcreteCaseType),
    pseSituationConcreteCaseGroups: entity.pseSituationConcreteCaseGroups?.map(pseSituationConcreteCaseGroupEntityToApiObject)
  };
}

export function pseConcreteCaseSituationApiObjectToDto(apiObject: PseConcreteCaseSituationApiObject): PseConcreteCaseSituationDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt.toISOString(),
    updatedAt: apiObject.updatedAt.toISOString(),
    teacherId: apiObject.teacherId,
    teacher: apiObject.teacher && userApiObjectToDto(apiObject.teacher),
    name: apiObject.pseConcreteCaseType.name,
    pseConcreteCaseType: pseConcreteCaseTypeApiObjectToDto(apiObject.pseConcreteCaseType),
    pseSituationConcreteCaseGroups: apiObject.pseSituationConcreteCaseGroups?.map(pseSituationConcreteCaseGroupApiObjectToDto)
  };
}

export function pseConcreteCaseSituationPostDtoToApiObject(postDto: PseConcreteCaseSituationPostDto): PseConcreteCaseSituationPostApiObject {
  return {
    pseConcreteCaseSessionId: postDto.pseConcreteCaseSessionId,
    pseConcreteCaseTypeId: postDto.pseConcreteCaseTypeId,
    teacherId: postDto.teacherId,
    pseSituationConcreteCaseGroups: (postDto.pseSituationConcreteCaseGroups || []).map(pseSituationConcreteCaseGroupPostDtoToApiObject)
  };
}


export function pseConcreteCaseSituationPutDtoToApiObject(putDto: PseConcreteCaseSituationPutDto, current: PseConcreteCaseSituationApiObject, pseConcreteCaseSessionId: string): PseConcreteCaseSituationPutApiObject {
  return {
    pseConcreteCaseSessionId,
    pseConcreteCaseTypeId: putDto.pseConcreteCaseTypeId,
    teacherId: putDto.teacherId,
    pseSituationConcreteCaseGroups: putDto.pseSituationConcreteCaseGroups.map(pseSituationConcreteCaseGroup =>
      pseSituationConcreteCaseGroupPutDtoToApiObject(pseSituationConcreteCaseGroup, current.pseSituationConcreteCaseGroups?.find(u => pseSituationConcreteCaseGroup.id === u.id)))
  };
}


function pseSituationConcreteCaseGroupEntityToApiObject(entity: PseSituationConcreteCaseGroupEntity): PseSituationConcreteCaseGroupApiObject {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    pseConcreteCaseGroupId: entity.pseConcreteCaseGroupId,
    pseConcreteCaseGroup: entity.pseConcreteCaseGroup,
    position: entity.position
  };
}

function pseSituationConcreteCaseGroupApiObjectToDto(apiObject: PseSituationConcreteCaseGroupApiObject): PseSituationConcreteCaseGroupDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt.toUTCString(),
    updatedAt: apiObject.updatedAt.toUTCString(),
    pseConcreteCaseGroupId: apiObject.pseConcreteCaseGroupId,
    pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(apiObject.pseConcreteCaseGroup),
    position: apiObject.position
  };
}

function pseSituationConcreteCaseGroupPostDtoToApiObject(dto: PseSituationConcreteCaseGroupPostDto): PseSituationConcreteCaseGroupPutApiObject {
  return {
    pseConcreteCaseGroupId: dto.pseConcreteCaseGroupId,
    position: dto.position
  };
}

function pseSituationConcreteCaseGroupPutDtoToApiObject(dto: PseSituationConcreteCaseGroupPutDto, other: Optional<PseSituationConcreteCaseGroupApiObject>): PseSituationConcreteCaseGroupPutApiObject {
  return {
    id: other?.id,
    pseConcreteCaseGroupId: dto.pseConcreteCaseGroupId,
    position: dto.position
  };
}