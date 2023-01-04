import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { ShowProps } from "react-admin";
import { Show } from "react-admin";
import Main from "~/component/layout/Main";

interface ShowLayoutProps extends ShowProps {
  children: ReactNode
}

export default function ShowLayout({ children, ...props }: ShowLayoutProps) {
  return (
    <Main>
      <Box
        sx={{
          "& .RaShow-main": {
            padding: [0, 2],
            maxWidth: 1200,
            margin: 'auto',
          },
        }}
      >
        <Show {...props}>
          {children}
        </Show>
      </Box>
    </Main>
  );
}
