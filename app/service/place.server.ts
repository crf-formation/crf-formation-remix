import type { PlaceApiObject } from "~/apiobject/place.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { placeEntityToApiObject } from "~/mapper/place.mapper";
import { findPlaceEntityById, findPlaces } from "~/repository/place.repository";

export async function findPlaceById(
  id: string
): Promise<Optional<PlaceApiObject>> {
  const pseFormationEntity = await findPlaceEntityById(id);
  if (!pseFormationEntity) {
    return null;
  }
  return placeEntityToApiObject(pseFormationEntity);
}


export async function getPlaces(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<PlaceApiObject>> {
  const placeEntities = await findPlaces(page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(placeEntities, placeEntityToApiObject);
}

