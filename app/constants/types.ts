export type Env = Dict<string>;

declare global {

  // override Window to pass our browser env data using the 'APP_ENV' property.
  interface Window {
    ENV: Env;
  }

  // types to match the Api types, making easier our Dto
  type Void = null

  // also see "NonNullable" https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype
  type Optional<T> = T | null | undefined 

}

// types to match the Api types, making easier our Dto
export type DateTime = string

// https://tkdodo.eu/blog/pedantic-index-signatures-in-type-script-4-1#nonemptylist
// https://twitter.com/he_zhenghao/status/1583557892480778240?s=12&t=VTtNbpwpT48cB6tXQvPNUA
export type NonEmptyArray<T> = [T, ...Array<T>]

export const isNonEmpty = <T extends unknown>(
  array: Array<T>
): array is NonEmptyArray<T> => array.length > 0

export interface Dict<T> {
  [key: string]: Optional<T>;
}


export interface FormResult {
  errors?: { [key: string]: any }
}

export interface FormActionData extends FormResult {
}

export interface Page {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export type OrderByDirection = 'asc' | 'desc'

export interface Sort {
  direction: OrderByDirection
  orderBy: string;
}

export interface PaginateObject<T> {
  data: T[];
  page: Page;
  sort: Sort
}
