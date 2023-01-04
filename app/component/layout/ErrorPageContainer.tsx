import { Box, Paper, Typography } from "@mui/material";
import type { ReactNode } from 'react';

interface Props {
	title: string
	message: ReactNode
}

export default function ErrorPageContainer({
	title,
	message
} : Props) {
	return (
    <Box
      display="flex"
      justifyContent="center"
      flex="1"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Paper sx={{ height: "100%", width: "100%" }}>
        <Box
          p={4}
          sx={{
            marginTop: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h2">{title}</Typography>

          <Typography variant="subtitle1">{message}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}