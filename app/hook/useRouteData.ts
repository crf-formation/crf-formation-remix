import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 *
 * https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-route-data.tsx
 */
export default function useRouteData<Data>(
  id: string
): Data | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data as Data | undefined;
}
