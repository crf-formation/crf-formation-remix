import type { Permission } from "~/constant/permission";

// extract our permissions string to build our Authority type.
type Keys = keyof typeof Permission;
export type AuthorityDtoEnum = (typeof Permission)[Keys];
