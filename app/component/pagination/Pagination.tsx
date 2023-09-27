import Grid from "@mui/material/Grid";
import MuiPagination from "@mui/material/Pagination";
import PageCallout from "~/component/typography/PageCallout";
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
export default function Pagination<T>(
  {
    path,
    paginateObject
  }: Props<T>) {
  const { currentPage, hasData, onPageChange, onRowsPerPageChange } = usePagination(
    path,
    paginateObject
  );

  return (
    <>
      {!hasData && (
        <PageCallout severity="info">You have reached the end !</PageCallout>
      )}

      {hasData && (
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mb: 2
          }}
        >
          <MuiPagination
            count={paginateObject.page.totalPages} // The total number of pages. 
            rowsPerPage={paginateObject.page.pageSize}
            page={currentPage}
            onRowsPerPageChange={onRowsPerPageChange}
            onChange={onPageChange}
          />
        </Grid>
      )}
    </>
  );
}