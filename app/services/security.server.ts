import type { UserOnPseFormationEntity } from "~/entity";
import { findUserOnPseFormationEntityById } from "~/repository/useronpseformation.repository";
import { ForbiddenException } from "./api.error";


export async function assertUserHasAccessToFormationAsTeacher(userId: string, formationId: string) {
	const hasAccess: boolean = await userHasAccessToFormationAsTeacher(userId, formationId)
	if (!hasAccess) {
		throw new ForbiddenException(`User ${userId} does not have access to formation ${formationId}`);
	}
}

export async function userHasAccessToFormationAsTeacher(userId: string, formationId: string): Promise<boolean> {
	const userOnPseFormationEntity: Optional<UserOnPseFormationEntity> = await findUserOnPseFormationEntityById(userId, formationId)
	console.log({ userOnPseFormationEntity })
	return userOnPseFormationEntity !== null && userOnPseFormationEntity?.role === 'TEACHER';
}
