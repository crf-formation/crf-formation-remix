import type { EnvProperty } from "~/dto/env.dto";
import useSsr from "./useSsr";

export default function useEnv() {
  const { isServer } = useSsr();

  function getEnv(propertyName: EnvProperty): Optional<string> {
    if (isServer) {
      return process.env[propertyName];
    }
    return typeof window !== "undefined" ? window.env[propertyName] : undefined;
  }

  return {
    getEnv,
    isDev: (): boolean => {
      return getEnv("ENV") === "dev";
    }
  };
}
