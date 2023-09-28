import useRouteData from "~/hook/useRouteData";
import type { RootLoaderData } from "~/root";

export default function useOptionalRootData(): Optional<RootLoaderData> {
  const rootData = useRouteData<RootLoaderData>("root");

  // should not happen, we add this for typescript typecheck
  if (!rootData) {
    // happens when on error mode, no root data
    return null;
  }

  return rootData;
}
