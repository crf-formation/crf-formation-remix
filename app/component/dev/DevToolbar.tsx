import { Box, Stack, Typography } from "@mui/material";
import DebugMatches from "~/component/dev/DebugMatches";
import useRootData from "~/hook/useRootData";

export default function DevToolbar() {
  const { browserEnv } = useRootData();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: "var(--current-sidebar-width)",
        right: 0,
        height: 28,
        zIndex: 2,
        background: "#051e34",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Stack spacing={2} direction="row" alignItems="center">
        {browserEnv?.MOCKS && (
          <>
            <Box>
              <Typography variant="overline" color="white">
                MOCKS
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="white">
                {" "}
                |{" "}
              </Typography>
            </Box>
          </>
        )}

        <Box>
          <Typography variant="overline" color="white">
            env: {browserEnv?.ENV}
          </Typography>
        </Box>

        <Box>
          <Typography variant="overline" color="white">
            {" "}
            |{" "}
          </Typography>
        </Box>

        <DebugMatches />
      </Stack>
    </Box>
  );
}
