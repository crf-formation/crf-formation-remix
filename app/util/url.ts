

export function addSearchParamsToUrl(url: string, searchParams: URLSearchParams) {
	if (!searchParams) {
		return url
	}
	url += '?'
	searchParams.forEach((value, key) => {
		url += `${key}=${value}&`
	})
	// TODO: better way
	if (url.endsWith("&") || url.endsWith("?")) {
		url = url.substring(0, url.length - 1)
	}
	return url
}
