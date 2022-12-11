/// https://marmelab.com/react-admin/Layout.html
import { useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Report';
import History from '@mui/icons-material/History';
import { Title, useTranslate  } from 'react-admin';
import { useLocation } from 'react-router';
import PageContainer from '../../layout/PageContainer';
import { Paper } from "@mui/material";

interface Props {
	error: any // TODO: which type?
	resetErrorBoundary: any
}

export default function Error({
	error, 
	resetErrorBoundary, 
	...rest
} : Props) {
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
    <PageContainer>
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
              <h2>{translate(error.toString())}</h2>
              <p>{error.componentStack}</p>
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
    </PageContainer>
  );
}