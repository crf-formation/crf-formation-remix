// https://github.com/bvaughn/react-resizable-panels/blob/main/packages/react-resizable-panels/src/hooks/useIsomorphicEffect.ts
// https://twitter.com/BenLesh/status/1610298056540397568
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;