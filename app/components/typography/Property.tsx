import type { SxProps } from "@mui/material";
import { Box, Divider } from "@mui/material";
import type { ReactNode } from "react";

interface PropertyProps {
	name: ReactNode;
	value: ReactNode;
  sx?: SxProps;
	help?: ReactNode;
}

export default function Property({ name, value, help, sx }: PropertyProps) {
	return (
    <Box sx={{ display: "flex", flexDirection: "column", my: 1, ...sx }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", py: 1, pb: 1.5, px: 1 }}
      >
        <Box sx={{ minWidth: 240, fontWeight: "500" }} component="span">
          {name}
        </Box>
        <Box
          sx={{ display: "flex", flex: 1, color: "grey.700" }}
          component="span"
        >
          {value}
        </Box>

        {help && (
          <Box sx={{ color: "grey.700" }} component="span">
            {help}
          </Box>
        )}
      </Box>

      <Divider />
    </Box>
  );
}

