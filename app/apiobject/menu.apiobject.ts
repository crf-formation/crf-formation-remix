export type MenuNameApiEnum =
  | "menuAdmin"
  | "menuDevTools"
  | "menuCurrentPseFormation";

export type MenuDefinitionApiObject = {
  [key in MenuNameApiEnum]: Array<MenuItemDefinitionApiObject>;
};

export type MenuItemDefinitionApiObject = {
  name: string;
  href: string;
  hasAuthority: boolean;
};
