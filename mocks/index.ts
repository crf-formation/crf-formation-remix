import type { RequestHandler } from "msw";
import { miscHandlers } from "./handler/misc.handlers";

export const handlers: RequestHandler[] = [
  ...miscHandlers,
];
