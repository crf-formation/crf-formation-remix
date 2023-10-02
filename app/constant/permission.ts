export const Permission = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',

  RESOURCE_MANAGER_USER_LIST: "resourcemanager.prouser.list",
  RESOURCE_MANAGER_USER_CREATE: "resourcemanager.prouser.create",
  RESOURCE_MANAGER_USER_UPDATE: "resourcemanager.prouser.update",

  RESOURCE_MANAGER_FORMATION_LIST: "resourcemanager.formation.list",
  RESOURCE_MANAGER_FORMATION_CREATE: "resourcemanager.formation.create",
  RESOURCE_MANAGER_FORMATION_UPDATE: "resourcemanager.formation.update",
  // when adding new permission, add it to createPermissions

} as const; // enable us to extract the values on Authority
