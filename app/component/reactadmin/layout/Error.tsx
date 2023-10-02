/// https://marmelab.com/react-admin/Layout.html
import History from "@mui/icons-material/History";
import ErrorIcon from "@mui/icons-material/Report";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { ErrorProps } from "react-admin";
import { Title, useTranslate } from "react-admin";
import Page from "../../layout/Page";

interface Props extends ErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function Error(
  {
    error,
    resetErrorBoundary,
    errorInfo
  }: Props) {
  const { pathname } = useLocation();
  const originalPathname = useRef(pathname);

  // Effect that resets the error state whenever the location changes
  useEffect(() => {
    if (pathname !== originalPathname.current) {
      resetErrorBoundary();
    }
  }, [pathname, resetErrorBoundary]);

  const translate = useTranslate();
  return (
    <Page>
      <Paper sx={{ p: 4 }}>
        <Title title="Error" />
        <h1>
          <ErrorIcon /> Something Went Wrong{" "}
        </h1>
        <div>
          A client error occurred and your request couldn't be completed.
        </div>
        {process.env.NODE_ENV !== "production" && (
          <div>
            <h2>{translate(error?.toString())}</h2>
            <p>{errorInfo?.componentStack}</p>
          </div>
        )}
        <div>
          <Button
            variant="contained"
            startIcon={<History />}
            onClick={() => history.go(-1)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            startIcon={<History />}
            onClick={() => history.go(0)}
          >
            Reload
          </Button>
        </div>
      </Paper>
    </Page>
  );
}