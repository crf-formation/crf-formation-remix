import type {
  PseFormationApiObject,
  PseFormationPostApiObject,
  PseFormationPutApiObject,
} from "~/apiobject/pseformation.apiobject";
import {
  createPseFormationEntity,
  findPseFormationEntityById,
  findPseFormations,
  updatePseFormationEntity,
} from "~/repository/pseformation.repository";
import { pseFormationEntityToApiObject } from "~/mapper/psepseformation.mapper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import type { OrderByDirection, PaginateObject } from "~/constants/types";

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

export async function getPseFormations(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<PseFormationApiObject>> {
  const pseFormationEntities = await findPseFormations(page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(pseFormationEntities, pseFormationEntityToApiObject);
}

