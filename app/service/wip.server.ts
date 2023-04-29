import { redirect } from "@remix-run/server-runtime";

/**
 * On production environment, redirect to /wip
 */
export function requireWorkInProgress(request: Request) {
  if (process.env.NODE_ENV !== "production") { // TODO: change to ===
    throw redirect(`/wip?from=${new URL(request.url).pathname}`);
  }
}
