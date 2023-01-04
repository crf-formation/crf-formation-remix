/**
 * List all the environment variables to share with the browser.
 *
 * /!\ Be carefull to not put sensitive data here.
 * 
 * On the browser side, we use the useEnv hook, and if not possible window.env[propertyName].
 */
export function getBrowserEnv() {
  return {
    // list here the process.env variables we want to share with the browser.
    // look at useEnv hook to retrieve the env properties.
    ENV: process.env.ENV,
  };
}
