import type {
  PseFormationApiObject,
  PseFormationPostApiObject,
  PseFormationPutApiObject
} from "~/apiobject/pseformation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { pseFormationEntityToApiObject } from "~/mapper/pseformation.mapper";
import {
  createPseFormationEntity,
  findCurrentPseFormationEntityForUser,
  findPseFormationEntities,
  findPseFormationEntityById,
  findPseFormationEntityByPseConcreteCaseSessionId,
  findPseFormationForUserEntities,
  updatePseFormationEntity
} from "~/repository/pseformation.repository";
import { NotFoundException } from "./api.error";

export async function updatePseFormation(
  pseFormationId: string,
  pseFormationPutApiObject: PseFormationPutApiObject
) {
  const pseFormationEntity = await updatePseFormationEntity(pseFormationId, pseFormationPutApiObject);
  return pseFormationEntityToApiObject(pseFormationEntity);
}

export async function createPseFormation(
  pseFormationPostApiObject: PseFormationPostApiObject
): Promise<PseFormationApiObject> {
  const pseFormationEntity = await createPseFormationEntity(pseFormationPostApiObject);
  return pseFormationEntityToApiObject(pseFormationEntity);
}

export async function findPseFormationById(
  id: string
): Promise<Optional<PseFormationApiObject>> {
  const pseFormationEntity = await findPseFormationEntityById(id);
  if (!pseFormationEntity) {
    return null;
  }
  return pseFormationEntityToApiObject(pseFormationEntity);
}

export async function getPseFormationById(
  id: string
): Promise<PseFormationApiObject> {
  const pseFormationEntity = await findPseFormationEntityById(id);
  if (!pseFormationEntity) {
    throw new NotFoundException("PseFormation", id);
  }
  return pseFormationEntityToApiObject(pseFormationEntity);
}


export async function getPseFormations(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<PseFormationApiObject>> {
  const pseFormationEntities = await findPseFormationEntities(page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(pseFormationEntities, pseFormationEntityToApiObject);
}

export async function getUserPseFormations(
  userId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<PseFormationApiObject>> {
  const pseFormationPaginateObjectEntities = await findPseFormationForUserEntities(userId, page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(pseFormationPaginateObjectEntities, pseFormationEntityToApiObject);
}

export async function getCurrentPseFormationForUser(userId: string): Promise<Optional<PseFormationApiObject>> {
  const pseFormationEntity = await findCurrentPseFormationEntityForUser(userId);
  if (!pseFormationEntity) {
    return null;
  }
  return pseFormationEntityToApiObject(pseFormationEntity);
}

export async function getPseFormationByPseConcreteCaseSessionId(concreteCaseSessionId: string): Promise<PseFormationApiObject> {
  const entity = await findPseFormationEntityByPseConcreteCaseSessionId(concreteCaseSessionId);
  if (entity == null) {
    throw new NotFoundException("findPseFormationEntityByPseConcreteCaseSessionId", concreteCaseSessionId);
  }
  return pseFormationEntityToApiObject(entity);
}