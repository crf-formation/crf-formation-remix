import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";
import PagePaperHeader from "~/component/layout/PagePaperHeader";
import PageTitle from "~/component/layout/PageTitle";
import PageSubtitle from "~/component/layout/PageSubtitle";
import PageSpace from "~/component/layout/PageSpace";
import ButtonPageActions from "~/component/layout/ButtonPageActions";

interface Props {
  title?: string;
  subtitle?: string;
  subheader?: ReactNode;
  children: ReactNode;
  ariane?: ReactNode;
  action?: ReactNode;
}

export default function Page({ title, subtitle, subheader, ariane, children, action }: Props) {
  return (
    <Box
      sx={{
        overflow: "auto",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {ariane && (
        <Box
          sx={{
            backgroundColor: title ? "var(--card-background-color)" : undefined,
          }}
        >
          {ariane}
        </Box>
      )}

      {title && (
        <PagePaperHeader>
          <PageTitle title={title} />

          {subtitle && <PageSubtitle subtitle={subtitle} />}
        </PagePaperHeader>
      )}

      {subheader}

      <PageSpace variant="header" />

      <Container
        maxWidth="lg"
        sx={{
          mb: 4,
        }}
      >
        {action}

        {children}
      </Container>
    </Box>
  );
}