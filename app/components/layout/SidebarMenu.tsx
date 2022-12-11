import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Drawer as MuiDrawer, GlobalStyles, IconButton, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { styled } from '@mui/material/styles';
import type { MouseEventHandler } from "react";
import { useState } from "react";
import ConstructionIcon from '@mui/icons-material/Construction';
import ShieldIcon from '@mui/icons-material/Shield';
import LogoIcon from "~/components/icons/LogoHorizontal";
import useMenuMatches from "~/hooks/useMenuMatches";
import MenuItem from "./MenuItem";
import SidebarDivider from "./SidebarDivider";
import SubMenu from "./SubMenu";

type MenuProps = {
  openedMenu: MenuName;
	dense: boolean;
  handleToggle: Function;
}

export type MenuName = 'menuDevTools' | 'menuAdmin' | undefined

const menuItems = {

  menuAdmin: [

  ],

  menuDevTools: [
    {
      name: "Theme",
      href: "/dev/theme",
    },

    {
      name: "Test Page",
      href: "/dev/test",
    },
  ]

};

const MainListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    <MenuItem
      name="Dashboard"
      href="/dashboard"
      icon={<DashboardIcon />}
      dense={dense}
    />

    <MenuItem name="Users" href="/users" icon={<PeopleIcon />} dense={dense} />

  </>
);

const SecondaryListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    <Category name="Admin" />

    <SubMenu
      handleToggle={() => handleToggle("menuAdmin")}
      open={openedMenu === "menuAdmin"}
      name="Admin"
      icon={<ShieldIcon />}
      dense={dense}
      items={menuItems.menuAdmin}
    />

  </>
);

const BottomListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    <Category name="Dev tools" />

    <SubMenu
      handleToggle={() => handleToggle("menuDevTools")}
      open={openedMenu === "menuDevTools"}
      name="Dev tools"
      icon={<ConstructionIcon />}
      dense={dense}    
      items={menuItems.menuDevTools}
     />
  </>
);

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  position: "sticky",
  top: 0, // for sticky

  height: "100vh", // TODO: ?

  [theme.breakpoints.up("xs")]: {
    display: !open ? "none" : "block",
  },
  [theme.breakpoints.up("lg")]: {
    display: "block",
  },

  "& svg": {
    fill: "var(--sidebar-color-title)",
  },

  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",

    width: theme.sidebar.width,
    [theme.breakpoints.down("sm")]: {
      width: `100vw`,
    },

    backgroundColor: "var(--sidebar-background-color)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,

      [theme.breakpoints.up("sm")]: {
        width: theme.sidebar.closedWidth,
      },
    }),
  },
}));

interface CategoryProps {
  name: string
}

function Category({ name }: CategoryProps) {
  return (
    <ListItem sx={{ py: 1, px: 3 }}>
      <ListItemText sx={{ color: "#fff" }}>{name}</ListItemText>
    </ListItem>
  );
}

interface Props {
  open?: boolean;
  toggleDrawer: MouseEventHandler<any>;
  isDesktop: boolean;
}

export default function SidebarMenu({ open, isDesktop, toggleDrawer }: Props) {
 const { getMatchingMenuName } = useMenuMatches()

	const [openedSubMenu, setOpenedSubMenu] = useState<MenuName | undefined>(
    getMatchingMenuName(menuItems)
  );

	const dense = true

	const handleToggle = (menu: MenuName) => {
    setOpenedSubMenu(openedMenu => openedMenu === menu ? undefined : menu);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          ":root": {
            "--sidebar-background-color": "#051e34",
            // "--sidebar-background-color": "#2F1F47", 
            "--sidebar-color-title": "rgba(255, 255, 255, 0.8)",
            "--sidebar-divider": "rgba(255, 255, 255, 0.12)",
            "--sidebar-item-context": "#669df6",
            "--sidebar-item-hover": "rgba(255, 255, 2555, 0.08)",
            "--sidebar-bg-selected": "rgba(71,98,130,.2)",
          },
        }}
      />
      <Drawer
        variant={"permanent"}
        as="nav"
        open={open}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: [0],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LogoIcon
              sx={{ height: 24, width: "auto", marginLeft: 2 }}
              // onClick={() => toggleDrawer()}
            />
          </Box>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon sx={{ color: "var(--sidebar-color-title)" }} />
          </IconButton>
        </Toolbar>

        <SidebarDivider />

        <List component="nav">
          <MainListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
          />
          <SidebarDivider sx={{ my: 1 }} />
          <SecondaryListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
          />
        </List>

        <List
          component="nav"
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 0,
          }}
        >
          <SidebarDivider />
          <BottomListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
          />
        </List>
      </Drawer>
    </>
  );
}
