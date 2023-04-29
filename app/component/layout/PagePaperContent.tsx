import type { PaperProps } from "@mui/material";
import { Paper } from "@mui/material";


export default function PagePaperContent({ sx, children, ...props }: PaperProps) {
  return (
    <Paper sx={{ mt: 2, p: 4, backgroundColor: "#FBF7FF", ...sx }} {...props}>{children}</Paper>
  );
}