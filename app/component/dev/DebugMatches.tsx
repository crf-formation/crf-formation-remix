import BugReportIcon from "@mui/icons-material/BugReport";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useMatches } from "@remix-run/react";
import { useMemo, useState } from "react";
import { ReactJson } from "../typography/Json";
import { isEmpty } from "lodash";

/**
 *
 */
function useDebugMatches(): any | undefined {
  const matchingRoutes = useMatches();
  const routesData = useMemo(() => {
    return matchingRoutes.map((matchingRoute) => {
      return {
        id: matchingRoute.id,
        pathname: matchingRoute.pathname,
        params: matchingRoute.params,
        data: matchingRoute.data,
      };
    });
  }, [matchingRoutes]);
  return routesData;
}

function RouteDataView({ routeData }: { routeData: any }) {
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
          <ReactJson src={routeData.data} />
        ) : (
          <span>No data</span>
        )}
      </Box>
    </Box>
  );
}

function DebugContent({
                        show,
                        onClose,
                      }: {
  show: boolean;
  onClose: () => void;
}) {
  const debug = useDebugMatches();

  return (
    <Dialog
      open={show}
      onClose={() => onClose()}
      sx={{ "& .MuiPaper-root": { minWidth: 680 } }}
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
          {debug.map((routeData: any) => (
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
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <Box>
        <Button onClick={() => setShow((show) => !show)}>
          <BugReportIcon />
        </Button>
      </Box>

      {show && <DebugContent show={show} onClose={() => setShow(false)} />}
    </>
  );
}
