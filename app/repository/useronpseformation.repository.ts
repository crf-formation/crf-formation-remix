import { prisma } from "~/db.server";
import type { UserOnPseFormationEntity } from "~/apiobject/entity";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";

export async function findUserOnPseFormationEntityById(formationId: string, userId: string): Promise<Optional<UserOnPseFormationEntity>> {
	const useronpseformationEntity = await prisma.userOnPseFormation.findUnique({
    where: { formationId, userId },
		include: { user: true }
  });
  if (!useronpseformationEntity) {
    return null;
  }
  return useronpseformationEntity;
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