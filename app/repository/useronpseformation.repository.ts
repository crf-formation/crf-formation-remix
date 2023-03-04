import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { prisma } from "~/entity/db.server";
import type { UserOnPseFormationEntity } from "~/entity";
import { createPaginateObject } from "./abstract.repository";

const includeForSingleItem = {
  user: true
}

const includeForMultipleItem = {
  user: true
}

export async function findUserOnPseFormationEntityById(userId: string, formationId: string): Promise<Optional<UserOnPseFormationEntity>> {
	const userOnPpseFormationEntity = await prisma.userOnPseFormation.findUnique({
    where: { 
      formationId_userId: { 
        formationId,
        userId,
      }
    },
		include: includeForSingleItem
  });
  if (!userOnPpseFormationEntity) {
    return null;
  }
  return userOnPpseFormationEntity;
}

export async function findUserOnPseFormations(
	formationId: string,
	page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection,
): Promise<PaginateObject<UserOnPseFormationEntity>> {
	return await createPaginateObject<UserOnPseFormationEntity>({
    model: prisma.userOnPseFormation,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
			formationId
		},
		include: includeForMultipleItem
  });
}