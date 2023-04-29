import type { MenuName } from "~/component/layout/SidebarMenu";
import type { MenuItemDefinition, MenuItemDefinitions } from "~/component/layout/SubMenu";
import useLocationMatchPath from "./useLocationMatchPath";

export default function useMenuMatches() {
  const locationMatchPath = useLocationMatchPath();

  /**
   * @return true if one MenuItemDefinition matches the current location.
   */
  function isItemsMatches(items: MenuItemDefinition[]) {
    const match = items.some((item) => locationMatchPath(item.href));

    return match;
  }

  /**
   * Look for a matching path for the current location in the menu items.
   *
   * @param menusItems
   *
   * @return menu name that has an item matching the current location, undefined otherwise.
   */
  function getMatchingMenuName(menusItems: MenuItemDefinitions): MenuName | undefined {
    for (const [menuName, items] of Object.entries(menusItems)) {
      const match = isItemsMatches(items as MenuItemDefinition[]);

      if (match) {
        return menuName as MenuName;
      }
    }
  }

  return {
    getMatchingMenuName,
    isItemsMatches
  };
}