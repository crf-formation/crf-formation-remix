// process environment properties handling.
// tutorial: https://remix.run/docs/en/v1/guides/envvars
import type { AbstractDto } from "./abstract.dto";

// list env property names (defined on root)
export type EnvPropertyDtoEnum = "ENV"

export type NodeEnvNameDtoEnum = "development" | "production" | "test";

export type EnvNameDtoEnum = "local" | "dev" | "preview" | "production";

export interface EnvDto extends AbstractDto {
  NODE_ENV: NodeEnvNameDtoEnum;
  ENV: EnvNameDtoEnum;
  SESSION_SECRET: string;
  MOCKS?: boolean | string; // | string because of zod, will be parsed to boolean
}

export interface BrowserEnvDto extends AbstractDto {
  ENV: EnvNameDtoEnum;
  MOCKS: boolean;
}

