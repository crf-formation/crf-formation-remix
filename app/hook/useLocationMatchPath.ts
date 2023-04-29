import { matchPath } from "react-router";
import { useLocation } from "@remix-run/react";

export default function useLocationMatchPath() {
  const location = useLocation();

  function locationMatchPath(href: string | undefined) {
    // TODO: this only match the current route, not if location.pathname is a children of href.
    return !!matchPath(href || "", location.pathname);
  }

  return locationMatchPath;
}