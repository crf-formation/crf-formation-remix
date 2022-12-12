import { prisma } from "~/db.server";
import type { PlaceEntity } from "~/apiobject/entity";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";

export async function findPlaceEntityById(id: string): Promise<Optional<PlaceEntity>> {
	const placeEntity = await prisma.place.findUnique({
    where: { id },
  });
  if (!placeEntity) {
    return null;
  }
  return placeEntity;
}


export async function findPlaces(
	page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection,
): Promise<PaginateObject<PlaceEntity>> {
	return await createPaginateObject<PlaceEntity>({
    model: prisma.place,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {},
  });
}