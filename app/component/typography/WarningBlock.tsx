import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps } from "@mui/material/styles";


interface Props {
  children: ReactNode;
  sx: SxProps;
}

export default function WarningBlock({ children, sx }: Props) {
  return (
    <Box
      sx={{
        ...sx,
        border: `1px solid`,
        borderColor: "warning.main",
        color: "warning.main",
        padding: 1,
        borderRadius: 1
      }}
    >
      {children}
    </Box>
  );
}