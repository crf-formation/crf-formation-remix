import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Form, useLocation } from "@remix-run/react";
import type { UserMeDto } from "~/dto/user.dto";
import useRootData from "~/hook/useRootData";

interface Props {
  open: boolean;
  anchorRef: HTMLElement | null;
  user: UserMeDto;
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export default function UserMenu({ open, user, anchorRef, handleClose }: Props) {
  const { themeName } = useRootData();

  const location = useLocation();

  return (
    <Menu
      anchorEl={anchorRef}
      id="user-menu"
      open={open}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={handleClose}
      PaperProps={{
        elevation: 0, // custom drop-shadow filter below
        sx: {
          minWidth: 354,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",

          overflow: "visible",
          mt: 1.5,

          // triangle pointing top
          "&:before": {
            content: "\"\"",
            display: "block",
            position: "absolute",
            bottom: 20,
            left: -5,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-25%) rotate(45deg)",
            zIndex: 0
          }
        }
      }}
    >
      <List>
        <ListItem>
          <Box sx={{ width: "100%", textAlign: "center", p: [0, 2] }}>
            <Typography
              sx={{
                fontWeight: 600
              }}
            >
              {user.fulleName}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                font: "text.secondary"
              }}
            >
              {user.email}
            </Typography>

            <Box mt={2}>
              <Button
                variant="outlined"
                href="/account"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: 4
                }}
              >
                Manage your account
              </Button>
            </Box>
          </Box>
        </ListItem>
        <Divider />
        <ListItem sx={{ justifyContent: "center" }}>
          <Form method="POST" action="/">
            <Box
              sx={{
                textAlign: "center"
              }}
            >
              <input
                type="hidden"
                name="redirectBack"
                value={`${location.pathname}${location.search}`}
              />
              <Tooltip title="Toggle theme">
                <IconButton type="submit" aria-label="Toggle theme">
                  {themeName === "light" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness2Icon />
                  )}
                </IconButton>
              </Tooltip>
              <Typography component="h4" variant="subtitle1">
                {themeName} theme
              </Typography>
            </Box>
          </Form>
        </ListItem>
        <Divider />
        <ListItem alignItems="flex-start" sx={{ padding: [0, 2] }}>
          <Form action="/logout" method="POST" style={{ width: "100%", textAlign: "center" }}>
            <Button
              type="submit"
              sx={{ width: "100%", maxWidth: 204 }}
              variant="outlined"
            >
              Logout
            </Button>
          </Form>
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            justifyContent: "center",
            height: "51px",
            paddingTop: 2,
            paddingBottom: 1,

            "& a": {
              color: "text.secondary",
              fontSize: 12
            }
          }}
        >
          <Typography component="span">
            <Link href="/" underline="none">
              Privacy policy
            </Link>
          </Typography>
          <Typography component="span">&nbsp;•&nbsp;</Typography>
          <Typography component="span">
            <Link href="/" underline="none">
              Terms of service
            </Link>
          </Typography>
        </ListItem>
      </List>
    </Menu>
  );
}
