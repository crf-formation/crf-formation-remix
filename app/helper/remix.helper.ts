import type { Params } from "@remix-run/react";

export interface DataFunctionArgs {
  request: Request;
  params: Params;
}

/**
 * A function that check the security for a route.
 */
export interface SecurityFunction<R> {
  (request: Request, params: Params): Promise<R>;
}