import type { UserMeApiObject } from "~/apiobject/user.apiobject";
import type { PermissionApiObject } from "~/apiobject/user.apiobject";

export interface RequestContext {
}

export interface AnonymousRequestContext extends RequestContext {}

export interface LoggedInRequestContext extends RequestContext {
  token: string;
  userMeApiObject: UserMeApiObject;
  permissions: Array<PermissionApiObject>;
}

export function isLoggedInRequestContext(
  requestContext: any
): requestContext is LoggedInRequestContext {
  // do not use proUserMeApiObject, it is ommitted on the getUserMe method,
  return "token" in requestContext;
}
