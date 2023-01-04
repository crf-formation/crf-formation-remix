import type { SxProps } from "@mui/material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type { ReactEventHandler, ReactNode } from "react";
import { forwardRef } from "react";
import useLocationMatchPath from "~/hooks/useLocationMatchPath";

type PropsType = {
	dense: boolean;
	href?: string | undefined;
	name: string;
	icon?: ReactNode;
	onClick?: ReactEventHandler;
	sx?: SxProps;
}

const MenuItem = forwardRef<HTMLInputElement, PropsType>((props, ref) => {
	const { dense, href, name, icon, sx, onClick } = props as PropsType
	const locationMatchPath = useLocationMatchPath()

	const matchPath = locationMatchPath(href)

	return (
    <ListItemButton
      ref={ref}
      dense={dense}
      href={href}
      onClick={onClick}
      sx={{
        ...sx,

        color: matchPath
          ? "var(--sidebar-item-context)"
          : "var(--sidebar-color-title)",

        "&:hover": {
          color: matchPath
            ? "var(--sidebar-item-context)"
            : "var(--sidebar-color-title)",
          background: "var(--sidebar-item-hover)",
        },

        "& svg": {
          fill: matchPath
            ? "var(--sidebar-item-context)"
            : "var(--sidebar-color-title)",
        },
      }}
    >
      {icon && (
        <ListItemIcon
          sx={{
            width: 24,
            minWidth: 0,
          }}
        >
          {icon}
        </ListItemIcon>
      )}
      <ListItemText
        primary={name}
        sx={{
          paddingLeft: 2,

          "& .MuiTypography-root": {
            // fontWeight: matchPath ? 500 : 400,
            fontWeight: 500,
          },
        }}
      />
    </ListItemButton>
  );
})

MenuItem.displayName = 'MenuItem'

export default MenuItem