import type { UserOnPseFormationApiObject } from "~/apiobject/useronpseformation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userOnPseformationEntityToApiObject } from "~/mapper/useronpseformation.mapper";
import { findUserOnPseFormationEntityById, findUserOnPseFormations } from "~/repository/useronpseformation.repository";

export async function findUserOnPseFormationById(
  id: string
): Promise<Optional<UserOnPseFormationApiObject>> {
  const pseFormationEntity = await findUserOnPseFormationEntityById(id);
  if (!pseFormationEntity) {
    return null;
  }
  return userOnPseformationEntityToApiObject(pseFormationEntity);
}


export async function getUserOnPseFormations(
	formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserOnPseFormationApiObject>> {
  const userOnPseformationEntities = await findUserOnPseFormations(formationId, page, pageSize, orderBy, orderByDirection);
	console.log({ userOnPseformationEntities })
  return paginateEntityToApiObject(userOnPseformationEntities, userOnPseformationEntityToApiObject);
}

