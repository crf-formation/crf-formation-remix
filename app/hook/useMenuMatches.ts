import type {
  MenuDefinitionDto,
  MenuItemDefinitionDto,
  MenuNameDtoEnum,
} from "~/dto/menu.dto";
import useLocationMatchPath from "./useLocationMatchPath";

export default function useMenuMatches() {
  const locationMatchPath = useLocationMatchPath();

  /**
   * @return true if one MenuItemDefinition matches the current location.
   */
  function isItemsMatches(items: Array<MenuItemDefinitionDto>) {
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
  function getMatchingMenuName(
    menusItems: MenuDefinitionDto
  ): MenuNameDtoEnum | undefined {
    if (!menusItems) {
      return undefined;
    }
    for (const [menuName, items] of Object.entries(menusItems)) {
      const match = isItemsMatches(items);

      if (match) {
        return menuName as MenuNameDtoEnum;
      }
    }
  }

  return {
    getMatchingMenuName,
    isItemsMatches,
  };
}
