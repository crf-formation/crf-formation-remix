import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { useCatch, useNavigate } from "@remix-run/react";
import type { ReactNode } from "react";
import WarningBlock from "../typography/WarningBlock";

type RouteDrawerCatchBoundaryProps = {
  /**
   * url to redirect to when the drawer closes
   */
  redirectTo: string
  children?: ReactNode
}

export function RouteDrawerCatchBoundary({ redirectTo, children }: RouteDrawerCatchBoundaryProps) {
  const caught = useCatch();

  return (
    <RouteDrawer redirectTo={redirectTo}>
      <WarningBlock sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography component="p" variant="h5">
          {caught.data?.message || caught.data}
        </Typography>
      </WarningBlock>

      <Box>{children}</Box>
    </RouteDrawer>
  );
}

interface Props {
  /**
   * url to redirect to when the drawer closes
   */
  redirectTo: string;
  children: ReactNode;
}

// render a route inside a drawer
// ex: http://localhost:3000/users/dewdew/show
export default function RouteDrawer(
  {
    redirectTo,
    children
  }: Props) {
  const navigate = useNavigate();

  function onClose() {
    navigate(redirectTo);
  }

  return (
    <Drawer anchor="right" open onClose={onClose}>
      <Container
        maxWidth="md"
        sx={{
          minWidth: 480,
          paddingTop: 6 // padding for the content to not be above the page header
        }}
      >
        {children}
      </Container>
    </Drawer>
  );
}
