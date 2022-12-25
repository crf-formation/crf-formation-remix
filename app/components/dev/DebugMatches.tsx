import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useActionData, useMatches } from "@remix-run/react";
import isEmpty from "lodash/isEmpty";
import { useMemo, useState } from 'react';
import { ReactJson } from "../typography/Json";

/**
 * 
 */
function useDebugMatches(): any | undefined {
  const matchingRoutes = useMatches();
  const routesData = useMemo(
    () => {
			return matchingRoutes.map(matchingRoute => {
				return {
					id: matchingRoute.id,
					pathname: matchingRoute.pathname,
					params: matchingRoute.params,
					data: matchingRoute.data
				}
			})
		},
    [matchingRoutes]
  );
  return routesData
}

function RouteDataView({ routeData }) {
	return (
    <Box>
      <Box mt={2}>
        {!isEmpty(routeData.params) ? (
          <ReactJson src={routeData.params} />
        ) : (
          <span></span>
        )}
      </Box>
      <Box mt={2}>
        {routeData.data ? (
          <ReactJson src={routeData.data} collapsed displayDataTypes={false}	/>
        ) : (
          <span>No data</span>
        )}
      </Box>
    </Box>
  );
}

function ActionDataView({ actionData }) {
  if (isEmpty(actionData)) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Action data</Typography>

      <ReactJson src={actionData} />
    </Box>
  );
}

function DebugContent({ show, onClose }) {
	const debug = useDebugMatches()
  const actionData = useActionData();

	return (
    <Dialog
      open={show}
      onClose={() => onClose()}
      sx={{ "& .MuiPaper-root": { minWidth: 460 } }}
    >
      <DialogTitle>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography component="div">Debug routes data</Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={(e) => {
              onClose();
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4, mt: 2 }}>
        <div>
          <ActionDataView actionData={actionData} />
          {debug?.map((routeData) => (
            <Box key={routeData.id} mb={2}>
              <span>{routeData.pathname}</span>{" "}
              <Typography variant="caption">({routeData.id})</Typography>
              <RouteDataView routeData={routeData} />
            </Box>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DebugMatches() {
	const [show, setShow] = useState<boolean>(false)
	return (    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 1,
          right: 1,
        }}
      >
        <Button onClick={() => setShow((show) => !show)}>
          <BugReportIcon />
        </Button>
      </Box>

      {show && <DebugContent show={show} onClose={() => setShow(false)}/>}
    </>
  );
}