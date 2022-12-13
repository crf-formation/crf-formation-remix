// https://github.com/mui/material-ui/blob/master/docs/src/layouts/Section.tsx
import type { PaperProps } from '@mui/material/Paper';
import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import type { ReactNode } from 'react';

interface SectionProps extends PaperProps {
  title: ReactNode | undefined
}

export default function Section(props: SectionProps) {
  const { children, sx, title, ...other } = props;

  return (
    <Box sx={{ ...sx }} component="section">
      <Paper
        elevation={0}
        {...other}
        sx={{
          overflow: "hidden",
        }}
      >
        {title && (
          <Box px={2} py={1}>
            <Typography variant="subtitle2" sx={{ fontVariant: 'small-caps' }}>{title}</Typography>
            <Divider />
          </Box>
        )}
        <Container sx={{ py: { xs: 1, sm: 2, md: 2 } }}>{children}</Container>
      </Paper>
    </Box>
  );
}