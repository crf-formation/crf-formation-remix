import { parseAcceptLanguage } from "intl-parse-accept-language";
const usParser = require('ua-parser-js');

/**
 * Receives a Request or Headers objects.
 * If it's a Request returns the request.headers
 * If it's a Headers returns the object directly.
 */
 export function getHeaders(requestOrHeaders: Request | Headers): Headers {
  if (requestOrHeaders instanceof Request) {
    return requestOrHeaders.headers;
  }

  return requestOrHeaders;
}

export function getSearchParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams
}

export function getSearchParam(request: Request, name: string): string | null {
  const searchParams = getSearchParams(request)
  const value = searchParams.get(name);
  return value
}

export function getSearchParamNumber(request: Request, name: string): Optional<number> {
  const searchParams = getSearchParams(request)
  const value = searchParams.get(name);
  return value ? parseInt(value) : null
}

export type Locales = string[] | undefined;

/**
 * Get the client's locales from the Accept-Language header.
 * If the header is not defined returns null.
 * If the header is defined return an array of locales, sorted by the quality
 * value.
 *
 * @example
 * export let loader: LoaderFunction = async ({ request }) => {
 *   let locales = getClientLocales(request)
 *   let date = new Date().toLocaleDateString(locales, {
 *     "day": "numeric",
 *   });
 *   return json({ date })
 * }
 */
export function getClientLocales(headers: Headers): Locales;
export function getClientLocales(request: Request): Locales;
export function getClientLocales(requestOrHeaders: Request | Headers): Locales {
  let headers = getHeaders(requestOrHeaders);

  let acceptLanguage = headers.get("Accept-Language");

  // if the header is not defined, return undefined
  if (!acceptLanguage) return undefined;

  let locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf,
    ignoreWildcard: true,
  });

  // if there are no locales found, return undefined
  if (locales.length === 0) return undefined;
  // if there is only one locale, return it
  if (locales.length === 1) return locales[0];
  // if there are multiple locales, return the array
  return locales;
}


/**
 * 
 * @param headers 
 * 
 * @return true if the requests seem to come from a desktop device.
 * 
 * https://nitayneeman.com/posts/combining-server-side-rendering-and-responsive-design-using-react/
 * 
 * Sadly, there are a few drawbacks to this strategy.
 * First of all, the information we can extract out of the userAgent is pretty limited. 
 * Namely, we cannot understand the device properties (dimensions, orientation, etc.) directly. 
 * Indeed, it might be possible to infer the viewport dimensions someway, however then again - 
 * it leaves the orientation (and others) unsolved.
 * 
 * Alternatively, you can use native css.
 */
export function isDesktop(requestOrHeaders: Request | Headers): boolean {
  const headers: Headers = getHeaders(requestOrHeaders);
  const userAgent = usParser(headers.get('user-agent'));
  const { type } = userAgent.device

  return !(type === 'mobile' || type === 'tablet')
}
