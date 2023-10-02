// process environment properties handling.
// tutorial: https://remix.run/docs/en/v1/guides/envvars

// list env property names (defined on root)
export type EnvPropertyApiEnum =
  | "NODE_ENV"
  | "ENV"
  | "SESSION_SECRET"
  | "MOCKS";

export type NodeEnvNameApiEnum = "development" | "production";

export type EnvNameApiEnum = "local" | "dev" | "preview" | "production";

export type EnvApiObject = {
  NODE_ENV: NodeEnvNameApiEnum;
  ENV: EnvNameApiEnum;
  SESSION_SECRET: string;
  MOCKS: boolean;
};

export interface BrowserEnvApiObject {
  ENV: EnvNameApiEnum;
  MOCKS: boolean;
}
