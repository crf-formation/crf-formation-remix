import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { Severity } from "./Callout";
import Callout from "./Callout";

interface Props {
	severity: Severity;
	children: ReactNode
}

/**
 * A Callout designed to be displayed alone on the page (for errors, warnings, etc)
 */
export default function PageCallout({ severity, children }: Props) {
	return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Callout severity="info" withIcon sx={{ maxWidth: 360, minWidth: 240 }}>
        {children}
      </Callout>
    </Box>
  );
}