import type { PermissionApiObject } from "~/apiobject/user.apiobject";
import { hasAuthority } from "~/helper/permission.helper";

describe(hasAuthority.name, () => {
  test("hasAuthority: true", async () => {
    const permissions: Array<PermissionApiObject> = [
      {
        id: "1",
        identifier: "resourcemanager.prouser.create",
        technicalName: "",
        technicalDescription: "",
      },
    ];

    expect(hasAuthority(permissions, "resourcemanager.prouser.create")).toBeTruthy();
  });

  test("hasAuthority: false", async () => {
    const permissions: Array<PermissionApiObject> = [
      {
        id: "1",
        identifier: "resourcemanager.prouser.list",
        technicalName: "",
        technicalDescription: "",
      },
    ];

    expect(hasAuthority(permissions, "resourcemanager.prouser.create")).toBeFalsy();
  });

  test("with null permissions", async () => {
    expect(hasAuthority(null, "resourcemanager.prouser.create")).toBeFalsy();
  });
});
