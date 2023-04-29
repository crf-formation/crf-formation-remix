import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import LayoutContent from "./LayoutContent";

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <LayoutContent isLoggedIn={isLoggedIn}>{children}</LayoutContent>
    </>
  );
}
