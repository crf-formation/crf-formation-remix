interface PagingFromRequest {
  page: number;
  pageSize: number;
}

export function getPagingFromRequest(request: Request, defaultPageSize: number = 10): PagingFromRequest {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("pageSize") || `${defaultPageSize}`;

  return { page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) };
}