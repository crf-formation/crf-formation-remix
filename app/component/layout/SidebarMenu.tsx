import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import ConstructionIcon from "@mui/icons-material/Construction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShieldIcon from "@mui/icons-material/Shield";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import GlobalStyles from "@mui/material/GlobalStyles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import LogoIcon from "~/component/icons/LogoHorizontal";
import useMenuMatches from "~/hook/useMenuMatches";
import useOptionalUser from "~/hook/useOptionalUser";
import useUser from "~/hook/useUser";
import MenuItem from "./MenuItem";
import SidebarDivider from "./SidebarDivider";
import SubMenu from "./SubMenu";
import UserMenu from "./UserMenu";
import type { MenuDefinitionDto, MenuNameDtoEnum } from "~/dto/menu.dto";
import useOptionalRootData from "~/hook/useOptionalRootData";

type MenuProps = {
  openedMenu: MenuName;
  dense: boolean;
  handleToggle: Function;
  menuDefinition: MenuDefinitionDto;
}

export type MenuName = "menuDevTools" | "menuAdmin" | "menuCurrentPseFormation" | undefined

const MainListItems = ({ openedMenu, handleToggle, dense, menuDefinition }: MenuProps) => {
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

      <SubMenu
        handleToggle={() => handleToggle("menuCurrentPseFormation")}
        open={openedMenu === "menuCurrentPseFormation"}
        name="Mon PSE"
        icon={<AssignmentIcon />}
        dense={dense}
        items={menuDefinition.menuCurrentPseFormation}
      />
    </>
  );
};

const SecondaryListItems = ({ openedMenu, handleToggle, dense, menuDefinition }: MenuProps) => {
  const user = useUser();
  return (
    <>
      <SubMenu
        handleToggle={() => handleToggle("menuAdmin")}
        open={openedMenu === "menuAdmin"}
        name="Admin"
        icon={<ShieldIcon />}
        dense={dense}
        items={menuDefinition.menuAdmin}
      />
    </>
  );
};

const BottomListItems = (
  {
    openedMenu,
    handleToggle,
    dense,
    menuDefinition
  }: MenuProps) => {
  const user = useOptionalUser();

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
        items={menuDefinition.menuDevTools}
      />

      <List>
        {user && (
          <>
            <MenuItem
              name={user.fullName}
              onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
              aria-controls={userMenuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? "true" : undefined}
              icon={<AccountCircleIcon color="inherit" />}
              dense={dense}
            />

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
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  position: "sticky",
  top: 0, // for sticky

  height: "100vh", // TODO: ?

  [theme.breakpoints.up("xs")]: {
    display: !open ? "none" : "block"
  },
  [theme.breakpoints.up("lg")]: {
    display: "block"
  },

  "& svg": {
    fill: "var(--sidebar-color-title)"
  },

  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",

    width: "var(--sidebar-width)",
    [theme.breakpoints.down("sm")]: {
      width: `100vw`
    },

    backgroundColor: "var(--sidebar-background-color)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: 0,

      [theme.breakpoints.up("sm")]: {
        width: "var(--sidebar-closed-width)",
      }
    })
  }
}));

interface CategoryProps {
  name: string;
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
}

export default function SidebarMenu({ open }: Props) {
  const { getMatchingMenuName } = useMenuMatches();
  const rootData = useOptionalRootData();

  const [openedSubMenu, setOpenedSubMenu] = useState<
    MenuNameDtoEnum | undefined
  >(rootData ? getMatchingMenuName(rootData.menuDefinition) : undefined);

  const dense = true;

  const handleToggle = (menu: MenuName) => {
    setOpenedSubMenu(openedMenu => openedMenu === menu ? undefined : menu);
  };

  if (!rootData?.menuDefinition) {
    return null;
  }

  const { menuDefinition } = rootData;

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
            "--sidebar-bg-selected": "rgba(71,98,130,.2)"
          }
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
            p: [0]
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LogoIcon
              sx={{ height: 34, width: "auto", marginLeft: 2 }}
              // onClick={() => toggleDrawer()}
            />
          </Box>
        </Toolbar>

        <SidebarDivider />

        <List component="nav">
          <MainListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
            menuDefinition={menuDefinition}
          />
          <SidebarDivider sx={{ my: 1 }} />
          <SecondaryListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
            menuDefinition={menuDefinition}
          />
        </List>

        <List
          component="nav"
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 0
          }}
        >
          <SidebarDivider />
          <BottomListItems
            dense={dense}
            openedMenu={openedSubMenu}
            handleToggle={handleToggle}
            menuDefinition={menuDefinition}
          />
        </List>
      </Drawer>
    </>
  );
}
