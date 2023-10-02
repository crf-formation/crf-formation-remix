import type { AbstractDto } from "./abstract.dto";

export type MenuNameDtoEnum =
  | "menuAdmin"
  | "menuDevTools"
  | "menuCurrentPseFormation";

export type MenuDefinitionDto = {
  [key in MenuNameDtoEnum]: Array<MenuItemDefinitionDto>;
};

export interface MenuItemDefinitionDto extends AbstractDto {
  name: string;
  href: string;
  hasAuthority: boolean;
}
