import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Slide from "@mui/material/Collapse";
import type { ReactElement, ReactEventHandler, ReactNode } from "react";
import ChevronToggleIcon from "../icons/ChevronToggle";
import MenuItem from "./MenuItem";
import type { MenuName } from "./SidebarMenu";
import useLocationMatchPath from "~/hook/useLocationMatchPath";

export type MenuItemDefinition = {
  name: string;
  href: string;
};

export type MenuItemDefinitions = {
  [K in MenuName]: MenuItemDefinition[];
};

interface ItemsListProps {
  dense: boolean;
  items: MenuItemDefinition[];
  open: boolean;
}

function ItemsList({ dense, items, open }: ItemsListProps) {
  return (
    <Slide in={open}>
      <List
        dense={dense}
        component="div"
        disablePadding
        sx={(theme) => ({
          pb: open ? 2 : undefined,

          "& a": {
            transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" // TODO: used?
          },

          "& .MuiListItemText-root": {
            pl: 4
          }
        })}
      >
        {items?.map((item) => (
          <MenuItem
            key={item.href}
            name={item.name}
            href={item.href}
            dense={dense}
          />
        ))}
      </List>
    </Slide>
  );
}

interface HeaderProps {
  icon: ReactNode;
  name: string;
  open: boolean;
  matchPath: boolean;
  dense: boolean;
  onClick?: ReactEventHandler;
};

function Header({ icon, name, open, matchPath, dense, onClick }: HeaderProps) {
  return (
    <ListItem disablePadding component="div">
      <ListItemButton
        dense={dense}
        onClick={onClick}
        sx={{
          bgcolor: open ? "rgba(71, 98, 130, 0.2)" : null,
          color: "var(--sidebar-color-title)",

          borderLeft: matchPath ? "2px solid white" : "",

          paddingLeft: 1,
          paddingRight: 0.5,
          paddingTop: 1,
          paddingBottom: 1
        }}
      >
        <ListItemIcon sx={{ width: 24, minWidth: 0, fontSize: 20 }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={name}
          sx={{
            paddingLeft: 2,
            flex: 1,

            "& .MuiTypography-root": {
              // fontWeight: matchPath ? 500 : 400,
              fontWeight: 500
            }
          }}
        />
        <ListItemIcon
          sx={{
            minWidth: 0,
            paddingRight: 0
          }}
        >
          <ChevronToggleIcon open={open} variant="expand" />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
}

interface Props {
  items: MenuItemDefinition[];
  dense: boolean;
  handleToggle: () => void;
  icon: ReactElement;
  open: boolean;
  name: string;
}

function SubMenu(props: Props) {
  const { items, handleToggle, open, name, icon, dense } = props;
  const locationMatchPath = useLocationMatchPath();

  if (items?.length === 0) {
    return null;
  }

  const matchPath = items.some((item) => locationMatchPath(item.href));

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 1,
        margin: [0, 1],

        backgroundColor: open ? "var(--sidebar-bg-selected)" : "",

        "&:hover": {
          backgroundColor: "var(--sidebar-bg-selected)"
        }
      }}
    >
      <Header
        open={open}
        matchPath={matchPath}
        icon={icon}
        name={name}
        dense={dense}
        onClick={handleToggle}
      />

      <ItemsList items={items} dense={dense} open={open} />
    </Box>
  );
}

export default SubMenu;
