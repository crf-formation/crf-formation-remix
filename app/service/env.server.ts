import type { BrowserEnvApiObject, EnvApiObject, EnvPropertyApiEnum } from "~/apiobject/env.apiobject";
import { EnvSchema } from "~/form/env.form";

let env: EnvApiObject;

export function validateEnv() {
  if (process.env.NODE_ENV === "production") {
    console.log("debug env:");
    console.log(`ENV ${process.env.ENV}`);
    console.log(`ZDP_API_URL ${process.env.ZDP_API_URL}`);
    console.log(`PR_NUMBER ${process.env.PR_NUMBER}`);
    console.log(`SHORT_SHA ${process.env.SHORT_SHA}`);
    console.log(`GITHUB_REPO ${process.env.GITHUB_REPO}`);
  }

  env = EnvSchema.parse(process.env) as EnvApiObject;
}

export function getEnv(envProperty: EnvPropertyApiEnum): any {
  return env[envProperty];
}

export function isDevelopmentEnvironment() {
  return ["local", "dev", "preview"].includes(getEnv("ENV"));
}
/**
 * List all the environment variables to share with the browser.
 *
 * /!\ Be carefull to not put sensitive data here.
 *
 * On the browser side, we use the useEnv hook, and if not possible window.env[propertyName].
 */
export function getBrowserEnv(): BrowserEnvApiObject {
  return {
    // list here the process.env variables we want to share with the browser.
    // look at useEnv hook to retrieve the env properties.
    ENV: env.ENV,
    MOCKS: getEnv("MOCKS"),
  };
}
