import type { MenuDefinitionApiObject, MenuItemDefinitionApiObject } from "~/apiobject/menu.apiobject";
import type { UserMeApiObject } from "~/apiobject/user.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { isDevelopmentEnvironment } from "~/service/env.server";

export function getMenuDefinition(
  proUserMeApiObject: Optional<UserMeApiObject>,
  currentPseFormation: Optional<PseFormationApiObject>,
): MenuDefinitionApiObject {
  // filter items that do not have the authority, to avoid sending those data to the front.
  const filterHasNoAuthority = (item: MenuItemDefinitionApiObject) => item?.hasAuthority ?? false;

  return {
    menuAdmin: [
      {
        name: "Users",
        href: "/admin/user",
        hasAuthority: proUserMeApiObject?.hasAdminPermission ?? false,
      },
      {
        name: "Formations - PSE",
        href: "/admin/pse",
        hasAuthority: proUserMeApiObject?.hasAdminPermission ?? false,
      }
    ].filter(filterHasNoAuthority),

    menuDevTools: !isDevelopmentEnvironment()
      ? []
      : [
        {
          name: "Theme",
          href: "/dev/theme",
          hasAuthority: true,
        },

        {
          name: "Test Page",
          href: "/dev/test",
          hasAuthority: true,
        }
      ].filter(filterHasNoAuthority),

    menuCurrentPseFormation: !currentPseFormation ? [] : [
      {
        name: "Dashboard",
        href: `/pse/${currentPseFormation.id}`,
        hasAuthority: true,
      },
      {
        name: "Cas concrets",
        href: `/pse/${currentPseFormation.id}/concrete-case/session`,
        hasAuthority: true,
      },
      {
        name: "Suivi",
        href: `/pse/${currentPseFormation.id}/summary`,
        hasAuthority: true,
      }
    ].filter(filterHasNoAuthority)
  };
}
