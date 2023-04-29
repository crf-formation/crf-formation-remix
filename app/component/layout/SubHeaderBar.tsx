import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import type { ReactNode } from "react";

const lightColor = "rgba(255, 255, 255, 0.7)";

interface Props {
  children: ReactNode;
}

export default function SubHeaderBar({ children }: Props) {
  return (
    <AppBar
      component="div"
      color="primary"
      position="static"
      elevation={0}
      sx={{
        zIndex: 0,
        "& .Button-root": {
          borderColor: lightColor
        }
      }}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          {children}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}