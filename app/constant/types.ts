import type { BrowserEnvDto } from "~/dto/env.dto";

// we must export at least one thing so our declare global work.
// But we do not want to export any real type here.
export type __fixBug = "trick";

declare global {

  // override Window to pass our browser env data using the 'APP_ENV' property.
  interface Window {
    browserEnv: BrowserEnvDto;
  }

  interface Dict<T> {
    [key: string]: Optional<T>;
  }

  // also see "NonNullable" https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype
  // on zdo: nullish
  type Optional<T> = T | null | undefined;

  type Nullable<T> = T | null;

  // date.toISOString()
  type DateISOString = string;

  // https://tkdodo.eu/blog/pedantic-index-signatures-in-type-script-4-1#nonemptylist
  // https://twitter.com/he_zhenghao/status/1583557892480778240?s=12&t=VTtNbpwpT48cB6tXQvPNUA
  type NonEmptyArray<T> = [T, ...Array<T>]

}
