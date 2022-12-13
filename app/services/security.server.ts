import type { UserOnPseFormationEntity } from "~/apiobject/entity";
import { findUserOnPseFormationEntityById } from "~/repository/useronpseformation.repository";
import { ForbiddenException } from "./api.error";


export async function assertUserHasAccessToFormation(userId: string, formationId: string) {
	const hasAccess: boolean = await userHasAccessToFormation(userId, formationId)
	if (!hasAccess) {
		throw new ForbiddenException(`User ${userId} does not have access to formation ${formationId}`);
	}
}


export async function userHasAccessToFormation(userId: string, formationId: string): Promise<boolean> {
	const userOnPseFormationEntity: Optional<UserOnPseFormationEntity> = await findUserOnPseFormationEntityById(userId, formationId)
	return userOnPseFormationEntity !== null;
}
