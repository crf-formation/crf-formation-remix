import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Aside({ children }: Props) {
  return (
    <Box sx={{ marginLeft: 2 }}>
      <Paper>
        <Box sx={{ minWidth: 200, p: 2 }}>{children}</Box>
      </Paper>
    </Box>
  );
}
