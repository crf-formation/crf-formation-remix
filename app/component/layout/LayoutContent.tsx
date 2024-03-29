import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import type { ReactNode } from "react";
import { useState } from "react";
import useIsDesktop from "~/hook/useIsDesktop";
import useRootData from "~/hook/useRootData";
import SidebarMenu from "./SidebarMenu";
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from "~/constant";

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
        styles={theme => ({
          ":root": {
            "--header-height": "48px",
            "--main-background-color": backgroundColor,
            "--card-background-color": themeName === "light" ? "#FBF7FF" : "rgba(255, 255, 255, 0.08)",

            // spacing
            "--page-spacing-x": theme.spacing(4),
            "--page-spacing-y": theme.spacing(2),

            // sidebar width
            "--current-sidebar-width": sidebarIsOpen
              ? DRAWER_WIDTH
              : CLOSED_DRAWER_WIDTH,
            "--sidebar-width": DRAWER_WIDTH,
            "--sidebar-closed-width": CLOSED_DRAWER_WIDTH,

            "--nprogress-spinner-left": sidebarIsOpen ? "220px" : "24px",

            "--content-max-width": "1200px",
            "--small-content-max-width": "720px",

            // forms
            "--form-max-width": "720px",
            "--submit-btn-min-width": "240px",
          }
        })}
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


