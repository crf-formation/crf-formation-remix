import type { UserOnPseFormationEntity } from "~/entity";
import { findUserOnPseFormationEntityById } from "~/repository/useronpseformation.repository";
import { ForbiddenException } from "./api.error";


export async function assertUserHasAccessToFormationAsTeacher(userId: string, formationId: string) {
	const userOnPseFormationEntity: Optional<UserOnPseFormationEntity> = await findUserOnPseFormationEntityById(userId, formationId)
	if (!userOnPseFormationEntity) {
		throw new ForbiddenException(`User ${userId} does not have access to formation ${formationId}: not found`);
	}
	const hasAccess = userOnPseFormationEntity !== null && userOnPseFormationEntity?.role === 'TEACHER';

	if (!hasAccess) {
		throw new ForbiddenException(`User ${userOnPseFormationEntity.email} (${userOnPseFormationEntity.id}) does not have access to formation ${formationId}`);
	}
}
