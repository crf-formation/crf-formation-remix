import { prisma } from "~/db.server";
import type { UserOnPseFormationEntity } from "~/apiobject/entity";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";

export async function findUserOnPseFormationEntityById(userId: string, formationId: string): Promise<Optional<UserOnPseFormationEntity>> {
	const userOnPpseFormationEntity = await prisma.userOnPseFormation.findUnique({
    where: { 
      formationId_userId: { 
        formationId,
        userId,
      }
    },
		include: { user: true }
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
		include: { user: true }
  });
}