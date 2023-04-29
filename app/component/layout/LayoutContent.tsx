import { Box, GlobalStyles } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import useIsDesktop from "~/hook/useIsDesktop";
import useRootData from "~/hook/useRootData";
import SidebarMenu from "./SidebarMenu";

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: ReactNode }) {
  const isDesktop = useIsDesktop();
  const { themeName } = useRootData();

  // since we have aa sidebar specific for the admin pages, we hide by default the layout here.
  // -> sidebarIsOpen false on front because of local storage but true on server-side. 
  // This results with the view being like the server-side (sidebar open) and not like it should be according to the local storage (sidebar closed).
  // we tried to trick with the useIsClient to force render on the front. But it makes a weird effect since it would render only on client side. 
  // So on server render we have nothing, and then its rendered on the browser making the sidebar "appear".
  // const isClient = useIsClient()
  // const isAdminPage = location.pathname.startsWith("/boadmin") || location.pathname.startsWith("/admin");
  // const [sidebarIsOpen, setSidebarOpen] = useSidebarState(!isAdminPage);

  // what we do now is it always closed, and we open it on hover.

  // open in desktop, hidden in mobile
  const [sidebarIsOpen, setSidebarOpen] = useState(isDesktop);

  const withSidebar = isLoggedIn;

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarIsOpen);
  };

  const backgroundColor = themeName === "light" ? "#E8EAED" : "inherit";


  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        // backgroundColor,

        // [theme.breakpoints.down("md")]: {
        minHeight: "100vh"
        // },
      })}
    >
      {/* 
        Here we add the different css vars we can use in the rest of the code.
        It is easier to use than modifying the theme.
       */}
      <GlobalStyles
        styles={{
          ":root": {
            "--header-height": "48px",
            "--main-background-color": backgroundColor
          }
        }}
      />

      {/* Sidebar menu */}
      {withSidebar && (
        <SidebarMenu
          open={sidebarIsOpen}
        />
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </Box>
  );
}


