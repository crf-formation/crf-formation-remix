import type { MenuDefinitionDto } from "~/dto/menu.dto";
import type { MenuDefinitionApiObject } from "../apiobject/menu.apiobject";

export function menuDefinitionApiObjectToDto(
  menuItemDefinitionApiObject: MenuDefinitionApiObject
): MenuDefinitionDto {
  return {
    ...menuItemDefinitionApiObject,
  };
}
