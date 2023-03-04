import AssignmentIcon from '@mui/icons-material/Assignment';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ConstructionIcon from '@mui/icons-material/Construction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShieldIcon from '@mui/icons-material/Shield';
import { Box, GlobalStyles, IconButton, List, ListItem, ListItemText, Drawer as MuiDrawer, Toolbar } from "@mui/material";
import { styled } from '@mui/material/styles';
import type { MouseEventHandler } from "react";
import { useState } from "react";
import LogoIcon from "~/component/icons/LogoHorizontal";
import useCurrentPseFormation from '~/hook/useCurrentPseFormation';
import useMenuMatches from "~/hook/useMenuMatches";
import useUser from '~/hook/useUser';
import MenuItem from "./MenuItem";
import SidebarDivider from "./SidebarDivider";
import SubMenu from "./SubMenu";
import useOptionalUser from '~/hook/useOptionalUser';
import UserMenu from './UserMenu';

type MenuProps = {
  openedMenu: MenuName;
	dense: boolean;
  handleToggle: Function;
  menuItems: Array<Map<String, any[]>>;
  isLoggedIn: boolean
}

export type MenuName = 'menuDevTools' | 'menuAdmin' | 'menuCurrentPseFormation' | undefined

const MainListItems = ({ openedMenu, handleToggle, dense, menuItems }: MenuProps) => {
  const currentPseFormation = useCurrentPseFormation()
  return (
    <>
      <MenuItem
        name="Dashboard"
        href="/dashboard"
        icon={<DashboardIcon />}
        dense={dense}
      />

      <MenuItem
        name="Formations - PSE"
        href="/pse"
        icon={<BubbleChartIcon />}
        dense={dense}
      />

      {currentPseFormation && (
        <SubMenu
          handleToggle={() => handleToggle("menuCurrentPseFormation")}
          open={openedMenu === "menuCurrentPseFormation"}
          name="Mon PSE"
          icon={<AssignmentIcon />}
          dense={dense}
          items={menuItems.menuCurrentPseFormation}
        />
      )}
    </>
  );
};

const SecondaryListItems = ({ openedMenu, handleToggle, dense, menuItems }: MenuProps) => {
  const user = useUser()
  return (
    <>
      {user.hasAdminPermission && (
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
      )}

    </>
  );
};

const BottomListItems = ({
  openedMenu,
  handleToggle,
  dense,
  menuItems,
  isLoggedIn,
}: MenuProps) => {
  const user = useOptionalUser()

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const userMenuOpen = Boolean(userMenuAnchorEl);

  return (
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

      <List>
        {isLoggedIn && user && (
          <>
            <UserMenu
              open={userMenuOpen}
              user={user}
              anchorRef={userMenuAnchorEl}
              handleClose={() => setUserMenuAnchorEl(null)}
            />
          </>
        )}

      </List>
    </>
  );
};

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
  isLoggedIn: boolean;
}

export default function SidebarMenu({ open, isLoggedIn, toggleDrawer }: Props) {
  const { getMatchingMenuName } = useMenuMatches()
  const currentPseFormation = useCurrentPseFormation()

  const menuItems = {
    menuAdmin: [
      {
        name: "Users",
        href: "/admin/user",
      },
      {
        name: "Formations - PSE",
        href: "/admin/pse",
      },
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
    ],

    menuCurrentPseFormation: !currentPseFormation ? []  : [
      {
        name: "Dashboard",
        href: `/pse/${currentPseFormation.id}`,
      },
      {
        name: "Cas concrets",
        href: `/pse/${currentPseFormation.id}/concrete-case/session`,
      },
      {
        name: "Suivi",
        href: `/pse/${currentPseFormation.id}/resume`,
      },
    ].filter(Boolean)
  };

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
              sx={{ height: 34, width: "auto", marginLeft: 2 }}
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
            menuItems={menuItems}
          />
          <SidebarDivider sx={{ my: 1 }} />
          <SecondaryListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
            menuItems={menuItems}
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
            menuItems={menuItems}
            isLoggedIn={isLoggedIn}
          />
        </List>
      </Drawer>
    </>
  );
}
