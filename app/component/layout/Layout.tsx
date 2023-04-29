import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import Page from "./Page";

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <Page isLoggedIn={isLoggedIn}>{children}</Page>
    </>
  );
}
