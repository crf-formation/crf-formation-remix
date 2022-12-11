import type { ReactNode } from "react";
import { Container }  from "@mui/material";
import Main from "./Main";

/**
 * Container for a page, to have a centered layout content.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
	/* TODO: mt: 10 on theme */
  return (
    <Main
      sx={{
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          paddingTop: "3rem",
          mb: 4,
        }}
      >
        {children}
      </Container>
    </Main>
  );
}
