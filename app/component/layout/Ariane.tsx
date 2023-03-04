import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Link } from "@mui/material";
import type { ReactNode } from "react";
import React from "react";

export function ArianeBackItem({ href }: { href: string }) {
  return (
    <ArianeItem
      href={href}
      label={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ChevronLeftIcon /> Back
        </Box>
      }
    />
  );
}

interface ArianeItemProps {
	label: string | ReactNode;
	href?: Optional<string>;
}

export function ArianeItem({ label, href }: ArianeItemProps) {
	return href ? (
    <Link
      href={href}
      sx={{
        // avoid having link color + underline
        textDecoration: "none",
        color: "inherit"
      }}
    >
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

interface Props {
	children: Array<ReactNode> | ReactNode;
}

export function Ariane({ children: childrenParam }: Props) {
  if (!childrenParam) {
    return null
  }

  const children = (Array.isArray(childrenParam) ? childrenParam : [ childrenParam ])
  	// filter nil values and empty array (resulting of a map with no Ariane builded)
    .filter(child => Boolean(child) && (!Array.isArray(child) || child.length > 0))

	return (
    <Box sx={{ display: "flex", pt: 2, pl: 4 }}>
      {React.Children.map(children, (child: ReactNode, index: number) => (
        <Box sx={{ display: "flex", }}>
          {child}
          {children.length > 1 && children.length - 1 !== index && <ChevronRightIcon />}
        </Box>
      ))}
    </Box>
  );
}
