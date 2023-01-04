import useRouteData from "~/hook/useRouteData";
import type { RootLoaderData } from "~/root";

export default function useRootData(): RootLoaderData {
	const rootData = useRouteData<RootLoaderData>("root") || {};

	return rootData
}