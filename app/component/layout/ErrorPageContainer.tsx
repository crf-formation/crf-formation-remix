import { Box, Paper, Typography } from "@mui/material";
import { ErrorResponse } from "@remix-run/router";
import { ReactNode } from "react";


interface DefaultErrorViewProps {
  title: string;
  defaultMessage: ReactNode;
  jsonResponse?: any;
}

export function DefaultErrorView(
  {
    title,
    defaultMessage,
    jsonResponse,
  }: DefaultErrorViewProps
) {
  return (
    <Box display="flex" justifyContent="center" height="100%" width="100%">
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper sx={{ width: "100%", p: 4 }}>
          <Typography variant="h3">{title}</Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {jsonResponse?.message || defaultMessage}
          </Typography>

          {jsonResponse && (
            <Box sx={{ marginTop: 4 }}>
              {jsonResponse?.zSessionId && (
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Session ID: {jsonResponse?.zSessionId}
                </Typography>
              )}

              {process.env.NODE_ENV === "development" && (
                <Typography
                  component="pre"
                  variant="inherit"
                  sx={{
                    maxWidth: 720,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {JSON.stringify(jsonResponse, null, 2)}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default function ErrorPageContainer({ error }: { error: ErrorResponse }) {
  // default error view
  let defaultMessage;
  let title;
  switch (error.status) {
    case 403:
      title = "Forbidden";
      defaultMessage = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;

    case 404:
      title = "Not found";
      defaultMessage = <p>Oops! Not found. The resource could not be found.</p>;
      break;

    case 400:
      if (error?.data?.erno === "ECONNREFUSED") {
        title = "Could not connect to ZDP API";
        defaultMessage = "";
      } else {
        title = "Error 400";
        defaultMessage = error.data?.zdpMiddlewareApiError?.apiMessage;
      }
      break;

    default:
      title = "Error";
      defaultMessage = error.data?.zdpMiddlewareApiError?.apiMessage || "Unknown error";
  }

  return (
    <DefaultErrorView
      title={title}
      defaultMessage={defaultMessage}
      jsonResponse={error?.data?.zdpMiddlewareApiError?.jsonResponse}
    />
  );
}