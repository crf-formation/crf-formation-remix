import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from "@mui/icons-material/Menu";
import { Box, ListItemText } from '@mui/material';
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ClientOnly from '~/utils/ClientOnly';
import UserMenu from "./UserMenu";
import useUser from "~/hooks/useUser";

interface HeaderProps {
  sidebarIsOpen: boolean;
  isLoggedIn: boolean;
  toggleDrawer: () => void;
  location: any;
}

export default function Header(props: HeaderProps) {
  const user = useUser()

  const {
    sidebarIsOpen,
    isLoggedIn,
    toggleDrawer,
    location,
  } = props;

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const userMenuOpen = Boolean(userMenuAnchorEl);

  return (
    <>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar
          variant="dense"
          sx={(theme) => ({
            // pr: isLoggedIn ? 4 : 0,
            // [theme.breakpoints.up("md")]: {
            //   pl: 1.5,
            // },
          })}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid
              sx={{
                // display: { sm: "none", xs: "block" },
                ...(sidebarIsOpen && { display: "none" }),
              }}
              item
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>

            <Grid item xs>
              <Typography
                color="inherit"
                variant="h5"
                component="h1"
                sx={{ ml: 1 }}
              >
                <ClientOnly fallback="">
                  {() => window.document?.title}
                </ClientOnly>
                {/* only when on a react admin page, will replace the title for us */}
                <span id="react-admin-title" style={{ marginLeft: 4 }} />
              </Typography>
            </Grid>

            <Grid item xs />

            {/* <Grid item>
              <Link
                href="/"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  color: lightColor,
                  "&:hover": {
                    color: "common.white",
                  },
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Go to docs
              </Link>
            </Grid> */}

            {/* <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid> */}

            {isLoggedIn && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Grid item sx={{ "& .MuiSvgIcon-root": { color: "white" } }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      sx={{ textAlign: "center" }}
                      onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
                      aria-controls={userMenuOpen ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen ? "true" : undefined}
                    >
                      <AccountCircleIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                </Grid>

                <UserMenu
                  open={userMenuOpen}
                  user={user}
                  anchorRef={userMenuAnchorEl}
                  handleClose={() => setUserMenuAnchorEl(null)}
                />
              </Box>
            )}

            {!isLoggedIn && location.pathname !== "/login" && (
              <Grid item>
                <Button sx={{ textAlign: "center" }} href="/login">
                  <ListItemText primary="Login" />
                </Button>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
