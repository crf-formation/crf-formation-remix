import MuiTablePagination from "@mui/material/TablePagination";
import type { PaginateObject } from "~/constant/types";
import usePagination from "~/hook/usePagination";

interface Props<T> {
  path: string;
  paginateObject: PaginateObject<T>;
}

/**
 * The Pagination component was designed to paginate a list of arbitrary items when infinite loading isn't used.
 * It's preferred in contexts where SEO is important, for instance, a blog.
 *
 * For the pagination of a large set of tabular data, you should use the TablePagination component.
 */
export default function TablePagination<T>(
  {
    path,
    paginateObject
  }: Props<T>) {
  const { currentPage, onPageChange, onRowsPerPageChange } = usePagination(
    path,
    paginateObject
  );

  return (
    <>
      <MuiTablePagination
        count={paginateObject.page.totalPages} // The total number of pages.
        rowsPerPage={paginateObject.page.pageSize}
        page={currentPage}
        onRowsPerPageChange={onRowsPerPageChange}
        onChange={onPageChange}
      />
    </>
  );
}