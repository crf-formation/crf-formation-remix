import { Box, Container, Paper } from "@mui/material";
import type { ReactNode } from "react";
import LogoVerticalImage from "../image/LogoVertical";
import PageFullContent from "./PageFullContent";

interface Props {
	children: ReactNode;
}

/**
 * Full page layout with a white block in the middle. In this block, the vertial logo.
 * Used for full page forms (ex: login / register).
 */
export default function PageFullContentWithLogo({ children }: Props) {
  return (
    <PageFullContent>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ marginTop: 8 }}>
          <Container maxWidth="md">
            <Paper sx={{ px: 3, minWidth: 360, py: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <LogoVerticalImage
                  width={220}
                  height="auto"
                  style={{ margin: "auto" }}
                  loading="lazy"
                />

                {children}
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </PageFullContent>
  );
}
