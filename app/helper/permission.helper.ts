import type { AuthorityApiEnum } from "~/apiobject/permission.apiobject";
import type { ProPermissionApiObject } from "~/apiobject/prouser.apiobject";

export function hasAuthority(
  permissions: Optional<Array<ProPermissionApiObject>>,
  authority: AuthorityApiEnum
): boolean {
  if (!permissions) {
    return false;
  }
  return permissions.some(
    (permission: ProPermissionApiObject) => permission.identifier === authority
  );
}
