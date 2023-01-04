import { useNavigate, useSearchParams } from "@remix-run/react";
import type { PaginateObject } from '../constant/types';

interface usePaginationData { 
	currentPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	// onPreviousPage: ReactEventHandler;
	// onNextPage: ReactEventHandler;
	previousPageDisabled: boolean;
	nextPageDisabled: boolean;
	hasData: boolean;
}

export default function usePagination<T>(path: String, paginatedData: PaginateObject<T>): usePaginationData {
	const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || '1', 10);

	// const handleNavigation = (offset: number) => () => {
  //   navigate(`${path}?page=${currentPage + offset}`)
  // };

  const onPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    navigate(`${path}?page=${newPage}`) 
  }

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    navigate(`${path}?page=0&pageSize=${parseInt(event.target.value, 10)}`)
  };

	return {
    currentPage,
    hasData: paginatedData.data && paginatedData.data.length > 0,
    onPageChange,
    onRowsPerPageChange,
    
    // onPreviousPage: handleNavigation(-1),
    // onNextPage: handleNavigation(1),

    previousPageDisabled: currentPage <= 0,
    nextPageDisabled:
      (paginatedData?.data && !paginatedData?.data?.length) ||
      paginatedData?.data?.length < paginatedData?.page.pageSize,
  };

}