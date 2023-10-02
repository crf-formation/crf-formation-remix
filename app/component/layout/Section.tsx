// https://github.com/mui/material-ui/blob/master/docs/src/layouts/Section.tsx
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { PaperProps } from "@mui/material/Paper";
import type { ReactNode } from "react";

interface SectionProps extends PaperProps {
  title?: ReactNode | undefined;
  action?: ReactNode | undefined | null;
}

export default function Section(props: SectionProps) {
  const { children, sx, title, action, ...other } = props;

  return (
    <Box sx={{ ...sx }} component="section">
      <Paper
        elevation={0}
        {...other}
        sx={{
          overflow: "hidden",
          backgroundColor: "var(--card-background-color)"
        }}
      >
        {title && (
          <Box px={2} py={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="subtitle2"
                sx={{
                  fontVariant: "small-caps",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {title}
              </Typography>
              <>{action}</>
            </Box>
            <Divider />
          </Box>
        )}
        <Container sx={{ py: { xs: 1, sm: 2, md: 2 } }}>{children}</Container>
      </Paper>
    </Box>
  );
}