import type { AuthorityApiEnum } from "~/apiobject/permission.apiobject";
import type { PermissionApiObject } from "~/apiobject/user.apiobject";

export function hasAuthority(
  permissions: Optional<Array<PermissionApiObject>>,
  authority: AuthorityApiEnum
): boolean {
  if (!permissions) {
    return false;
  }
  return permissions.some(
    (permission: PermissionApiObject) => permission.identifier === authority
  );
}
