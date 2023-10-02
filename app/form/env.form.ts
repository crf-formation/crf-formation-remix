import { z } from "zod";

import type { EnvDto, EnvNameDtoEnum, NodeEnvNameDtoEnum } from "~/dto/env.dto";
import { coerceBoolean } from "~/form/abstract";

const zEnvName: z.ZodType<EnvNameDtoEnum> = z.enum([
  "local",
  "dev",
  "preview",
  "production",
]);
const zNodeEnvName: z.ZodType<NodeEnvNameDtoEnum> = z.enum([
  "development",
  "production",
  "test",
]);

export const EnvSchema: z.ZodType<EnvDto> = z.object({
  NODE_ENV: zNodeEnvName,
  ENV: zEnvName,
  SESSION_SECRET: z.string(),
  MOCKS: coerceBoolean,
});
