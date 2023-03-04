import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	ariane?: ReactNode;
}

export default function PagePaperHeader({ ariane, children }: Props) {
	return (
    <Box
      sx={{
        backgroundColor: "#FBF7FF",
      }}
    >
      <Box>{ariane}</Box>
      <Box
        sx={{
          px: 14,
          pt: 6,
          pb: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}