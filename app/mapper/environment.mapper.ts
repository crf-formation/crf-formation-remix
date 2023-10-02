import type { BrowserEnvApiObject } from "~/apiobject/env.apiobject";
import type { BrowserEnvDto } from "~/dto/env.dto";

export function browserEnvApiObjectToDto(
  apiObject: BrowserEnvApiObject
): BrowserEnvDto {
  return {
    ENV: apiObject.ENV,
    MOCKS: apiObject.MOCKS,
  };
}
