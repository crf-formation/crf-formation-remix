import { useMemo } from 'react'
import {
	useFetchers,
  useTransition,
} from '@remix-run/react'

export default function useIsLoading() {
  const transition = useTransition();
  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const loadingState = useMemo<"idle" | "loading">(
    function getGlobalState() {
      let states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );
  // const isLoading = true
  const isLoading = loadingState === "loading";
  return isLoading;
}