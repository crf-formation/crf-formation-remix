import type {
  PseConcreteCaseGroupApiObject,
  PseConcreteCaseGroupPostApiObject,
  PseConcreteCaseGroupPutApiObject
} from "~/apiobject/pseconcretecasegroup.apiobject";
import {
  createPseConcreteCaseGroupEntity,
  findPseConcreteCaseGroupEntity,
  updatePseConcreteCaseGroupEntity
} from "~/repository/pseconcretecasegroup.repository";
import { pseConcreteCaseGroupEntityToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { NotFoundException } from "./api.error";

export async function getPseConcreteCaseGroup(id: string): Promise<PseConcreteCaseGroupApiObject> {
  const entity = await findPseConcreteCaseGroupEntity(id);
  if (entity == null) {
    throw new NotFoundException("PseConcreteCaseGroupEntity", id);
  }
  return pseConcreteCaseGroupEntityToApiObject(entity);
}

export async function createPseConcreteCaseGroup(
  pseConcreteCaseGroupPostApiObject: PseConcreteCaseGroupPostApiObject
): Promise<PseConcreteCaseGroupApiObject> {
  // TODO: verify students are valid and exists

  const entity = await createPseConcreteCaseGroupEntity(pseConcreteCaseGroupPostApiObject);
  return pseConcreteCaseGroupEntityToApiObject(entity);
}

export async function updatePseConcreteCaseGroup(
  id: string,
  pseConcreteCaseGroupPutApiObject: PseConcreteCaseGroupPutApiObject
): Promise<PseConcreteCaseGroupApiObject> {
  // TODO: verify students are valid and exists

  const entity = await updatePseConcreteCaseGroupEntity(id, pseConcreteCaseGroupPutApiObject);
  return pseConcreteCaseGroupEntityToApiObject(entity);
}
