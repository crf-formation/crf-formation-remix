import { Container } from "@mui/material";
import type { ReactNode } from "react";
import Main from "./Main";

/**
 * Container for a page, to have a centered layout content.
 */
export default function PageContainer({ children, ariane }: { children: ReactNode, ariane?: ReactNode }) {
  return (
    <Main
      sx={{
        flexDirection: "column"
      }}
    >
      {ariane}

      <Container
        maxWidth="lg"
        sx={{
          // paddingTop: "3rem",
          mb: 4
        }}
      >
        {children}
      </Container>
    </Main>
  );
}
