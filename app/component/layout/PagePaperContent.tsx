import type { PaperProps } from "@mui/material";
import Paper from "@mui/material/Paper";

export default function PagePaperContent({ sx, children, ...props }: PaperProps) {
  return (
    <Paper sx={{ mt: 2, p: 4, backgroundColor: "var(--card-background-color)", ...sx }} {...props}>{children}</Paper>
  );
}