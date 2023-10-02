import type { AuthorityApiEnum } from "~/apiobject/permission.apiobject";
import type { PermissionApiObject } from "~/apiobject/user.apiobject";
import { hasAuthority } from "~/helper/permission.helper";
import { findUserOnPseFormationEntityById } from "~/repository/useronpseformation.repository";
import { ForbiddenException } from "./api.error";
import { forbidden } from "~/helper/responses.helper";

export function preAuthorize(
  permissions: Array<PermissionApiObject>,
  permission: AuthorityApiEnum
) {
  if (!hasAuthority(permissions, permission)) {
    const missingPermissions = [permission];
    throw forbidden({
      message: `Missing permissions: ${missingPermissions.join(", ")}`,
      missingPermissions,
    });
  }
}

export async function assertUserHasAccessToFormationAsTeacher(userId: string, formationId: string) {
  const userOnPseFormationEntity = await findUserOnPseFormationEntityById(userId, formationId);
  if (!userOnPseFormationEntity) {
    throw new ForbiddenException(`User ${userId} does not have access to formation ${formationId}: not found`);
  }
  const hasAccess = userOnPseFormationEntity !== null && userOnPseFormationEntity?.role === "TEACHER";

  if (!hasAccess) {
    throw new ForbiddenException(`User ${userOnPseFormationEntity.user.email} (${userOnPseFormationEntity.id}) does not have access to formation ${formationId}`);
  }
}
