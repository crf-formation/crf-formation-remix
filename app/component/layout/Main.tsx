import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import type { SxProps } from "@mui/material/styles";

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export default function Main({ children, sx = {} }: Props) {

  return (
    <Box
      component="main"
      id="main"
      sx={{
        // TODO: which one on dark theme?
        overflow: "auto",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...sx
      }}
    >
      {children}
    </Box>
  );
}